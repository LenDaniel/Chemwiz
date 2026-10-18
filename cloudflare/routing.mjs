const HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
};
export function securedResponse(response, { html = false, api = false } = {}) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(HEADERS)) headers.set(name, value);
  if (html || api) headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
export function json(body, status = 200) {
  return securedResponse(Response.json(body, { status }), { api: true });
}
export function assetPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') return '/index.html';
  if (/^\/(student|admin|legal)\/(?:[^.]*|index\.html)$/.test(pathname)) return `/${pathname.split('/')[1]}/index.html`;
  return pathname;
}
export async function routeStatic(request, assets) {
  const url = new URL(request.url);
  if (url.pathname === '/student' || url.pathname === '/admin' || url.pathname === '/legal') {
    return securedResponse(new Response(null, { status: 308, headers: { Location: `${url.pathname}/${url.search}` } }));
  }
  if (!['GET', 'HEAD'].includes(request.method)) return json({ success: false, message: 'Route not found.' }, 404);
  const routed = assetPath(url.pathname);
  // No backend file, data file or dotfile can be reached through a workspace fallback.
  if (!['/index.html', '/student/index.html', '/admin/index.html', '/legal/index.html'].includes(routed) && !routed.startsWith('/assets/')) {
    return json({ success: false, message: 'Route not found.' }, 404);
  }
  const destination = new URL(request.url);
  destination.pathname = routed;
  const response = await assets.fetch(new Request(destination, request));
  if (response.status === 404) return json({ success: false, message: 'Route not found.' }, 404);
  return securedResponse(response, { html: routed.endsWith('.html') });
}
