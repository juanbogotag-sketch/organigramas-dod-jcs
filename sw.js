/* Torio — service worker: red primero; la caché solo es respaldo sin conexión.
   Los archivos propios del organigrama (index.html, app.js, styles.css) pasan directos. */
var CACHE = 'torio-v4';
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(['repositorio.html', 'manifest.webmanifest',
        'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png']);
    }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('index.html') || url.pathname.endsWith('js/app.js') ||
      url.pathname.endsWith('css/styles.css')) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
