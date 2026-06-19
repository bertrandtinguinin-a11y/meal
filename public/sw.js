// Service Worker pour MEAL PWA
const CACHE_NAME = "meal-cache-v1";

// Fichiers à mettre en cache dès l'installation
const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Nettoyer les anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Intercepter les requêtes et servir depuis le cache si hors-ligne
self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les requêtes API
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache-first pour les ressources statiques
      if (cachedResponse) {
        return cachedResponse;
      }

      // Network-first pour le reste avec fallback cache
      return fetch(event.request)
        .then((response) => {
          // Ne pas mettre en cache les réponses non-OK
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Si réseau indisponible, essayer le cache
          return caches.match(event.request).then((fallback) => {
            if (fallback) return fallback;
            // En dernier recours, retourner la page d'accueil
            return caches.match("/");
          });
        });
    })
  );
});
