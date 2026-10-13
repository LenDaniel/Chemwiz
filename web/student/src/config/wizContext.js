import { topicById } from './topics.js';
import { getContent } from '../content/index.js';

const TOOL_WIZ_META = {
  'tool-periodic': { featureKey: 'periodic-table', featureLabel: 'Periodic Table', featureTitle: 'Element explorer', color: '#00d4ff' },
  'tool-balancer': { featureKey: 'equation-balancer', featureLabel: 'Equation Balancer', featureTitle: 'Balancing equations', color: '#06a06e' },
  'tool-qa': { featureKey: 'qa-table', featureLabel: 'QA Table', featureTitle: 'Qualitative analysis', color: '#ffbe0b' },
  'tool-mole': { featureKey: 'mole-calculator', featureLabel: 'Mole Calculator', featureTitle: 'Quantitative chemistry', color: '#c77dff' },
};

export const makeWizContext = (topic, featureKey, featureLabel, featureTitle = '', contextSummary = '', fallbackColor = null) => ({
  topicId: topic?.id || null,
  topicTitle: topic?.title || 'Chemistry research',
  topicCode: topic?.code || 'TOOLS',
  topicColor: topic?.color || fallbackColor || '#00d4ff',
  featureKey,
  featureLabel,
  featureTitle,
  contextSummary,
});

export function getWizContext(current, tab) {
  if (current.wizContext && ['tutor', 'locked'].includes(current.view)) return current.wizContext;
  const topic = tab === 'home' && current.topicId ? topicById(current.topicId) : null;
  if (topic) {
    const features = {
      topic: ['topic-overview', 'Topic overview', topic.title],
      chapters: ['chapters', 'Chapter list', topic.title],
      quiz: ['paper-1-mcq', 'Paper 1 MCQ', 'Quiz practice'],
      structured: ['paper-2-structured', 'Paper 2 structured', 'Structured questions'],
      worked: ['worked-examples', 'Worked examples', 'Step-by-step problem'],
    };
    if (current.view === 'reader') {
      const chapter = getContent(topic.id)?.chapters?.find((ch) => ch.id === current.chapterId);
      return makeWizContext(topic, 'chapter-reader', 'Chapter reader', chapter?.title || current.chapterId,
        `Learner is reading the ${chapter?.title || current.chapterId} chapter in ${topic.title}.`);
    }
    const feature = features[current.view];
    if (feature) return makeWizContext(topic, ...feature, `Learner is using ${feature[1]} in ${topic.title}.`);
  }
  if (tab === 'tools') {
    if (current.view === 'element' && current.el) {
      const [, symbol, name, mass, , group, period] = current.el;
      return makeWizContext(null, 'element-detail', 'Element detail', `${symbol} · ${name}`,
        `Element detail for ${name} (${symbol}); atomic number ${current.el[0]}, relative atomic mass ${mass}, group ${group}, period ${period}.`, '#00d4ff');
    }
    const tool = TOOL_WIZ_META[current.view];
    if (tool) return makeWizContext(null, tool.featureKey, tool.featureLabel, tool.featureTitle,
      `Learner is using the ${tool.featureLabel} feature.`, tool.color);
  }
  const label = { home: 'Home', tools: 'Chemistry tools', progress: 'Progress', profile: 'Profile' }[tab] || 'Chemistry';
  return makeWizContext(null, 'chemistry-research', 'Chemistry research', '',
    `Learner opened general chemistry research from ${label}.`);
}
