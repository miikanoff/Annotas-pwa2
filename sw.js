const CACHE_NAME = 'gestor-notas-v1';
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


// Instala el service worker y guarda archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Intercepta peticiones y sirve desde caché si es posible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
