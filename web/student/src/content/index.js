// Topic modules load only when selected; rejected requests can be retried.
const loaders = {
  atomic: () => import('./atomic.jsx').then((module) => module.ATOMIC),
  hydrocarbons: () => import('./hydrocarbons.jsx').then((module) => module.HYDROCARBONS),
  transition: () => import('./transition.jsx').then((module) => module.TRANSITION),
  stoich: () => import('./stoich.jsx').then((module) => module.STOICH),
  bonding: () => import('./bonding.jsx').then((module) => module.BONDING),
  states: () => import('./states.jsx').then((module) => module.STATES),
  energetics: () => import('./energetics.jsx').then((module) => module.ENERGETICS),
  electrochem: () => import('./electrochem.jsx').then((module) => module.ELECTROCHEM),
  equilibria: () => import('./equilibria.jsx').then((module) => module.EQUILIBRIA),
  kinetics: () => import('./kinetics.jsx').then((module) => module.KINETICS),
  periodicity: () => import('./periodicity.jsx').then((module) => module.PERIODICITY),
  group2: () => import('./group2.jsx').then((module) => module.GROUP2),
  group4: () => import('./group4.jsx').then((module) => module.GROUP4),
  group7: () => import('./group7.jsx').then((module) => module.GROUP7),
  nsulphur: () => import('./nsulphur.jsx').then((module) => module.NSULPHUR),
  halogen: () => import('./halogen_deriv.jsx').then((module) => module.HALOGEN_DERIV),
  hydroxy: () => import('./hydroxy.jsx').then((module) => module.HYDROXY),
  carbonyl: () => import('./carbonyl.jsx').then((module) => module.CARBONYL),
  carboxylic: () => import('./carboxylic.jsx').then((module) => module.CARBOXYLIC),
  norganic: () => import('./norganic.jsx').then((module) => module.NORGANIC),
  polymer: () => import('./polymers.jsx').then((module) => module.POLYMERS),
  phase: () => import('./phase.jsx').then((module) => module.PHASE),
  environment: () => import('./environment.jsx').then((module) => module.ENVIRONMENT),
  nano: () => import('./nano.jsx').then((module) => module.NANO),
};
const cache = new Map();
const pending = new Map();
export const TOPIC_CONTENT_IDS = Object.keys(loaders);
export function getContent(topicId) { return cache.get(topicId) || null; }
export function loadContent(topicId) {
  if (!loaders[topicId]) return Promise.resolve(null);
  if (cache.has(topicId)) return Promise.resolve(cache.get(topicId));
  if (pending.has(topicId)) return pending.get(topicId);
  const request = loaders[topicId]()
    .then((content) => {
      if (!content?.chapters) throw new Error('Topic content is unavailable.');
      cache.set(topicId, content);
      return content;
    })
    .finally(() => pending.delete(topicId));
  pending.set(topicId, request);
  return request;
}
export function getAllContent() {
  return Object.fromEntries(TOPIC_CONTENT_IDS.filter((id) => cache.has(id)).map((id) => [id, cache.get(id)]));
}
