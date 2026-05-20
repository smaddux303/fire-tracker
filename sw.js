const CACHE_NAME = 'westminster-fd-v1';
const ASSETS = [
  '/fire-tracker/',
  '/fire-tracker/index.html',
  '/fire-tracker/weather.html',
  '/fire-tracker/burnban.html',
  '/fire-tracker/rehab-heat.html',
  '/fire-tracker/road-conditions.html',
  '/fire-tracker/dashboard.html',
  '/fire-tracker/uv-index.html',
  '/fire-tracker/wildfires.html',
  '/fire-tracker/stream-gauges.html',
  '/fire-tracker/shift-display.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network first for API calls, cache first for app shell
  const url = new URL(event.request.url);
  const isAPI = url.hostname !== 'smaddux303.github.io';

  if (isAPI) {
    // Network first — always try to get fresh data
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for app files
    event.respondWith(
      caches.match(event.request).then(cached => {
        const network = fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        });
        return cached || network;
      })
    );
  }
});
