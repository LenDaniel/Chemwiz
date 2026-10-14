const { AsyncLocalStorage } = require('node:async_hooks');
const mongoose = require('mongoose');
const { getMongoUri } = require('../config/runtime');

// Workers sockets belong to the request that created them. Keep connections and
// models in that request's async context; the normal Node server retains its pool.
const requestContext = new AsyncLocalStorage();
async function disposeConnection(connection) {
  // destroy() also removes a short-lived connection from Mongoose's registry.
  const dispose = typeof connection.destroy === 'function' ? connection.destroy : connection.close;
  await dispose.call(connection);
}
function isWorkerRuntime() {
  return process.env.CHEMWIZ_RUNTIME === 'cloudflare-worker';
}
async function openConnection() {
  const uri = getMongoUri();
  if (!uri) throw Object.assign(new Error('MONGODB_URI is required.'), { statusCode: 503 });
  const connection = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 15000,
    maxPoolSize: 2,
    minPoolSize: 0,
    serverMonitoringMode: 'poll',
    autoIndex: true,
  });
  try { return await connection.asPromise(); }
  catch (error) { await disposeConnection(connection).catch(() => {}); throw error; }
}
async function connectWorkerDatabase() {
  const context = requestContext.getStore();
  if (!context) throw Object.assign(new Error('A database request context is required.'), { statusCode: 503 });
  if (!context.connectionPromise) {
    context.connectionPromise = Promise.resolve().then(context.connect).then((connection) => {
      context.connection = connection;
      return connection;
    }).catch((error) => { context.connectionPromise = null; throw error; });
  }
  return context.connectionPromise;
}
function scopedModel(base) {
  return new Proxy(base, {
    get(target, property) {
      if (property === 'schema' || property === 'modelName') return target[property];
      const context = requestContext.getStore();
      if (!context?.connection) throw Object.assign(new Error('The database is not ready for this request.'), { statusCode: 503 });
      if (!context.models.has(base.modelName)) {
        context.models.set(base.modelName, context.connection.model(base.modelName, base.schema));
      }
      const model = context.models.get(base.modelName);
      const value = Reflect.get(model, property);
      return typeof value === 'function' ? value.bind(model) : value;
    },
  });
}
function modelForRuntime(base) {
  return isWorkerRuntime() ? scopedModel(base) : base;
}
async function withWorkerMongoRequest(action, { connect = openConnection } = {}) {
  const context = { connection: null, connectionPromise: null, models: new Map(), connect };
  return requestContext.run(context, async () => {
    try { return await action(); }
    finally {
      if (context.connection) {
        // Finish model initialization before closing its request-owned sockets.
        await Promise.allSettled([...context.models.values()].map((model) => model.init()));
        await disposeConnection(context.connection).catch(() => {});
      }
    }
  });
}
module.exports = { isWorkerRuntime, modelForRuntime, scopedModel, connectWorkerDatabase, withWorkerMongoRequest };
