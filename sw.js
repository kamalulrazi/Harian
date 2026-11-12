/* Ritme Harian: service worker.
   Menyimpan file aplikasi supaya bisa dibuka tanpa internet.
   Kalau kamu mengubah file aplikasi, naikkan nomor CACHE (mis. ritme-v2). */
const CACHE = 'ritme-v1';
const FONTS = 'ritme-fonts-v1';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'pwa.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Halaman: ambil yang terbaru kalau online, pakai simpanan kalau offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // File lain dan font: pakai simpanan dulu, perbarui di belakang layar.
  const sameOrigin = url.origin === location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;
  e.respondWith(
    caches.open(sameOrigin ? CACHE : FONTS).then(cache =>
      cache.match(req).then(hit => {
        const net = fetch(req)
          .then(res => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    )
  );
});

// Ketuk notifikasi: buka atau fokuskan aplikasi.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      return self.clients.openWindow('./');
    })
  );
});
