const CACHE = 'puzzles-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/how-to-play.html',
  '/chromino.html',
  '/tessera.html',
  '/colorku.html',
  '/manifest.json',
  '/icon.svg',
  'https://unpkg.com/vue@3/dist/vue.global.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
