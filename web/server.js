const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const express = require('express');
const helmet = require('helmet');
const { setup } = require('./scripts/setup.cjs');
const root = __dirname;

async function createApplication({ development = false } = {}) {
  setup();
  require('dotenv').config({ path: path.join(root, '.env'), quiet: true });
  // Relative data paths always refer to the application folder, even on hosting.
  if (process.env.LOCAL_DATA_FILE) {
    process.env.LOCAL_DATA_FILE = path.resolve(root, process.env.LOCAL_DATA_FILE);
  }
  const { validateRuntimeConfig } = require('./backend/src/config/runtime');
  const config = validateRuntimeConfig();
  await require('./backend/src/config/db')();

  const app = express();
  app.disable('x-powered-by');
  app.enable('strict routing');
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  app.use(helmet({
    // Existing learner content uses inline style props. Keep scripts same-origin.
    contentSecurityPolicy: development ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        mediaSrc: ["'self'", 'blob:'],
        upgradeInsecureRequests: null,
      },
    },
    strictTransportSecurity: process.env.NODE_ENV === 'production' ? undefined : false,
  }));
  // Authentication and role checks stay on the server. API failures always use JSON.
  const api = require('./backend/app');
  api.set('trust proxy', app.get('trust proxy'));
  app.use((req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) return api(req, res, next);
    next();
  });
  const server = http.createServer(app);
  let vite = null;
  if (development) {
    const { createServer } = await import('vite');
    vite = await createServer({
      configFile: path.join(root, 'vite.config.mjs'),
      appType: 'custom',
      server: {
        middlewareMode: true,
        hmr: { server },
        fs: { allow: [path.join(root, 'web'), path.join(root, 'shared'), path.join(root, 'node_modules')] },
      },
    });
    app.use(vite.middlewares);
  } else {
    for (const file of ['index.html', 'student/index.html', 'admin/index.html']) {
      if (!fs.existsSync(path.join(root, 'dist', file))) {
        throw new Error('The web build is missing. Run npm run build, then npm start.');
      }
    }
    app.use(express.static(path.join(root, 'dist'), {
      index: false,
      redirect: false,
      dotfiles: 'deny',
      setHeaders(res, filename) {
        res.setHeader('Cache-Control', filename.includes(`${path.sep}assets${path.sep}`)
          ? 'public, max-age=31536000, immutable' : 'no-cache');
      },
    }));
  }
  app.get(['/student', '/admin'], (req, res) => res.redirect(308, `${req.path}/${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`));
  app.use(async (req, res, next) => {
    if (!['GET', 'HEAD'].includes(req.method)) return next();
    const route = req.path === '/' || req.path === '/index.html' ? 'index.html'
      : /^\/(student|admin)\/(?:[^.]*|index\.html)$/.test(req.path)
        ? `${req.path.split('/')[1]}/index.html` : null;
    if (!route) return next();
    try {
      res.setHeader('Cache-Control', 'no-store');
      if (vite) {
        const template = fs.readFileSync(path.join(root, 'web', route), 'utf8');
        const html = await vite.transformIndexHtml(`/${route}`, template);
        return res.status(200).type('html').send(html);
      }
      return res.sendFile(path.join(root, 'dist', route));
    } catch (error) {
      if (vite) vite.ssrFixStacktrace(error);
      next(error);
    }
  });
  app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
  app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(error.statusCode || 500).json({ success: false, message: 'ChemWiz could not complete this request.' });
  });
  return { app, server, vite, config };
}

async function start() {
  const instance = await createApplication({ development: process.argv.includes('--dev') });
  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  await new Promise((resolve, reject) => {
    instance.server.once('error', reject);
    instance.server.listen(port, process.env.HOST || '0.0.0.0', resolve);
  });
  console.log(`ChemWiz running: http://localhost:${port}`);
  console.log(`Student: /student/ | Admin: /admin/ | Data: ${instance.config.dataMode}`);
  let closing = false;
  const shutdown = async () => {
    if (closing) return;
    closing = true;
    if (instance.vite) await instance.vite.close();
    await new Promise((resolve) => instance.server.close(resolve));
    if (instance.config.dataMode === 'mongodb') await require('mongoose').disconnect();
  };
  process.once('SIGINT', () => shutdown().then(() => process.exit(0)));
  process.once('SIGTERM', () => shutdown().then(() => process.exit(0)));
  return instance;
}
module.exports = { createApplication, start };
if (require.main === module) start().catch((error) => {
  console.error('ChemWiz startup failed:', error.code === 'EADDRINUSE' ? 'The port is already in use. Stop the previous ChemWiz process and retry.' : error.message);
  process.exit(1);
});
