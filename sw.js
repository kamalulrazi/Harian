/* Ritme Harian: service worker.
   Menyimpan file aplikasi supaya bisa dibuka tanpa internet.
   File aplikasi selalu diambil terbaru saat online, jadi tidak perlu menaikkan versi
   saat kamu mengubah file. Simpanan hanya dipakai kalau sedang offline. */
const CACHE = 'ritme-v1';
const FONTS = 'ritme-fonts-v1';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'pwa.js',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'favicon-32.png'
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

  const sameOrigin = url.origin === location.origin;

  // File aplikasi (halaman, skrip, ikon): ambil yang terbaru kalau online,
  // pakai simpanan kalau offline. no-cache memastikan tidak memakai salinan lama dari browser.
  if (sameOrigin) {
    e.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? 'index.html' : req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req.mode === 'navigate' ? 'index.html' : req)
          .then(r => r || (req.mode === 'navigate' ? caches.match('./') : undefined)))
    );
    return;
  }

  // Font: pakai simpanan dulu, perbarui di belakang layar.
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!isFont) return;
  e.respondWith(
    caches.open(FONTS).then(cache =>
      cache.match(req).then(hit => {
        const net = fetch(req)
          .then(res => {
            if (res && (res.status === 200 || res.type === 'opaque')) cache.put(req, res.clone());
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
