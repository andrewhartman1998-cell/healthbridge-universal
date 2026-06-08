// HealthBridge Universal — Service Worker
const CACHE_NAME = "healthbridge-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback for navigation
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and API calls
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) return;

  // Network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok && response.type === "basic") {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});

// Push Notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.message || "You have a new notification from HealthBridge.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.tag || "healthbridge-notification",
    data: { url: data.url || "/" },
    actions: [
      { action: "view", title: "View" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };
  event.waitUntil(
    self.registration.showNotification(data.title || "HealthBridge", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "view" || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
  }
});
