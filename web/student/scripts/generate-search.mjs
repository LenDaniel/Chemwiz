import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, configFile: path.resolve(root, '../../vite.config.mjs'), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { TOPIC_CONTENT_IDS, loadContent } = await server.ssrLoadModule('/src/content/index.js');
  const { buildLessonEntries } = await server.ssrLoadModule('/src/search/buildLessonEntries.js');
  const values = await Promise.all(TOPIC_CONTENT_IDS.map(async (id) => [id, await loadContent(id)]));
  const entries = buildLessonEntries(Object.fromEntries(values));
  // Keep only searchable fields. Rebuild the identical ranked entries on demand;
  // do not duplicate entire chapter text in every downloaded search record.
  const registry = Object.fromEntries(values.map(([id, content]) => [id, {
    objectives: content.objectives || [],
    chapters: (content.chapters || []).map((chapter) => ({
      id: chapter.id, title: chapter.title,
      blocks: (chapter.blocks || []).map((block) => {
        const result = { type: block.type };
        const fields = { p: ['text'], h: ['text'], ul: ['items'], takeaway: ['items'], callout: ['title', 'body'], d: ['caption'] }[block.type] || [];
        for (const field of fields) if (block[field] !== undefined) result[field] = block[field];
        return result;
      }),
    })),
  }]));
  await fs.writeFile(path.join(root, 'src/search/lessonManifest.json'), JSON.stringify(registry));
  console.log(`Search manifest generated: ${entries.length} entries across ${values.length} topics.`);
} finally { await server.close(); }
