// =====================================================
// BAKIM PRO - FCM BİLDİRİMLERİ
// =====================================================
console.log("🔔 NOTIFICATIONS.JS ÇALIŞTI");
const messaging = firebase.messaging();

async function bildirimleriBaslat() {

    try {

        // Bildirim izni iste
        const izin =
            await Notification.requestPermission();

        if (izin !== "granted") {

            console.log(
                "Bildirim izni verilmedi."
            );

            return;

        }

        // Mevcut Service Worker'ı al
        const registration =
            await navigator.serviceWorker.ready;

        // FCM cihaz tokenını al
        const token =
            await messaging.getToken({

                vapidKey:
                    "BURAYA_FIREBASE_VAPID_KEY",

                serviceWorkerRegistration:
                    registration

            });

        if (!token) {

            console.log(
                "FCM token alınamadı."
            );

            return;

        }

        console.log(
            "FCM TOKEN:",
            token
        );

        // Daha sonra Google Apps Script'e göndereceğiz
        localStorage.setItem(
            "bakimProFcmToken",
            token
        );

        console.log(
            "Telefon bildirim sistemi hazır."
        );

    }
    catch (err) {

        console.error(
            "FCM başlatma hatası:",
            err
        );

    }

}


// Uygulama açıkken gelen bildirim
messaging.onMessage(function (payload) {

    console.log(
        "Bildirim geldi:",
        payload
    );

    const baslik =
        payload.notification?.title ||
        "🚨 Bakım Pro";

    const mesaj =
        payload.notification?.body ||
        "Yeni bildirim var.";

    if (
        Notification.permission ===
        "granted"
    ) {

        new Notification(
            baslik,
            {
                body: mesaj,
                icon: "./icon-192.png"
            }
        );

    }

});
window.addEventListener(
    "load",
    function () {

        bildirimleriBaslat();

    }
);
vapidKey:
    "BHtai-0BBUxv59Fn1jD3V0eYFIY2Nca-Art4D8r55JdLKDnVrdLLTlULg23FOCd7V9BbwMXQi4g4JnNI4Y7mRok",
