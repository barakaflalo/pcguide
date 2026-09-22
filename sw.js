/* AppNest · מדריך המחשב — Service Worker
   Bump CACHE_VERSION on every release so clients pick up the new files. */
const CACHE_VERSION = "pcguide-v1.4.0";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./privacy_policy.html",
  "./icon-192.png",
  "./icon-512.png",
  "./appnest-assistant.js"
];

// Install: pre-cache the app shell.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: drop old caches.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for same-origin GET (so updates come in on their own),
// falling back to cache when offline. Cross-origin requests pass straight through.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || caches.match("./index.html"))
      )
  );
});
