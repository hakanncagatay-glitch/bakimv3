// =====================================================
// AUTH.JS
// Bakım Pro - Giriş Sistemi
// =====================================================


// =====================================================
// OTURUM KONTROLÜ
// =====================================================

window.addEventListener("load", function () {

    oturumKontrol();

});


// =====================================================
// OTURUMU KONTROL ET
// =====================================================

function oturumKontrol() {

    const oturum =
        localStorage.getItem("bakimProUser");

    if (oturum) {

        try {

            const user = JSON.parse(oturum);

            if (
                user &&
                user.kullaniciAdi &&
                user.rol
            ) {

                sistemiAc(user);

                return;

            }

        }
        catch (err) {

            console.error(
                "Oturum okunamadı:",
                err
            );

        }

    }


    // Oturum yoksa login göster

    loginEkraniniGoster();

}


// =====================================================
// LOGIN EKRANI
// =====================================================

function loginEkraniniGoster() {

    const login =
        document.getElementById("loginPage");

    const sidebar =
        document.querySelector(".sidebar");

    const main =
        document.querySelector(".main");


    if (login) {

        login.style.display = "flex";

    }

    if (sidebar) {

        sidebar.style.display = "none";

    }

    if (main) {

        main.style.display = "none";

    }

}


// =====================================================
// SİSTEMİ AÇ
// =====================================================

function sistemiAc(user) {

    const login =
        document.getElementById("loginPage");

    const sidebar =
        document.querySelector(".sidebar");

    const main =
        document.querySelector(".main");
    // Açık kalmış drawerları kapat
    const bakimDetay =
        document.getElementById("bakimDetay");

    if (bakimDetay) {
        bakimDetay.classList.remove("active");
    }

    if (login) {

        login.style.display = "none";

    }

    if (sidebar) {

        sidebar.style.display = "block";

    }

    if (main) {

        main.style.display = "block";

    }
main.style.marginLeft = "";
main.style.width = "";
main.style.maxWidth = "";
main.style.paddingLeft = "";
main.style.paddingRight = "";
main.style.boxSizing = "";

    // Kullanıcı bilgisini ekrana yaz

    const profileName =
        document.querySelector(".profile strong");

    const profileRole =
        document.querySelector(".profile small");


    if (profileName) {

        profileName.innerText =
            user.adSoyad || user.kullaniciAdi;

    }


    if (profileRole) {

        profileRole.innerText =
            rolAdi(user.rol);

    }
    const profileAvatar =
    document.getElementById("profileAvatar");

if (profileAvatar) {

    const adSoyad =
        user.adSoyad ||
        user.kullaniciAdi ||
        "";

    profileAvatar.src =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(adSoyad) +
        "&background=2563eb&color=fff";
}


    // Yetkileri uygula

    yetkileriUygula(user.rol);

}


// =====================================================
// GİRİŞ YAP
// =====================================================

async function girisYap() {

    const kullaniciAdi =
        document
            .getElementById("loginUsername")
            .value
            .trim();

    const sifre =
        document
            .getElementById("loginPassword")
            .value
            .trim();

    const mesaj =
        document.getElementById("loginMessage");


    if (!kullaniciAdi) {

        mesaj.innerText =
            "Kullanıcı adı giriniz.";

        return;

    }


    if (!sifre) {

        mesaj.innerText =
            "Şifre giriniz.";

        return;

    }


    mesaj.innerText =
        "Giriş yapılıyor...";


    try {

        const params = new URLSearchParams();

params.append("action", "login");
params.append("kullaniciAdi", kullaniciAdi);
params.append("sifre", sifre);


const response =
    await fetch(API, {

        method: "POST",

        body: params

    });


        const sonuc =
            await response.json();


        console.log(
            "Login sonucu:",
            sonuc
        );


        if (!sonuc.success) {

            mesaj.innerText =
                sonuc.message ||
                "Kullanıcı adı veya şifre hatalı.";

            return;

        }


        // Kullanıcı bilgisini kaydet

        localStorage.setItem(
            "bakimProUser",
            JSON.stringify(
                sonuc.data
            )
        );


        // Sistemi aç

        sistemiAc(
            sonuc.data
        );


    }
    catch (err) {

        console.error(
            "Login hatası:",
            err
        );

        mesaj.innerText =
            "Sunucu bağlantısında hata oluştu.";

    }

}


