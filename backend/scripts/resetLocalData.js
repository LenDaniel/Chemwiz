require('dotenv').config();

if (String(process.env.DATA_MODE || '').toLowerCase() !== 'local') {
  console.error('Refusing to reset data because DATA_MODE is not set to local.');
  process.exit(1);
}

const {
  resetLocalStore,
  initializeLocalStore,
  DATA_FILE,
} = require('../src/data/localModels');

(async () => {
  resetLocalStore();
  const info = await initializeLocalStore();
  console.log(`Local ChemWiz data reset: ${DATA_FILE}`);
  console.log(`Seeded ${info.users} local users.`);
})().catch((error) => {
  console.error('Could not reset local data:', error.message);
  process.exit(1);
});
