import { createServer } from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import { routeStatic, json, securedResponse } from './routing.mjs';
import mongoContext from '../backend/src/data/workerMongoContext.js';

let apiApplication;
const nodeServer = createServer(async (req, res) => {
  try {
    if (!apiApplication) apiApplication = import('../backend/app.js').then((module) => {
      module.default.set('trust proxy', 1);
      return module.default;
    });
    const app = await apiApplication;
    app(req, res);
  } catch (error) {
    apiApplication = null;
    console.error('ChemWiz API initialization failed:', error.name, error.code || 'INITIALIZATION_FAILED');
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, code: 'WORKER_STARTUP_FAILED', message: 'The ChemWiz backend could not initialize. Check deployment logs and configuration.' }));
  }
});
nodeServer.listen(3000);
const bridge = httpServerHandler({ port: 3000 });
const CONFIG_KEYS = ['APP_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'MONGODB_URI', 'OPENAI_API_KEY',
  'AI_MODEL', 'AI_TRANSCRIPTION_MODEL', 'AI_DAILY_MESSAGE_LIMIT', 'AI_DAILY_VOICE_LIMIT',
  'AI_LIVE_VOICE_ENABLED', 'AI_REALTIME_MODEL', 'AI_DAILY_LIVE_SESSIONS_LIMIT', 'PAYMENT_PROVIDER'];

function configure(env) {
  process.env.CHEMWIZ_RUNTIME = 'cloudflare-worker';
  process.env.DATA_MODE = 'mongodb';
  delete process.env.MONGO_URI;
  delete process.env.MONGO_URL;
  delete process.env.AI_API_KEY;
  // No local .env, local users or local JSON database is part of a Worker deployment.
  for (const key of CONFIG_KEYS) {
    if (typeof env[key] === 'string') process.env[key] = env[key];
    else if (['JWT_SECRET', 'MONGODB_URI', 'OPENAI_API_KEY'].includes(key)) delete process.env[key];
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!(url.pathname === '/api' || url.pathname.startsWith('/api/'))) return routeStatic(request, env.ASSETS);
    configure(env);
    process.env.APP_URL = env.APP_URL || url.origin;
    if (url.pathname === '/api/health') return json({
      success: true, service: 'chemwiz-unified', runtime: 'cloudflare-worker', dataMode: 'mongodb',
      configuration: { jwtConfigured: Boolean(env.JWT_SECRET), databaseConfigured: Boolean(env.MONGODB_URI), openAIConfigured: Boolean(env.OPENAI_API_KEY) },
    });
    if (!env.MONGODB_URI || !env.JWT_SECRET) return json({ success: false, code: 'RUNTIME_CONFIG_MISSING', message: 'Set MONGODB_URI and JWT_SECRET as Cloudflare Worker secrets.' }, 503);
    if (env.JWT_SECRET.length < 32) return json({ success: false, code: 'RUNTIME_CONFIG_MISSING', message: 'JWT_SECRET must contain at least 32 characters.' }, 503);
    try {
      return await mongoContext.withWorkerMongoRequest(async () => {
        const headers = new Headers(request.headers);
        headers.set('X-Forwarded-Proto', url.protocol.slice(0, -1));
        headers.set('X-Forwarded-Host', url.host);
        headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '127.0.0.1');
        const response = await bridge.fetch(new Request(request, { headers }), env, ctx);
        // Finish response generation before closing this request's Mongo sockets.
        const body = await response.arrayBuffer();
        return securedResponse(new Response(body.byteLength ? body : null, { status: response.status, statusText: response.statusText, headers: response.headers }), { api: true });
      });
    } catch (error) {
      console.error('ChemWiz Worker request failed:', error.name, error.code || 'DATABASE_UNAVAILABLE');
      return json({ success: false, code: 'DATABASE_UNAVAILABLE', message: 'The production database could not be reached. Check Atlas access, credentials and Worker logs.' }, 503);
    }
  },
};
