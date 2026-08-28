// Reading Star — offline cache.
// The classic Unicorn Island app lives under classic/ with its OWN service
// worker at that scope; this one only controls the root app. Requests from
// root pages into classic/audio/ (the hear-it clips and sound effects) are
// ours to handle, and they need real Range support: iOS Safari requests
// media with a Range header and refuses a plain 200 from a cache.
const CACHE = 'rs-20260828-0943-c99eb71';
const ASSETS = [
  '.', 'index.html', 'style.css', 'manifest.json',
  'content.js', 'creatures.js', 'listen.js', 'app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Caches are origin-global: the classic app's 'classic-*' caches belong
    // to its own service worker under classic/ — never delete those. Old
    // 'ura-*' caches from the app that used to live at this root ARE ours
    // to clean up (they'd otherwise sit on every iPad forever).
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE && !k.startsWith('classic-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.endsWith('version.json')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() =>
      new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  if (url.pathname.includes('/audio/') && /\.(mp3|m4a)$/.test(url.pathname)) {
    e.respondWith((async () => {
      let res = await caches.match(url.pathname);
      if (!res) {
        res = await fetch(url.pathname);
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(url.pathname, copy));
        }
      }
      const range = e.request.headers.get('range');
      if (!range || !res.ok) return res;
      // "bytes=0-99", open-ended "bytes=100-", and suffix "bytes=-500".
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      if (!m || (!m[1] && !m[2])) return res;
      const buf = await res.arrayBuffer();
      let start, end;
      if (m[1]) {
        start = Number(m[1]);
        end = m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
      } else {
        start = Math.max(0, buf.byteLength - Number(m[2]));
        end = buf.byteLength - 1;
      }
      if (start >= buf.byteLength) {
        return new Response(null, {
          status: 416,
          headers: { 'Content-Range': 'bytes */' + buf.byteLength }
        });
      }
      return new Response(buf.slice(start, end + 1), {
        status: 206,
        statusText: 'Partial Content',
        headers: {
          'Content-Type': res.headers.get('Content-Type') || 'audio/mp4',
          'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
          'Content-Length': String(end - start + 1),
          'Accept-Ranges': 'bytes'
        }
      });
    })());
    return;
  }

  // App shell: network-first with `cache: 'reload'` so deploys actually land
  // (a plain fetch can be answered stale from the browser's HTTP cache).
  e.respondWith(
    fetch(e.request, { cache: 'reload' }).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => fetch(e.request).catch(() =>
      caches.match(e.request, { ignoreSearch: true })))
  );
});
