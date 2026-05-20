// Service worker — minimal, no caching
// This version intentionally does not cache files to avoid stale content issues

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Clear ALL old caches
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// No fetch handler — let all requests go straight to network
