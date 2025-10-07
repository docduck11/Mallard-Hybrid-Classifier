/* Mallard PWA v1.0.0 */
const APP_VERSION = "v1.0.0";
const CACHE = 'mallard-' + APP_VERSION;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './duck_tractor.png',
  './measurement_demo.mp4',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-256.png',
  './icon-384.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for HTML, cache-first for everything else
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate'
              || (req.headers.get('accept') || '').includes('text/html')
              || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isHTML) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }))
  );
});
