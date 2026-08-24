// =====================================================
// BAKIM PRO - FCM BİLDİRİMLERİ
// =====================================================

// Firebase'i başlat
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

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
    "BHtai-0BBUxv59Fn1jD3V0eYFIY2Nca-Art4D8r55JdLKDnVrdLLTlULg23FOCd7V9BbwMXQi4g4JnNI4Y7mRok",

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


// =================================================
// FCM TOKEN'I GOOGLE APPS SCRIPT'E GÖNDER
// =================================================

const oturum =
    localStorage.getItem("bakimProUser");

if (oturum) {

    const user =
        JSON.parse(oturum);
    console.log("FCM KULLANICI:", user);
console.log("FCM KULLANICI ID:", user.id);
    const params =
        new URLSearchParams();

    params.append(
        "action",
        "fcmTokenKaydet"
    );

    params.append(
        "kullaniciId",
        user.id
    );

    params.append(
        "fcmToken",
        token
    );


    try {

        const response =
            await fetch(
                API,
                {
                    method: "POST",
                    body: params
                }
            );


        const sonuc =
            await response.json();


        console.log(
            "FCM token kayıt sonucu:",
            sonuc
        );

    }
    catch (err) {

        console.error(
            "FCM token gönderilemedi:",
            err
        );

    }

}


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


bildirimleriBaslat();
