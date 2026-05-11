const CACHE_CDN   = 'puzzles-cdn-v1';   // external libs — cache-first (versioned URLs)
const CACHE_PAGES = 'puzzles-pages-v1'; // our files    — network-first

const CDN_HOSTS = ['unpkg.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_CDN && k !== CACHE_PAGES)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // CDN libraries: cache-first (URLs are pinned to a version and never mutate)
  if (CDN_HOSTS.some(h => url.hostname.includes(h))) {
    e.respondWith(
      caches.open(CACHE_CDN).then(cache =>
        cache.match(e.request).then(hit => {
          if (hit) return hit;
          return fetch(e.request).then(res => {
            cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Our own pages/assets: network-first so updates are always delivered.
  // Cache is only used as an offline fallback.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE_PAGES).then(cache =>
        fetch(e.request)
          .then(res => {
            cache.put(e.request, res.clone());
            return res;
          })
          .catch(() => cache.match(e.request))
      )
    );
  }
});
