const CACHE = 'ca-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/supabase-config.js',
  '/js/db.js',
  '/js/auth.js',
  '/js/sync.js',
  '/js/cat-fields.js',
  '/js/router.js',
  '/js/views/home.js',
  '/js/views/search.js',
  '/js/views/add.js',
  '/js/views/collection.js',
  '/js/views/profile.js',
  '/js/views/auth.js',
  '/js/views/item.js',
  '/js/app.js',
  '/manifest.json',
  '/img/logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
