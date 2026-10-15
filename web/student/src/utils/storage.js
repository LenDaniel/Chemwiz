// window.storage is the Claude artifact persistent storage API.
// In a deployed environment it won't exist — fall back to localStorage.

const hasClaudeStorage = typeof window !== 'undefined' && window.storage;
const localFallback = typeof window !== 'undefined' && window.localStorage;

export async function getItem(key) {
  try {
    if (hasClaudeStorage) {
      const r = await window.storage.get(key);
      return r?.value ?? null;
    }
    if (localFallback) return window.localStorage.getItem(key);
  } catch { /* swallow */ }
  return null;
}

export async function setItem(key, value) {
  try {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    if (hasClaudeStorage) { await window.storage.set(key, v); return true; }
    if (localFallback) { window.localStorage.setItem(key, v); return true; }
  } catch { /* swallow */ }
  return false;
}

export async function getJSON(key, fallback = null) {
  const v = await getItem(key);
  if (v === null) return fallback;
  try { return JSON.parse(v); } catch { return v; }
}
