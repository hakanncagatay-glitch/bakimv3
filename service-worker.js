const CACHE_NAME = "bakim-pro-v4";

const APP_FILES = [
    "./",
    "./dashboard.html",
    "./dashboard.css",
    "./fault.css",
    "./parts.css",
    "./dashboard.js",
    "./planned.js",
    "./fault.js",
    "./faultReport.js",
    "./parts.js",
    "./maintenanceParts.js",
    "./reports.js",
    "./settings.js",
    "./auth.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // Google Apps Script API'lerini cacheleme
    if (url.hostname.includes("script.google.com")) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {

                const responseClone = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
