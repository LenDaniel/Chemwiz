import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, configFile: path.resolve(root, '../../vite.config.mjs'),
  server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
const theme = { panel: '#0e1726', panelHi: '#172034', text: '#e8eef8', textMuted: '#a3b1c9',
  textDim: '#8393b2', border: '#26344b', accent: '#4cc9f0' };
const rendererTypes = new Set(['panel', 'cards', 'steps', 'table', 'compare', 'equation', 'note', 'arrow', 'scaleBar', 'bars', 'pyramid', 'raw']);
const blockTypes = new Set(['p', 'h', 'ul', 'd', 'callout', 'takeaway']);
try {
  const { TOPIC_CONTENT_IDS, loadContent } = await server.ssrLoadModule('/src/content/index.js');
  const { TOPIC_META } = await server.ssrLoadModule('/src/config/topics.js');
  const { Block } = await server.ssrLoadModule('/src/components/Primitives.jsx');
  const registry = Object.fromEntries(await Promise.all(TOPIC_CONTENT_IDS.map(async (id) => [id, await loadContent(id)])));
  assert.equal(Object.keys(registry).length, 24);
  assert.deepEqual([...TOPIC_CONTENT_IDS].sort(), TOPIC_META.map((topic) => topic.id).sort());
  const counts = { chapters: 0, diagrams: 0, quizzes: 0, structured: 0, worked: 0 };
  for (const [id, topic] of Object.entries(registry)) {
    assert.equal(topic.id, id);
    const chapterIds = new Set();
    for (const chapter of topic.chapters) {
      const label = `${id}/${chapter.id}`;
      assert.ok(!chapterIds.has(chapter.id), `Duplicate chapter: ${label}`);
      chapterIds.add(chapter.id);
      assert.ok(chapter.title && chapter.blocks.length, `Empty chapter: ${label}`);
      counts.chapters++;
      for (const block of chapter.blocks) {
        assert.ok(blockTypes.has(block.type), `Unknown content block: ${label}/${block.type}`);
        if (block.type !== 'd') continue;
        assert.equal(block.component, undefined, `Legacy component diagram remains: ${label}`);
        assert.ok(block.spec?.blocks?.length, `Missing diagram spec: ${label}`);
        for (const part of block.spec.blocks) {
          assert.ok(rendererTypes.has(part.type), `Unsupported diagram renderer: ${label}/${part.type}`);
        }
        const markup = renderToStaticMarkup(createElement(Block, { block, color: TOPIC_META.find((value) => value.id === id).color, t: theme }));
        assert.match(markup, /<svg\b/, `Diagram did not render: ${label}`);
        const viewBox = markup.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
        assert.ok(viewBox && Number(viewBox[1]) > 0 && Number(viewBox[2]) > 0, `Invalid SVG dimensions: ${label}`);
        assert.doesNotMatch(markup, /="[^"]*\b(?:NaN|Infinity|undefined)\b[^"]*"/, `Invalid SVG attribute: ${label}`);
        counts.diagrams++;
      }
    }
    for (const [index, question] of (topic.quizzes || []).entries()) {
      assert.ok(question.q && question.opts?.length >= 2, `Incomplete quiz: ${id}/${index}`);
      assert.ok(Number.isInteger(question.ans) && question.ans >= 0 && question.ans < question.opts.length, `Invalid answer index: ${id}/${index}`);
      counts.quizzes++;
    }
    for (const question of topic.structured || []) {
      assert.ok(question.title && question.q && question.parts?.length, `Incomplete structured question: ${id}`);
      assert.equal(question.parts.reduce((sum, part) => sum + part.marks, 0), question.marks, `Mark total mismatch: ${id}/${question.title}`);
      for (const part of question.parts) assert.ok(part.q && part.ans && part.marks > 0);
      counts.structured++;
    }
    for (const example of topic.worked || []) {
      assert.ok(example.title && example.q && example.ans && example.steps?.length, `Incomplete worked example: ${id}`);
      counts.worked++;
    }
  }
  assert.deepEqual(counts, { chapters: 255, diagrams: 218, quizzes: 745, structured: 134, worked: 181 });
  // K-Cleanup changes only the polymer topic. Protect the other 23 complete
  // records, including their questions and diagram specs, from incidental edits.
  const unchanged = Object.fromEntries(Object.entries(registry).filter(([id]) => id !== 'polymer'));
  assert.equal(createHash('sha256').update(JSON.stringify(unchanged)).digest('hex'),
    'b08178d3edf7d558f4afc39a06bc7df988a273e1107940658f2ac1b068e08541');
  const polymer = registry.polymer;
  const hydrolysis = polymer.worked.find((example) => example.title === 'Identify the polymer from a hydrolysis experiment');
  assert.match(hydrolysis.q, /hexane-1,6-diamine/);
  assert.match(hydrolysis.ans, /Nylon-6,6/);
  assert.doesNotMatch(hydrolysis.q, /ammonia gas/);
  assert.doesNotMatch(hydrolysis.ans, /most consistent|perhaps|poly\(hexanedioic acid amide\)/);
  const water = polymer.quizzes.find((question) => question.q.includes('ONE open polyester chain'));
  assert.equal(water.opts[water.ans], '2n − 1');
  assert.match(JSON.stringify(polymer.chapters), /7-membered/);
  assert.doesNotMatch(JSON.stringify(polymer.chapters), /6-membered cyclic amide/);
  console.log(`Content check: PASS (24 topics; ${counts.chapters} chapters; ${counts.diagrams} spec diagrams rendered; ${counts.quizzes} quiz answers; ${counts.structured} mark totals; ${counts.worked} worked examples).`);
  console.log('PASS: the other 23 topics are byte-equivalent as loaded records; corrected polymer examples have definite answers.');
} finally {
  await server.close();
}
