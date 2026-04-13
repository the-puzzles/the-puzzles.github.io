const CACHE = 'puzzles-v6';
const ASSETS = [
  '/',
  '/index.html',
  '/how-to-play.html',
  '/chromino.html',
  '/tessera.html',
  '/colorku.html',
  '/outlines.html',
  '/wordsearch.html',
  '/manifest.json',
  '/icon.svg',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://unpkg.com/d3@7/dist/d3.min.js',
  'https://unpkg.com/topojson-client@3/dist/topojson-client.min.js',
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
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
