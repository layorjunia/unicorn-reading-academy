// Offline cache for Unicorn Reading Academy.
// Bump CACHE version whenever app files change so devices pick up updates.
const CACHE = 'classic-20260827-1732-27c5d3c';
const ASSETS = [
  '.', 'index.html', 'css/style.css', 'manifest.json',
  'js/characters.js', 'js/story-art.js', 'js/story-scenes.js', 'js/ui-speech.js', 'js/extras.js', 'js/banks.js', 'js/storylib.js',
  'js/curriculum-l1.js', 'js/curriculum-l2.js', 'js/curriculum-l3.js',
  'js/sound-map.js', 'js/listen.js', 'js/audio.js', 'js/firebase-config.js', 'js/sync.js', 'js/app.js',
  'audio/manifest.json', 'version.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      // 'rs-*' caches belong to the Reading Star app at the site root — spare them.
      keys.filter(k => k !== CACHE && !k.startsWith('rs-')).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let Firebase/CDN requests hit the network

  // version.json is the update signal — it must never come from a cache
  if (url.pathname.endsWith('version.json')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() =>
      new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  // Voice clips are immutable and latency-critical (a child taps a word and
  // expects instant sound), so serve them cache-first and only fetch on a miss.
  //
  // Range handling is NOT optional here. iOS Safari requests media with a
  // `Range: bytes=0-` header, and if it gets a plain 200 back (which is what
  // a cached full response is), WebKit refuses to play it — every listen
  // button silently does nothing on iPhone/iPad while working fine on
  // desktop. So: cache by bare URL, and when the request carries a Range
  // header, slice the full body ourselves and answer 206.
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
      // Handles "bytes=0-99", open-ended "bytes=100-" AND the suffix form
      // "bytes=-500" (last N bytes) — a suffix request falling through to a
      // plain 200 recreates the exact iOS silent-playback bug this branch
      // exists to fix. A multi-range request gets its first range only,
      // which media elements accept.
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

  // App files are network-first so code updates land, with cache for offline.
  // `cache: 'reload'` is essential: a plain fetch() here can be answered from
  // the browser's own HTTP cache, which silently served a stale index.html
  // (and therefore stale script URLs) after a deploy.
  e.respondWith(
    fetch(e.request, { cache: 'reload' }).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => fetch(e.request).catch(() =>
      caches.match(e.request, { ignoreSearch: true })))
  );
});
