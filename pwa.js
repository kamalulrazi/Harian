/* Ritme Harian: bagian aplikasi yang bisa dipasang (PWA).
   Dimuat dari index.html lewat <script src="pwa.js" defer>. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var reg = null;
  var canSW = 'serviceWorker' in navigator && /^https?:$/.test(location.protocol);

  // Service worker hanya jalan di https atau localhost, tidak di file:// biasa.
  if (canSW) {
    navigator.serviceWorker.register('sw.js').then(function (r) { reg = r; }).catch(function () {});
  }

  // Notifikasi sistem lewat service worker. Ini cara yang didukung Chrome Android.
  window.ritmeSystemNotify = function (title, body) {
    var icon = 'icon-192.png';
    var old = function () {
      try { new Notification(title, { body: body, tag: 'ritme', icon: icon }); } catch (e) {}
    };
    if (!reg) { old(); return; }
    reg.showNotification(title, { body: body, tag: 'ritme', icon: icon, badge: icon, vibrate: [180, 80, 180], renotify: true }).catch(old);
  };

  // Tombol Pasang di panel lonceng.
  var deferred = null;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  function standalone() {
    return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  }
  function paint() {
    var row = $('#rowInstall'), btn = $('#installBtn'), hint = $('#installHint');
    if (!row || !btn || !hint) return;
    var show = !standalone() && (!!deferred || (ios && canSW));
    row.hidden = !show;
    if (!show) return;
    btn.hidden = !deferred;
    hint.textContent = deferred
      ? 'Buka dari layar utama seperti aplikasi biasa.'
      : 'Di iPhone atau iPad: ketuk Bagikan, lalu Tambah ke Layar Utama.';
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; paint(); });
  window.addEventListener('appinstalled', function () { deferred = null; paint(); });
  var btn = $('#installBtn');
  if (btn) {
    btn.addEventListener('click', function () {
      if (!deferred) return;
      var d = deferred;
      deferred = null;
      try { d.prompt(); } catch (e) {}
      paint();
    });
  }
  paint();
})();
