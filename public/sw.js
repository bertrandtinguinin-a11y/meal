// Service Worker pour MEAL-Pro PWA
const CACHE_NAME = "meal-cache-v2";
const DYNAMIC_CACHE = "meal-dynamic-v2";

// Fichiers à mettre en cache dès l'installation
const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/synthese",
  "/analyse",
  "/collecte",
  "/validation",
  "/activities",
  "/import",
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
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Intercepter les requêtes
self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les requêtes API et Supabase
  if (event.request.url.includes("/api/") ||
      event.request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((fallback) => {
            return fallback || caches.match("/");
          });
        });
    })
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "MEAL-Pro",
    body: "Nouvelle notification",
    icon: "/icons/icon-192.png",
  };

  const options = {
    body: data.body,
    icon: data.icon || "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/dashboard" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click sur notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const client = clientList.find((c) => c.url.includes(url) && "focus" in c);
      if (client) return client.focus();
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Sync (background sync pour collecte hors-ligne)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-collectes") {
    event.waitUntil(syncCollectes());
  }
});

async function syncCollectes() {
  try {
    const cache = await caches.open("meal-pending");
    const requests = await cache.keys();
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (e) {
        console.error("Sync failed for", request.url, e);
      }
    }
  } catch (e) {
    console.error("Sync error:", e);
  }
}
