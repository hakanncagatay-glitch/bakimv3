importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({

    apiKey: "AIzaSyBAKoARFQJRMp31F42su0PeyEGh90GWRBg",
    authDomain: "bakimpro.firebaseapp.com",
    projectId: "bakimpro",
    storageBucket: "bakimpro.firebasestorage.app",
    messagingSenderId: "1014540679469",
    appId: "1:1014540679469:web:eb594949a3112db533bba4"

});

const messaging =
    firebase.messaging();

messaging.onBackgroundMessage(
    function (payload) {

        console.log(
            "Arka planda bildirim:",
            payload
        );

        const notificationTitle =
            payload.notification?.title ||
            "🚨 Bakım Pro";

        const notificationOptions = {

            body:
                payload.notification?.body ||
                "Yeni arıza bildirildi.",

            icon:
                "./icon-192.png",

            badge:
                "./icon-192.png"

        };

        self.registration.showNotification(
            notificationTitle,
            notificationOptions
        );

    }
);
const CACHE_NAME = "bakim-pro-v4";

const APP_FILES = [
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
    "./reports.css",
    "./settings.js",
    "./auth.js",
    "./notifications.js",
    "./icon-192.png",
    "./icon-512.png",
    "./manifest.json"
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
