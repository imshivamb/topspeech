const CACHE_NAME = "topspeech-daily-lesson-v2";
const scopedUrl = (path = "") => new URL(path, self.registration.scope).toString();
const ASSETS = [
  scopedUrl(),
  scopedUrl("index.html"),
  scopedUrl("manifest.webmanifest"),
  scopedUrl("icon.svg"),
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
        ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(scopedUrl(), copy));
          return response;
        })
        .catch(() => caches.match(scopedUrl()).then((cached) => cached || caches.match(scopedUrl("index.html")))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match(scopedUrl()))
      );
    }),
  );
});
