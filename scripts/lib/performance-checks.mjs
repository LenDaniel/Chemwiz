import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export function assessBuild(directory, budgets) {
  const root = fs.realpathSync(directory);
  function checkedFile(relative) {
    if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error('Invalid build manifest path.');
    const filename = fs.realpathSync(path.join(root, relative));
    if (!filename.startsWith(root + path.sep) || !fs.statSync(filename).isFile()) throw new Error('Build asset is outside the compiled directory.');
    return filename;
  }
  const manifest = JSON.parse(fs.readFileSync(checkedFile('.vite/manifest.json'), 'utf8'));
  const files = new Map();
  function inventory(folder) {
    for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
      if (item.name === '.vite') continue;
      const filename = path.join(folder, item.name);
      if (item.isDirectory()) inventory(filename);
      else {
        const relative = path.relative(root, filename).split(path.sep).join('/');
        const bytes = fs.readFileSync(checkedFile(relative));
        files.set(relative, { raw: bytes.length, gzip: gzipSync(bytes).length });
      }
    }
  }
  inventory(root);
  for (const [key, item] of Object.entries(manifest)) {
    if (!item || typeof item.file !== 'string') throw new Error(`Incomplete build manifest entry: ${key}`);
    checkedFile(item.file);
    for (const dependency of [...(item.imports || []), ...(item.dynamicImports || [])]) {
      if (!manifest[dependency]) throw new Error(`Missing manifest dependency: ${dependency}`);
    }
    for (const asset of [...(item.css || []), ...(item.assets || [])]) checkedFile(asset);
  }
  function closure(key, visited = new Set()) {
    if (visited.has(key)) return visited;
    visited.add(key);
    for (const imported of manifest[key].imports || []) closure(imported, visited);
    return visited;
  }
  const initial = new Set(), entryJsGzipBytes = {}, studentModules = new Set(), adminModules = new Set();
  for (const key of budgets.requiredEntries) {
    if (!manifest[key] || (!manifest[key].isEntry && !manifest[key].file.endsWith('.css'))) throw new Error(`Missing compiled workspace entry: ${key}`);
    checkedFile(key); // Vite records a CSS-only HTML entry without isEntry.
    const modules = closure(key);
    const js = new Set([...modules].map(name => manifest[name].file).filter(name => name.endsWith('.js')));
    entryJsGzipBytes[key] = [...js].reduce((sum, name) => sum + files.get(name).gzip, 0);
    for (const name of js) initial.add(name);
    if (key === 'student/index.html') for (const name of modules) studentModules.add(name);
    if (key === 'admin/index.html') for (const name of modules) adminModules.add(name);
  }
  const topicModules = Object.keys(manifest).filter(key => /^student\/src\/content\/[^/]+\.jsx$/.test(key));
  const metrics = {
    entryJsGzipBytes,
    totalJsGzipBytes: 0, totalCssGzipBytes: 0, largestLazyJsGzipBytes: 0,
    totalRawBytes: 0, largestFileRawBytes: 0,
    deferredTopics: topicModules.filter(key => !studentModules.has(key)).length,
    searchDeferred: Boolean(manifest[budgets.searchModule]) && !studentModules.has(budgets.searchModule),
  };
  for (const [name, size] of files) {
    metrics.totalRawBytes += size.raw;
    metrics.largestFileRawBytes = Math.max(metrics.largestFileRawBytes, size.raw);
    if (name.endsWith('.js')) {
      metrics.totalJsGzipBytes += size.gzip;
      if (!initial.has(name)) metrics.largestLazyJsGzipBytes = Math.max(metrics.largestLazyJsGzipBytes, size.gzip);
    }
    if (name.endsWith('.css')) metrics.totalCssGzipBytes += size.gzip;
  }
  const checks = Object.entries(entryJsGzipBytes).map(([entry, value]) => ({ name: `Initial JavaScript: ${entry}`, value, limit: budgets.limits.entryJsGzipBytes, status: value <= budgets.limits.entryJsGzipBytes ? 'PASS' : 'FAIL' }));
  for (const [name, limit] of Object.entries(budgets.limits)) {
    if (name === 'entryJsGzipBytes') continue;
    const value = metrics[name];
    checks.push({ name, value, limit, status: Number.isFinite(value) && value <= limit ? 'PASS' : 'FAIL' });
  }
  checks.push({ name: 'Topics stay deferred', value: metrics.deferredTopics, minimum: budgets.minimumDeferredTopics, status: metrics.deferredTopics >= budgets.minimumDeferredTopics && !topicModules.some(key => studentModules.has(key)) ? 'PASS' : 'FAIL' });
  checks.push({ name: 'Search stays deferred', status: metrics.searchDeferred ? 'PASS' : 'FAIL' });
  if (budgets.adminUsersModule) {
    metrics.usersPanelDeferred = Boolean(manifest[budgets.adminUsersModule]) && !adminModules.has(budgets.adminUsersModule);
    checks.push({ name: 'Admin users controls stay deferred', status: metrics.usersPanelDeferred ? 'PASS' : 'FAIL' });
  }
  return { status: checks.every(check => check.status === 'PASS') ? 'PASS' : 'FAIL', metrics, checks,
    limits: budgets.limits, scope: 'Compiled payload and lazy-loading regression checks; not Core Web Vitals or physical-device performance.' };
}
