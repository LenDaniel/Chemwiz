import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, configFile: path.resolve(root, '../../vite.config.mjs'), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const content = await server.ssrLoadModule('/src/content/index.js');
  assert.equal(Object.keys(content.getAllContent()).length, 0);
  const { searchChemWiz } = await server.ssrLoadModule('/src/search/searchEngine.js');
  assert.ok(searchChemWiz('Haber').length);
  assert.equal(Object.keys(content.getAllContent()).length, 0, 'Search must not load topic modules');
  const { getWizContext } = await server.ssrLoadModule('/src/config/wizContext.js');
  for (const tab of ['home', 'tools', 'progress', 'profile']) {
    assert.equal(getWizContext({ view: tab }, tab).featureKey, 'chemistry-research');
  }
  assert.equal(getWizContext({ view: 'tool-periodic' }, 'tools').featureKey, 'periodic-table');
  const [first, again] = await Promise.all([content.loadContent('atomic'), content.loadContent('atomic')]);
  assert.equal(first, again);
  assert.deepEqual(Object.keys(content.getAllContent()), ['atomic']);
  const chapter = first.chapters[0];
  assert.equal(getWizContext({ view: 'reader', topicId: 'atomic', chapterId: chapter.id }, 'home').featureTitle, chapter.title);
  assert.equal(await content.loadContent('missing-topic'), null);
  await Promise.all(content.TOPIC_CONTENT_IDS.map(content.loadContent));
  const registry = content.getAllContent();
  assert.equal(Object.keys(registry).length, 24);
  const digest = createHash('sha256').update(JSON.stringify(registry)).digest('hex');
  assert.equal(digest, '74747c41cbcd40f38ddb21de1a13680acb41c2d18b42a698bfaf8ebe8fa62b02', 'K4 must preserve every topic');
  const { buildLessonEntries } = await server.ssrLoadModule('/src/search/buildLessonEntries.js');
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'src/search/lessonManifest.json'), 'utf8'));
  assert.deepEqual(buildLessonEntries(manifest), buildLessonEntries(registry));
  const { chooseEnglishVoice, speechChunks, chapterSpeechText } = await server.ssrLoadModule('/src/utils/speech.js');
  const remote = { lang: 'en-US', localService: false };
  const local = { lang: 'en-GB', localService: true };
  assert.equal(chooseEnglishVoice([remote, local], true), local);
  assert.equal(chooseEnglishVoice([remote], true), null);
  assert.equal(chooseEnglishVoice([remote], false), remote);
  const long = ('A covalent bond is a shared pair of electrons. ').repeat(100).trim();
  assert.equal(speechChunks(long).join(' '), long);
  assert.ok(speechChunks(long).every((chunk) => chunk.length <= 450));
  assert.ok(chapterSpeechText(chapter).startsWith(chapter.title));
  console.log('PASS: lazy/cache loading, all-tab Wiz contexts, unchanged 24 topics, complete search manifest, offline voice selection and full-text reading.');
} finally { await server.close(); }
