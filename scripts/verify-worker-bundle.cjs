const fs = require('node:fs');
const path = require('node:path');
const file = path.resolve(__dirname, '../cloudflare-build/worker.js');
const code = fs.readFileSync(file, 'utf8');
if (/node_modules\/mongoose\/dist\/browser\.umd\.js/.test(code)) throw new Error('The Worker contains the Mongoose browser build. Check the mongoose alias.');
if (!code.includes('connectWorkerDatabase') || !code.includes('withWorkerMongoRequest')) throw new Error('The Worker is missing request-owned MongoDB connections.');
if (!code.includes('routeStatic') || !code.includes('cloudflare:node')) throw new Error('The Worker is missing the unified workspace/API router.');
console.log('Worker bundle: PASS (Mongoose Node build, request-owned MongoDB and unified workspace routing).');
