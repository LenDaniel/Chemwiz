import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = value => createHash('sha256').update(typeof value === 'string' ? value.replace(/\r\n/g, '\n') : JSON.stringify(value)).digest('hex');
const server = await createServer({ root: path.join(root, 'web/student'), configFile: path.join(root, 'vite.config.mjs'), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { TOPIC_CONTENT_IDS, loadContent } = await server.ssrLoadModule('/src/content/index.js');
  const aliases = { polymer: 'polymers', halogen: 'halogen_deriv' }, assets = [];
  const add = (assetId, type, topicId, title, sourceFile, value) => assets.push({ assetId, type, topicId, title, sourceFile, assetHash: hash(value), rightsStatus: 'unreviewed' });
  for (const topicId of TOPIC_CONTENT_IDS) {
    const sourceFile = `web/student/src/content/${aliases[topicId] || topicId}.jsx`;
    const content = await loadContent(topicId);
    add('topic:' + topicId, 'topic-source', topicId, topicId + ' source module', sourceFile, fs.readFileSync(path.join(root, sourceFile), 'utf8'));
    for (const chapter of content.chapters) {
      add(`chapter:${topicId}:${chapter.id}`, 'chapter', topicId, chapter.title, sourceFile, chapter);
      for (const [index, block] of chapter.blocks.entries()) if (block.type === 'd') add(`diagram:${topicId}:${chapter.id}:${index}`, 'diagram', topicId, block.caption || chapter.title + ' diagram', sourceFile, block.spec);
    }
  }
  assets.sort((a, b) => a.assetId.localeCompare(b.assetId, 'en'));
  const output = JSON.stringify({ schemaVersion: 1, notice: 'A source inventory is not rights clearance. All existing entries start unreviewed.', counts: Object.fromEntries(['topic-source', 'chapter', 'diagram'].map(type => [type, assets.filter(row => row.type === type).length])), assets }, null, 2) + '\n';
  const file = path.join(root, 'shared/content-inventory.json');
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') !== output) throw new Error('Content inventory is stale. Run npm run inventory:generate, review the changes and repeat preflight.');
    console.log(`Content inventory: PASS (${assets.length} current, unreviewed source entries).`);
  } else { fs.writeFileSync(file, output); console.log(`Content inventory generated: ${assets.length} entries; no material was declared cleared.`); }
} finally { await server.close(); }
