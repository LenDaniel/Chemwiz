// The worker stores only this release's public recovery page, manifest and icons.
// Authentication, API responses, lessons, search, admin and user data stay outside it.
function studentWorkerSource({ buildId, files }) {
  if (!/^[a-zA-Z0-9.-]+$/.test(buildId) || !Array.isArray(files) || !files.length ||
      files.some(file => !/^\/student\/(?:offline\.html|manifest\.webmanifest|icons\/[a-z0-9-]+\.(?:png|svg))$/.test(file))) throw new Error('Invalid student recovery cache configuration.');
  return `'use strict';
const PREFIX = 'chemwiz-student-recovery-';
const BUILD = ${JSON.stringify(buildId)};
const CACHE = PREFIX + BUILD;
const FILES = ${JSON.stringify(files)};
const OFFLINE = '/student/offline.html';
self.addEventListener('install', event => event.waitUntil((async () => {
  try {
    const cache = await caches.open(CACHE);
    for (const pathname of FILES) {
      const request = new Request(pathname, { credentials: 'omit', cache: 'reload' });
      const response = await fetch(request);
      if (!response.ok || response.redirected || response.type !== 'basic') throw new Error('Recovery file unavailable');
      await cache.put(request, response);
    }
  } catch (error) { await caches.delete(CACHE); throw error; }
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const previous = (await caches.keys()).filter(name => name.startsWith(PREFIX) && name !== CACHE);
  const keep = previous.slice(-1);
  await Promise.all(previous.filter(name => !keep.includes(name)).map(name => caches.delete(name)));
  await self.clients.claim();
})()));
async function recoveryPage() {
  const cache = await caches.open(CACHE);
  const response = await cache.match(OFFLINE);
  if (response) return new Response(response.body, { status: 200, headers: {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-ChemWiz-Offline': '1',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff'
  }});
  return new Response('ChemWiz needs a connection. Reconnect and reopen the app.', { status: 503, headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } });
}
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate' && ['/student/', '/student/index.html'].includes(url.pathname)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(new Request(request, { cache: 'no-store' }));
        return response.status >= 500 ? recoveryPage() : response;
      } catch { return recoveryPage(); }
    })());
  } else if (!url.search && FILES.includes(url.pathname)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(url.pathname)) || fetch(request))());
  }
});
self.addEventListener('message', event => {
  if (!event.ports[0] || !event.source?.url) return;
  const source = new URL(event.source.url);
  if (source.origin !== self.location.origin || !source.pathname.startsWith('/student/')) return;
  if (event.data?.type === 'RECOVERY_STATUS') {
    event.ports[0].postMessage({ buildId: BUILD, files: FILES });
  } else if (event.data?.type === 'ACTIVATE_UPDATE') {
    event.waitUntil((async () => {
      const tabs = (await self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
        .filter(client => { const url = new URL(client.url); return url.origin === self.location.origin && url.pathname.startsWith('/student/'); });
      if (tabs.length !== 1 || tabs[0].id !== event.source.id) {
        event.ports[0].postMessage({ status: 'OTHER_TABS_OPEN' }); return;
      }
      event.ports[0].postMessage({ status: 'ACTIVATING' });
      await self.skipWaiting();
    })());
  }
});
`;
}
module.exports = { studentWorkerSource };
