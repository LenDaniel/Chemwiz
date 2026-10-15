import { TOPIC_META } from '../config/topics.js';

const normalize = (value = '') => String(value)
  .toLowerCase()
  .replace(/[–—−]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

const textFromBlock = (block = {}) => {
  if (block.type === 'p' || block.type === 'h') return block.text || '';
  if (block.type === 'ul' || block.type === 'takeaway') return (block.items || []).join(' ');
  if (block.type === 'callout') return [block.title, block.body].filter(Boolean).join(' ');
  if (block.type === 'd') return block.caption || '';
  return '';
};

const titleFromBlock = (block = {}, fallback = 'Lesson content') => {
  if (block.type === 'h') return block.text || fallback;
  if (block.type === 'callout') return block.title || fallback;
  if (block.type === 'takeaway') return 'Key takeaways';
  if (block.type === 'ul') return (block.items || [fallback])[0] || fallback;
  if (block.type === 'd') return block.caption || 'Diagram';
  if (block.type === 'p') {
    const text = block.text || fallback;
    return text.length > 72 ? `${text.slice(0, 69)}…` : text;
  }
  return fallback;
};

const makeSnippet = (text = '', limit = 180) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1).trimEnd()}…`;
};

export function buildLessonEntries(registry) {
  const entries = [];

  TOPIC_META.forEach((topic) => {
    const content = registry[topic.id];
    const topicText = [topic.title, topic.code, topic.tagline, ...(topic.keywords || []), ...(content?.objectives || [])].join(' ');

    entries.push({
      id: `topic:${topic.id}`,
      kind: 'topic',
      topicId: topic.id,
      title: topic.title,
      path: `${topic.code} · ${topic.title}`,
      snippet: topic.tagline || 'Open topic overview',
      haystack: normalize(topicText),
      searchTitle: normalize(`${topic.title} ${topic.code}`),
    });

    (content?.chapters || []).forEach((chapter) => {
      const chapterText = (chapter.blocks || []).map(textFromBlock).join(' ');
      entries.push({
        id: `chapter:${topic.id}:${chapter.id}`,
        kind: 'chapter',
        topicId: topic.id,
        chapterId: chapter.id,
        title: chapter.title,
        path: `${topic.title} › ${chapter.title}`,
        snippet: makeSnippet(chapterText || 'Open chapter'),
        haystack: normalize(`${topic.title} ${topic.code} ${chapter.title} ${chapterText}`),
        searchTitle: normalize(`${chapter.title} ${topic.title}`),
      });

      (chapter.blocks || []).forEach((block, blockIndex) => {
        const blockText = textFromBlock(block);
        if (!String(blockText).trim()) return;
        const kind = block.type === 'h' || block.type === 'callout' || block.type === 'takeaway'
          ? 'section'
          : block.type === 'd'
            ? 'diagram'
            : 'paragraph';

        entries.push({
          id: `block:${topic.id}:${chapter.id}:${blockIndex}`,
          kind,
          topicId: topic.id,
          chapterId: chapter.id,
          blockIndex,
          title: titleFromBlock(block, chapter.title),
          path: `${topic.title} › ${chapter.title}`,
          snippet: makeSnippet(blockText),
          haystack: normalize(`${topic.title} ${topic.code} ${chapter.title} ${blockText}`),
          searchTitle: normalize(`${titleFromBlock(block, chapter.title)} ${chapter.title}`),
        });
      });
    });
  });

  return entries;
}

