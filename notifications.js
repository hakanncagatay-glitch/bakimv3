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

async function fcmTokenKullaniciyaKaydet(token) {

    const oturum =
        localStorage.getItem("bakimProUser");

    // Kullanıcı henüz hazır değilse
    if (!oturum) {

        console.log(
            "Kullanıcı oturumu henüz hazır değil."
        );

        return false;
    }

    try {

        const user =
            JSON.parse(oturum);

        console.log(
            "FCM KULLANICI:",
            user
        );

        console.log(
            "FCM KULLANICI ID:",
            user.id
        );

        if (!user.id) {

            console.error(
                "Kullanıcı ID bulunamadı."
            );

            return false;
        }

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
            "FCM TOKEN KAYIT SONUCU:",
            sonuc
        );

        return sonuc.success === true;

    }
    catch (err) {

        console.error(
            "FCM token gönderilemedi:",
            err
        );

        return false;
    }
}


// İlk deneme
let fcmTokenKaydedildi =
    await fcmTokenKullaniciyaKaydet(token);


// Login biraz sonra tamamlanıyorsa
// tekrar dene
if (!fcmTokenKaydedildi) {

    let deneme = 0;

    const fcmTimer =
        setInterval(
            async function () {

                deneme++;

                console.log(
                    "FCM kullanıcı bekleniyor... Deneme:",
                    deneme
                );

                const basarili =
                    await fcmTokenKullaniciyaKaydet(token);

                if (
                    basarili ||
                    deneme >= 10
                ) {

                    clearInterval(
                        fcmTimer
                    );

                    if (basarili) {

                        console.log(
                            "✅ FCM TOKEN KULLANICIYA KAYDEDİLDİ."
                        );

                    }
                    else {

                        console.error(
                            "❌ FCM TOKEN KAYDEDİLEMEDİ."
                        );

                    }

                }

            },
            1000
        );

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
