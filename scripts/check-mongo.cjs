const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const root = path.resolve(__dirname, '..');
async function main() {
  const filename = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, '.env');
  const values = { ...dotenv.parse(fs.readFileSync(filename)), ...process.env };
  const uri = values.MONGODB_URI || values.MONGO_URI || values.MONGO_URL;
  if (!uri) throw Object.assign(new Error('Missing database setting'), { code: 'MONGODB_URI_MISSING' });
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, maxPoolSize: 1 });
  await mongoose.connection.db.command({ ping: 1 });
  console.log('MongoDB connection: PASS (authenticated, read-only ping).');
}
main().catch((error) => {
  console.error('MongoDB connection: FAIL. Check Atlas network access, database user credentials, cluster status and your internet connection.');
  console.error('Error category:', error.name, 'Code:', error.code || 'DATABASE_UNAVAILABLE');
  process.exitCode = 1;
}).finally(async () => { await mongoose.disconnect(); });
