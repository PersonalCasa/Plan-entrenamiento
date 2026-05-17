const CACHE = 'pde-plan-v3';
const STATIC = [
  '/Plan-entrenamiento/manifest.json',
  '/Plan-entrenamiento/icon-192.png',
  '/Plan-entrenamiento/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // index.html siempre desde la red, con caché como fallback
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // resto desde caché
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