// =====================================================
// ROL ADI
// =====================================================

function rolAdi(rol) {

    const roller = {

        operator:
            "Operatör",

        technician:
            "Bakımcı",

        supervisor:
            "Bakım Sorumlusu",

        admin:
            "Yönetici"

    };


    return roller[rol] || rol;

}


// =====================================================
// YETKİLER
// =====================================================

function yetkileriUygula(rol) {

    // Önce hepsini göster

    document
        .querySelectorAll(".sidebar li")
        .forEach(function (item) {

            item.style.display = "";

        });


    // Operatör
    // Şimdilik sadece Arıza

    if (rol === "operator") {

        const izinli = [
            "menuDashboard",
            "menuFaults"
        ];


        document
            .querySelectorAll(".sidebar li")
            .forEach(function (item) {

                if (
                    !izinli.includes(item.id)
                ) {

                    item.style.display =
                        "none";

                }

            });

    }


    // Bakımcı

    if (rol === "technician") {

        const izinli = [

            "menuDashboard",
            "menuMachines",
            "menuNewMaintenance",
            "menuHistory",
            "menuPlanned",
            "menuFaults",
            "menuParts"

        ];


        document
            .querySelectorAll(".sidebar li")
            .forEach(function (item) {

                if (
                    !izinli.includes(item.id)
                ) {

                    item.style.display =
                        "none";

                }

            });

    }


    // Bakım Sorumlusu

    if (rol === "supervisor") {

        const izinli = [

            "menuDashboard",
            "menuMachines",
            "menuNewMaintenance",
            "menuHistory",
            "menuPlanned",
            "menuFaults",
            "menuParts",
            "menuReports"

        ];


        document
            .querySelectorAll(".sidebar li")
            .forEach(function (item) {

                if (
                    !izinli.includes(item.id)
                ) {

                    item.style.display =
                        "none";

                }

            });

    }

    // Admin → her şey açık

}


// =====================================================
// GİRİŞ YAPMADAN ARIZA BİLDİR
// =====================================================

function misafirArizaBildir() {

    const login =
        document.getElementById("loginPage");

    const sidebar =
        document.querySelector(".sidebar");

    const main =
        document.querySelector(".main");


    if (login) {

        login.style.display =
            "none";

    }

  if (main) {

    main.style.display = "block";

    main.style.setProperty(
        "margin-left",
        "0px",
        "important"
    );

    main.style.setProperty(
        "width",
        "100vw",
        "important"
    );

    main.style.setProperty(
        "max-width",
        "100vw",
        "important"
    );

    main.style.setProperty(
        "padding",
        "12px",
        "important"
    );

    main.style.boxSizing = "border-box";

}


    // Sadece arıza sayfasını göster

    document
        .querySelectorAll("section")
        .forEach(function (section) {

            section.style.display =
                "none";

        });


    const faultPage =
        document.getElementById(
            "faultPage"
        );


    if (faultPage) {

        faultPage.style.display =
            "block";

    }


    // Sidebar kapalı

    if (sidebar) {

        sidebar.style.display =
            "none";

    }


    // Arıza bildirim formunu aç

    if (
        typeof toggleFaultForm ===
        "function"
    ) {

        toggleFaultForm();

    }

}


// =====================================================
// ÇIKIŞ
// =====================================================

function cikisYap() {

    localStorage.removeItem(
        "bakimProUser"
    );

    location.reload();

}
