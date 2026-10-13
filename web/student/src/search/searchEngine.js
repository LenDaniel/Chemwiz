import lessonManifest from './lessonManifest.json';
import { buildLessonEntries } from './buildLessonEntries.js';
import { CATIONS, ANIONS, GASES, FUNCTIONAL_GROUPS } from '../tools/qaData.js';

const normalize = (value = '') => String(value)
  .toLowerCase()
  .replace(/[–—−]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

const makeSnippet = (text = '', limit = 180) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1).trimEnd()}…`;
};

function qaTestsText(tests = []) {
  return tests.map((test) => [test.reagent, test.obs, test.eq, test.confirm, test.absent, test.note].filter(Boolean).join(' ')).join(' ');
}

function buildToolEntries() {
  const entries = [
    {
      id: 'tool:periodic', kind: 'tool', toolKey: 'periodic', title: 'Periodic Table', path: 'Tools › Periodic Table',
      snippet: 'Elements, symbols, atomic numbers and electron configurations.',
      haystack: normalize('periodic table elements symbols atomic number electron configuration'), searchTitle: 'periodic table',
    },
    {
      id: 'tool:balancer', kind: 'tool', toolKey: 'balancer', title: 'Equation Balancer', path: 'Tools › Equation Balancer',
      snippet: 'Balance chemical equations with the exact solver.',
      haystack: normalize('equation balancer balance chemical equations stoichiometric coefficients'), searchTitle: 'equation balancer',
    },
    {
      id: 'tool:mole', kind: 'tool', toolKey: 'mole', title: 'Mole Calculator', path: 'Tools › Mole Calculator',
      snippet: 'Moles, mass, molar mass, gas equation, concentration and dilution.',
      haystack: normalize('mole calculator moles mass molar mass pv nrt concentration dilution'), searchTitle: 'mole calculator',
    },
    {
      id: 'tool:qa', kind: 'tool', toolKey: 'qa', qaTab: 'functional', title: 'Qualitative Analysis Table', path: 'Tools › QA Table',
      snippet: 'Cation, anion, gas and organic functional-group tests.',
      haystack: normalize('qualitative analysis qa cation anion gas functional group organic tests reagents observations'), searchTitle: 'qualitative analysis qa table',
    },
  ];

  const addQa = (items, tab, getTitle, getName, getTests) => {
    items.forEach((item, index) => {
      const title = getTitle(item);
      const name = getName(item);
      const tests = getTests(item);
      const text = qaTestsText(tests);
      entries.push({
        id: `qa:${tab}:${index}`,
        kind: 'tool',
        toolKey: 'qa',
        qaTab: tab,
        qaOpen: `${tab}-${index}`,
        title,
        path: `Tools › QA Table › ${name}`,
        snippet: makeSnippet(text),
        haystack: normalize(`${title} ${name} ${text}`),
        searchTitle: normalize(`${title} ${name}`),
      });
    });
  };

  addQa(CATIONS, 'cations', (x) => `${x.ion} — ${x.name}`, (x) => x.name, (x) => x.tests || []);
  addQa(ANIONS, 'anions', (x) => `${x.ion} — ${x.name}`, (x) => x.name, (x) => x.tests || []);
  addQa(GASES, 'gases', (x) => `${x.gas} gas test`, (x) => x.gas, (x) => [{ reagent: x.test, obs: x.result }]);
  addQa(FUNCTIONAL_GROUPS, 'functional', (x) => `${x.group} — ${x.name}`, (x) => x.name, (x) => x.tests || []);

  return entries;
}

const SEARCH_INDEX = [...buildLessonEntries(lessonManifest), ...buildToolEntries()];

export function searchChemWiz(query, limit = 36) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(' ').filter(Boolean);

  return SEARCH_INDEX
    .map((entry) => {
      if (!tokens.every((token) => entry.haystack.includes(token))) return null;

      let score = 10;
      if (entry.searchTitle === q) score += 180;
      if (entry.searchTitle.startsWith(q)) score += 110;
      if (entry.searchTitle.includes(q)) score += 80;
      if (entry.haystack.includes(q)) score += 45;
      if (entry.kind === 'section') score += 18;
      if (entry.kind === 'chapter') score += 14;
      if (entry.kind === 'topic') score += 12;
      if (entry.kind === 'tool') score += 10;
      score -= Math.min(entry.snippet.length / 100, 4);

      return { ...entry, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
