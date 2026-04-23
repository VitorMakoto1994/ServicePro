const CACHE_NAME = 'servicepro-v2'; // Mudei para v2 para o Chrome ignorar o cache antigo

const assets = [
  './',
  './index.html',
  './site.webmanifest',
  './web-app-manifest-192x192.png',
  './web-app-manifest-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
];

// Instalando e salvando os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ServiceWorker: Salvando arquivos de instalação...');
      return cache.addAll(assets);
    })
  );
});

// Ativando e limpando caches antigos de versões anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('ServiceWorker: Limpando cache antigo...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Respondendo mesmo se estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});