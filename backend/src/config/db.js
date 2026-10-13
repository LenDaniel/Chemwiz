const mongoose = require('mongoose');
const { getDataMode, getMongoUri } = require('./runtime');

let localInitializationPromise = null;
let mongoConnectionPromise = null;

function assertMongooseNodeBuild() {
  if (!mongoose || typeof mongoose.connect !== 'function') {
    const keys = mongoose && typeof mongoose === 'object'
      ? Object.keys(mongoose).slice(0, 20).join(', ')
      : '(none)';

    const error = new Error(
      'Mongoose Node build was not bundled. Cloudflare/Wrangler selected the browser build. ' +
      `Available export keys: ${keys}`
    );
    error.code = 'MONGOOSE_BROWSER_BUILD_SELECTED';
    throw error;
  }
}

async function connectLocal() {
  if (!localInitializationPromise) {
    localInitializationPromise = Promise.resolve()
      .then(() => {
        const { initializeLocalStore } = require('../data/localModels');
        return initializeLocalStore();
      })
      .then((info) => {
        console.log(`Local JSON data mode enabled: ${info.file}`);
        console.log(`Local users available: ${info.users}`);
        return { mode: 'local', file: info.file };
      })
      .catch((error) => {
        localInitializationPromise = null;
        throw error;
      });
  }

  return localInitializationPromise;
}

async function connectMongo() {
  assertMongooseNodeBuild();

  if (mongoConnectionPromise) {
    return mongoConnectionPromise;
  }

  const uri = getMongoUri();
  if (!uri) {
    const error = new Error('DATA_MODE=mongodb requires MONGODB_URI.');
    error.code = 'MONGODB_URI_MISSING';
    throw error;
  }

  mongoConnectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 12000,
    connectTimeoutMS: 12000,
    socketTimeoutMS: 12000,
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
  })
    .then((connectedMongoose) => {
      console.log('MongoDB connected');
      return connectedMongoose || mongoose;
    })
    .catch((error) => {
      mongoConnectionPromise = null;
      throw error;
    });

  return mongoConnectionPromise;
}

async function connectDB() {
  const mode = getDataMode();

  if (mode === 'local') {
    return connectLocal();
  }

  if (process.env.CHEMWIZ_RUNTIME === 'cloudflare-worker') {
    assertMongooseNodeBuild();
    return require('../data/workerMongoContext').connectWorkerDatabase();
  }

  return connectMongo();
}

module.exports = connectDB;
