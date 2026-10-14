const { getDataMode } = require('../config/runtime');
const dataMode = getDataMode();

if (dataMode === 'local') {
  const { User, AdminLog } = require('./localModels');
  module.exports = { User, AdminLog, dataMode: 'local' };
} else {
  const { modelForRuntime } = require('./workerMongoContext');
  module.exports = {
    User: modelForRuntime(require('../models/User')),
    AdminLog: modelForRuntime(require('../models/AdminLog')),
    dataMode: 'mongodb',
  };
}
