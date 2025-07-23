const CACHE_NAME = 'gestor-notas-v2'; // Cambia versión para forzar actualización
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './img/rat.png',
  './img/icon.png',
  './img/launcher.png'
];

// Instalación: cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  // Activar el service worker inmediatamente después de instalar
  self.skipWaiting();
});

// Activación: eliminar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
  // Tomar control inmediatamente
  self.clients.claim();
});

// Fetch: network-first (intenta la red, si falla, cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      // Actualizar caché con la respuesta
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, responseClone);
      });
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
