import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isBuiltin } from 'node:module';
import { parseSync } from 'vite';

const codeExtensions = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']);
const skipped = new Set(['node_modules', 'dist', '.git', '.wrangler', 'cloudflare-build']);
const rootOnlySkipped = new Set(['data', '.build-checks', 'verification', 'patch-backups', 'test-results']);
export function projectFiles(root) {
  const output = [];
  function scan(folder) {
    for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
      if (skipped.has(item.name) || (folder === root && rootOnlySkipped.has(item.name)) || item.isSymbolicLink()) continue;
      const filename = path.join(folder, item.name);
      if (item.isDirectory()) scan(filename);
      else if ((!item.name.startsWith('.env') && !item.name.startsWith('.dev.vars') || ['.env.example', '.env.production.example', '.dev.vars.example'].includes(item.name)) && !/\.(log|tmp|zip)$/.test(item.name)) {
        output.push(path.relative(root, filename).split(path.sep).join('/'));
      }
    }
  }
  scan(root);
  return output.sort();
}
export function sourceFingerprint(root) {
  const files = projectFiles(root).filter((file) => file !== 'web/student/src/search/lessonManifest.json' &&
    (codeExtensions.has(path.extname(file)) || ['.json', '.jsonc', '.webmanifest', '.html', '.css', '.png', '.svg', '.jpg', '.woff2'].includes(path.extname(file)) || ['AGENTS.md', 'BUILD_RULES.md', '.node-version', '.gitignore', '.env.example', '.env.production.example', '.dev.vars.example'].includes(file)));
  const hash = createHash('sha256');
  const fileHashes = {};
  for (const file of files) {
    let bytes = fs.readFileSync(path.join(root, file));
    if (codeExtensions.has(path.extname(file)) || ['.json', '.jsonc', '.webmanifest', '.html', '.css', '.svg', '.md'].includes(path.extname(file)) || ['.gitignore', '.node-version', '.env.example', '.env.production.example', '.dev.vars.example'].includes(file)) {
      bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));
    }
    hash.update(file).update('\0').update(bytes).update('\0');
    fileHashes[file] = createHash('sha256').update(bytes).digest('hex');
  }
  return { digest: hash.digest('hex'), files: files.length, fileHashes };
}
export function compiledFingerprint(root) {
  const folder = path.join(root, 'dist');
  if (!fs.existsSync(folder)) return null;
  const files = [];
  const hash = createHash('sha256');
  function collect(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, item.name);
      if (item.isDirectory()) collect(filename); else if (item.isFile()) files.push(filename);
    }
  }
  collect(folder);
  for (const file of files.sort()) hash.update(path.relative(folder, file).split(path.sep).join('/')).update('\0').update(fs.readFileSync(file)).update('\0');
  return files.length ? hash.digest('hex') : null;
}
export function walk(node, visit, parents = []) {
  if (!node || typeof node !== 'object' || typeof node.type !== 'string') return;
  visit(node, parents);
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'range', 'comments', 'tokens', 'parent'].includes(key)) continue;
    if (Array.isArray(value)) for (const child of value) walk(child, visit, [...parents, node]);
    else if (value && typeof value === 'object') walk(value, visit, [...parents, node]);
  }
}
function literal(node) { return node?.type === 'Literal' && typeof node.value === 'string' ? node.value : null; }
function member(node) { return node?.type === 'MemberExpression' ? (node.computed ? literal(node.property) : node.property.name) : null; }
function name(node) { return node?.name || member(node) || (node?.type === 'CallExpression' ? name(node.callee) : 'inline'); }
function owner(parents) {
  for (let i = parents.length - 1; i >= 0; i--) {
    const node = parents[i];
    if (node.type === 'FunctionDeclaration' && node.id) return node.id.name;
    if (node.type === 'VariableDeclarator' && ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init?.type)) return node.id.name;
  }
  return '(module)';
}
function strings(node, bindings = new Map(), seen = new Set()) {
  if (!node) return null;
  if (literal(node) !== null) return [node.value];
  if (node.type === 'ArrayExpression') {
    const values = node.elements.map((item) => strings(item, bindings, seen));
    return values.every(Boolean) ? values.flat() : null;
  }
  if (node.type === 'Identifier') {
    if (bindings.has(node.name) && !seen.has(node.name)) {
      const value = strings(bindings.get(node.name), bindings, new Set([...seen, node.name]));
      if (value) return value;
    }
    return [`:${node.name}`];
  }
  if (node.type === 'ConditionalExpression') {
    const a = strings(node.consequent, bindings, seen), b = strings(node.alternate, bindings, seen);
    return a && b ? [...a, ...b] : null;
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const a = strings(node.left, bindings, seen), b = strings(node.right, bindings, seen);
    return a && b ? a.flatMap((x) => b.map((y) => x + y)) : null;
  }
  if (node.type === 'TemplateLiteral') {
    let values = [node.quasis[0].value.cooked];
    for (let i = 0; i < node.expressions.length; i++) {
      const next = strings(node.expressions[i], bindings, seen);
      if (!next || values.length * next.length > 32) return null;
      values = values.flatMap((value) => next.map((suffix) => value + suffix + node.quasis[i + 1].value.cooked));
    }
    return values;
  }
  return null;
}
export function canonicalRoute(value) {
  return String(value).split('?')[0].replace(/\/+$/, '').replace(/:[A-Za-z_$][\w$]*/g, ':param') || '/';
}
export function routeMatches(pattern, value) {
  const escaped = canonicalRoute(pattern).split('/').map((part) => part === ':param' ? '[^/]+' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('/');
  return new RegExp(`^${escaped}/?$`).test(String(value).split('?')[0]);
}
function jsonValue(node) {
  if (node?.type === 'ParenthesizedExpression') return jsonValue(node.expression);
  if (node?.type === 'Literal') return node.value === null || ['string', 'number', 'boolean'].includes(typeof node.value);
  if (node?.type === 'UnaryExpression') return node.operator === '-' && node.argument.type === 'Literal' && typeof node.argument.value === 'number';
  if (node?.type === 'ArrayExpression') return node.elements.every(jsonValue);
  if (node?.type === 'ObjectExpression') return node.properties.every((property) => property.type === 'Property' && !property.computed && literal(property.key) !== null && jsonValue(property.value));
  return false;
}
function exportsOf(ast) {
  const output = new Set();
  for (const node of ast.body) {
    if (node.type === 'ExportDefaultDeclaration') output.add('default');
    if (node.type === 'ExportAllDeclaration') output.add('*');
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration?.id) output.add(node.declaration.id.name);
      for (const item of node.declaration?.declarations || []) if (item.id.type === 'Identifier') output.add(item.id.name);
      for (const item of node.specifiers || []) output.add(item.exported.name || item.exported.value);
    }
  }
  return output;
}
export function analyzeProject(root, { overrides = new Map(), contracts } = {}) {
  contracts ||= JSON.parse(fs.readFileSync(path.join(root, 'scripts/integration-contracts.json'), 'utf8'));
  const issues = [], warnings = [], asts = new Map(), sources = new Map();
  const fail = (code, file, message) => issues.push({ severity: 'high', code, file, message });
  const files = projectFiles(root);
  function read(file) { return overrides.has(file) ? overrides.get(file) : fs.readFileSync(path.join(root, file), 'utf8'); }
  for (const file of files) {
    if (['.json', '.webmanifest'].includes(path.extname(file))) {
      try { JSON.parse(read(file)); } catch { fail('INVALID_JSON', file, 'JSON could not be parsed.'); }
    }
    if (path.extname(file) === '.jsonc') {
      const parsed = parseSync(file + '.js', `const config = (${read(file)});`);
      if (parsed.errors.length) fail('INVALID_JSONC', file, 'JSON-with-comments configuration could not be parsed.');
      else if (!jsonValue(parsed.program.body[0]?.declarations?.[0]?.init)) fail('INVALID_JSONC', file, 'Configuration must contain JSON data values, not executable expressions.');
    }
    if (!codeExtensions.has(path.extname(file))) continue;
    const text = read(file); sources.set(file, text);
    try {
      const parsed = parseSync(file, text);
      if (parsed.errors.length) fail('INVALID_SYNTAX', file, parsed.errors.map((error) => error.message).join('; '));
      else asts.set(file, parsed.program);
    } catch (error) { fail('INVALID_SYNTAX', file, error.message); }
  }
  function resolveRelative(file, specifier) {
    const clean = specifier.split('?')[0];
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), clean));
    return [base, ...['.js', '.jsx', '.mjs', '.cjs', '.json', '.ts', '.tsx'].map((ext) => base + ext), path.posix.join(base, 'index.js')]
      .find((candidate) => files.includes(candidate) || fs.existsSync(path.join(root, candidate)));
  }
  let imports = 0;
  const pkg = JSON.parse(read('package.json'));
  const declared = new Set(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }));
  for (const [file, ast] of asts) {
    if (/^(backend\/src|web\/(student|admin)\/src)\//.test(file)) walk(ast, (node) => {
      if (node.type === 'Literal' && typeof node.value === 'string' && /sk-(?:proj-)?[A-Za-z0-9_-]{20,}|mongodb(?:\+srv)?:\/\/[^\s]+:[^\s]+@/.test(node.value)) fail('SOURCE_CREDENTIAL', file, 'A credential-bearing key or database URI is embedded in application source.');
      if (node.type === 'CallExpression' && node.callee.object?.name === 'jwt' && ['sign', 'verify'].includes(member(node.callee)) && literal(node.arguments[1]) !== null) fail('HARDCODED_JWT_SECRET', file, 'JWT operations must use the private runtime secret.');
    });
    walk(ast, (node) => {
      let specifier = null, importedNames = [];
      if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) {
        specifier = literal(node.source);
        importedNames = (node.specifiers || []).filter((item) => item.type === 'ImportSpecifier').map((item) => item.imported.name || item.imported.value);
      } else if (node.type === 'ImportExpression') {
        specifier = literal(node.source);
        if (specifier === null) fail('UNRESOLVED_IMPORT', file, 'Dynamic import needs an analyzable literal path.');
      } else if (node.type === 'CallExpression' && node.callee.name === 'require') {
        specifier = literal(node.arguments[0]);
        if (specifier === null) fail('UNRESOLVED_IMPORT', file, 'Dynamic require needs an analyzable literal path.');
      } else if (node.type === 'NewExpression' && node.callee.name === 'URL' && literal(node.arguments[0])?.startsWith('.')) {
        specifier = literal(node.arguments[0]);
      }
      if (!specifier) return;
      imports++;
      if (specifier.startsWith('.')) {
        const target = resolveRelative(file, specifier);
        if (!target) fail('MISSING_IMPORT', file, `Missing relative import: ${specifier}`);
        else if (file.startsWith('web/') && asts.has(target)) {
          const exported = exportsOf(asts.get(target));
          for (const value of importedNames) if (!exported.has(value) && !exported.has('*')) fail('MISSING_EXPORT', file, `Import ${value} is not exported by ${target}.`);
        }
      } else if (!isBuiltin(specifier) && !specifier.startsWith('cloudflare:')) {
        const dependency = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
        if (!declared.has(dependency)) fail('UNDECLARED_DEPENDENCY', file, `Package is not declared: ${dependency}`);
      }
    });
  }
  const frontend = [];
  for (const [file, ast] of asts) {
    if (!/^web\/(student|admin)\/src\//.test(file)) continue;
    const bindings = new Map(), edges = new Set(), helperFile = /\/config\/api\.js$/.test(file);
    walk(ast, (node) => { if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') bindings.set(node.id.name, node.init); });
    function transportName(node, seen = new Set()) {
      const value = name(node);
      if (['fetch', 'fetchBackend', 'apiRequest'].includes(value)) return value;
      if (node?.type === 'Identifier' && !seen.has(node.name) && bindings.has(node.name)) return transportName(bindings.get(node.name), new Set([...seen, node.name]));
      return null;
    }
    if (helperFile && strings(bindings.get('API_BASE_URL'), bindings)?.[0] !== '') fail('API_BASE_NOT_SAME_ORIGIN', file, 'The unified application requires an empty API_BASE_URL.');
    walk(ast, (node, parents) => {
      if (['CallExpression', 'NewExpression'].includes(node.type) && ['eval', 'Function'].includes(name(node.callee))) fail('DYNAMIC_EXECUTION', file, 'Executable string evaluation is not permitted in the frontend.');
      if (node.type !== 'CallExpression') return;
      const callee = transportName(node.callee) || name(node.callee), fn = owner(parents);
      if (['fetch', 'fetchBackend', 'apiRequest'].includes(callee)) edges.add(`${fn}->${callee}`);
      const transport = ['fetch', 'fetchBackend', 'apiRequest'].includes(callee) ||
        (node.callee.type === 'MemberExpression' && node.callee.object.name === 'axios');
      if (!transport) {
        if (strings(node.arguments[0], bindings)?.some((value) => value.startsWith('/api/'))) fail('UNKNOWN_API_TRANSPORT', file, `Possible API call through ${callee} requires an explicit transport adapter.`);
        return;
      }
      if (helperFile && ['fetchBackend', 'apiRequest'].includes(fn)) return;
      const paths = strings(node.arguments[0], bindings);
      if (!paths) { fail('UNRESOLVED_FRONTEND_API', file, `Cannot resolve the request path in ${fn}.`); return; }
      const options = node.arguments[1];
      let method = node.callee.object?.name === 'axios' ? member(node.callee).toUpperCase() : 'GET';
      const property = options?.type === 'ObjectExpression' && options.properties.find((item) => (item.key?.name || item.key?.value) === 'method');
      if (property) {
        const value = literal(property.value);
        if (!value) { fail('UNRESOLVED_HTTP_METHOD', file, `Cannot resolve the HTTP method in ${fn}.`); return; }
        method = value.toUpperCase();
      }
      for (const value of new Set(paths.map(canonicalRoute))) {
        if (!value.startsWith('/api/')) { fail('UNRESOLVED_FRONTEND_API', file, `${fn} does not use a same-origin /api path.`); continue; }
        if (!frontend.some((item) => item.file === file && item.export === fn && item.method === method && item.path === value)) frontend.push({ file, export: fn, method, path: value });
      }
    });
    if (helperFile && (!edges.has('fetchBackend->fetch') || !edges.has('apiRequest->fetchBackend'))) fail('BROKEN_TRANSPORT', file, 'API wrappers do not reach the fetch transport.');
  }
  const backend = [], mounted = new Set();
  function collectRouter(file, prefix = '', inherited = [], ancestors = []) {
    if (ancestors.includes(file)) { fail('ROUTER_CYCLE', file, 'Router mount cycle detected.'); return; }
    const ast = asts.get(file);
    if (!ast) { fail('MISSING_ROUTER', file, 'Mounted router is missing or invalid.'); return; }
    mounted.add(file);
    const bindings = new Map(), routerNames = new Set(), calls = [];
    walk(ast, (node) => {
      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
        bindings.set(node.id.name, node.init);
        if (node.init?.type === 'CallExpression' && (name(node.init.callee) === 'Router' || node.init.callee.name === 'express')) routerNames.add(node.id.name);
      }
      if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && routerNames.has(node.callee.object.name)) calls.push(node);
    });
    const guards = [];
    const moduleFor = (node) => {
      if (node?.type === 'Identifier') node = bindings.get(node.name);
      if (node?.type === 'CallExpression' && node.callee.name === 'require' && literal(node.arguments[0])?.startsWith('.')) {
        const target = resolveRelative(file, literal(node.arguments[0]));
        let router = false;
        walk(asts.get(target), (item) => {
          if (item.type === 'CallExpression' && (member(item.callee) === 'Router' || item.callee.name === 'express')) router = true;
        });
        return router ? target : null;
      }
      return null;
    };
    for (const call of calls.sort((a, b) => a.start - b.start)) {
      const method = member(call.callee);
      if (method === 'route') { fail('UNRESOLVED_BACKEND_ROUTE', file, 'Chained router.route declarations need an explicit analyzer adapter.'); continue; }
      if (!['use', 'get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'].includes(method)) continue;
      const first = literal(call.arguments[0]);
      const hasPath = first !== null || call.arguments[0]?.type === 'ArrayExpression';
      const paths = hasPath ? strings(call.arguments[0], bindings) : [''];
      if (!paths) { fail('UNRESOLVED_BACKEND_ROUTE', file, 'Backend route/mount path is not a supported literal.'); continue; }
      const handlers = call.arguments.slice(hasPath ? 1 : 0);
      for (const route of paths) {
        const full = `${prefix}${route}`.replace(/\/+$/, '') || '/';
        const before = guards.filter((guard) => !guard.path || full === guard.path || full.startsWith(guard.path + '/')).flatMap((guard) => guard.names);
        if (method === 'use') {
          const children = handlers.map(moduleFor);
          const childIndex = children.findIndex(Boolean);
          const child = children[childIndex];
          if (child) collectRouter(child, full === '/' ? '' : full, [...inherited, ...before, ...handlers.slice(0, childIndex).map(name)], [...ancestors, file]);
          else guards.push({ path: hasPath ? full : '', names: handlers.map(name) });
        } else backend.push({ file, method: method.toUpperCase(), path: full, middleware: [...inherited, ...before, ...handlers.map(name)] });
      }
    }
  }
  collectRouter('backend/app.js');
  for (const file of files.filter((file) => /^backend\/src\/routes\/.*\.js$/.test(file))) if (!mounted.has(file)) fail('UNMOUNTED_ROUTER', file, 'Router file is not connected to the backend application.');
  for (const route of backend) {
    const publicRule = contracts.publicRoutes.find((item) => item.method === route.method && canonicalRoute(item.path) === canonicalRoute(route.path));
    if (!publicRule && !route.middleware.includes('protect')) fail('AUTH_MIDDLEWARE_MISSING', route.file, `${route.method} ${route.path} lacks authentication middleware.`);
    if (route.path.startsWith('/api/admin') && (!route.middleware.includes('adminOnly') || route.middleware.indexOf('protect') > route.middleware.indexOf('adminOnly'))) fail('ADMIN_MIDDLEWARE_MISSING', route.file, `${route.method} ${route.path} lacks ordered authentication/admin middleware.`);
    if (['/api/tutor/message', '/api/tutor/transcribe', '/api/tutor/live/session'].includes(route.path) && !route.middleware.includes('requirePremium')) fail('PREMIUM_MIDDLEWARE_MISSING', route.file, `${route.method} ${route.path} lacks Premium middleware.`);
    const authLimit = route.path === '/api/auth/login' ? 'loginLimiter' : route.path === '/api/auth/register' ? 'registerLimiter' : ['/api/auth/forgot-password','/api/auth/reset-password','/api/auth/upgrade-password'].includes(route.path) ? 'recoveryLimiter' : null;
    if(authLimit && !route.middleware.includes(authLimit)) fail('AUTH_THROTTLE_MISSING',route.file,`${route.method} ${route.path} lacks its attempt limiter.`);
    if (!['/api/health', '/api/ready'].includes(route.path) && !route.middleware.includes('ensureDataReady')) fail('DATA_MIDDLEWARE_MISSING', route.file, `${route.method} ${route.path} bypasses data readiness.`);
  }
  for (const request of frontend) {
    const route = backend.find((item) => item.method === request.method && canonicalRoute(item.path) === request.path);
    if (!route) fail('MISSING_API_ROUTE', request.file, `${request.export} calls ${request.method} ${request.path}, which has no mounted backend route.`);
    else request.backend = { file: route.file, path: route.path, middleware: route.middleware };
    const probe = contracts.frontendProbes.find((item) => item.file === request.file && item.export === request.export);
    if (!probe || probe.method !== request.method || canonicalRoute(probe.path) !== request.path) fail('MISSING_CONNECTION_PROBE', request.file, `${request.export} has no matching executable connection contract.`);
  }
  for (const probe of contracts.frontendProbes) if (!frontend.some((item) => item.file === probe.file && item.export === probe.export)) fail('STALE_CONNECTION_PROBE', probe.file, `Contract export is no longer found: ${probe.export}.`);
  const authSource = sources.get('backend/src/routes/auth.routes.js') || '';
  if (authSource.includes('password.length < 6')) warnings.push({ severity: 'medium', code: 'SIGNUP_PASSWORD_MINIMUM', file: 'backend/src/routes/auth.routes.js', message: 'Existing signup minimum is six characters; stronger password policy remains hardening work.' });
  if (!/rateLimit|authLimiter|loginLimiter/.test(authSource)) warnings.push({ severity: 'medium', code: 'AUTH_RATE_LIMIT_REVIEW', file: 'backend/src/routes/auth.routes.js', message: 'Login/register attempt throttling needs a dedicated production hardening review.' });
  return { passed: issues.length === 0, files: asts.size, imports, frontend, backend, issues, warnings };
}
