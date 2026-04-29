const CACHE_NAME = "ss-learning-lab-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./interest-form.html",
  "./how-it-works.html",
  "./programs-pricing.html",
  "./resource-hub.html",
  "./about.html",
  "./contact.html",
  "./resources/daily-schedule-template.html",
  "./resources/virtual-learning-checklist.html",
  "./resources/is-virtual-school-right-guide.html",
  "./resources/helping-kids-focus-at-home.html",
  "./resources/structuring-remote-learning-days.html",
  "./styles.css",
  "./script.js",
  "./site.webmanifest",
  "./images/ss-learning-lab-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
