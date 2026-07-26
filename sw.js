// Offline cache for Unicorn Reading Academy.
// Bump CACHE version whenever app files change so devices pick up updates.
const CACHE = 'ura-v2';
const ASSETS = [
  '.', 'index.html', 'css/style.css', 'manifest.json',
  'js/extras.js', 'js/banks.js', 'js/storylib.js',
  'js/curriculum-l1.js', 'js/curriculum-l2.js', 'js/curriculum-l3.js',
  'js/audio.js', 'js/firebase-config.js', 'js/sync.js', 'js/app.js',
  'audio/manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let Firebase/CDN requests hit the network

  // Voice clips are immutable and latency-critical (a child taps a word and
  // expects instant sound), so serve them cache-first and only fetch on a miss.
  if (url.pathname.includes('/audio/') && url.pathname.endsWith('.m4a')) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
    return;
  }

  // App files are network-first so code updates land, with cache for offline.
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
