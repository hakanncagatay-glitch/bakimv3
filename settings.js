// =====================================================
// SETTINGS.JS
// Bakım Pro - Ayarlar Modülü
// =====================================================


// =====================================================
// AYARLAR SEKME DEĞİŞTİRME
// =====================================================

function ayarlarSekmeAc(sekmeId, buton) {

    document.querySelectorAll(".settings-tab").forEach(function (tab) {

        tab.style.display = "none";

    });


    document.querySelectorAll(".settings-menu-item").forEach(function (item) {

        item.classList.remove("active");

    });


    var aktifTab = document.getElementById(sekmeId);

    if (aktifTab) {

        aktifTab.style.display = "block";

    }


    if (buton) {

        buton.classList.add("active");

    }

}


// =====================================================
// KULLANICI FORMU
// =====================================================

function kullaniciFormAc() {

    var form = document.getElementById("kullaniciForm");

    if (form) {

        form.style.display = "block";

    }

}


function kullaniciFormKapat() {

    var form = document.getElementById("kullaniciForm");

    if (form) {

        form.style.display = "none";

    }

    kullaniciFormTemizle();

}


// =====================================================
// FORM TEMİZLE
// =====================================================

function kullaniciFormTemizle() {

    var alanlar = [

        "userFullName",
        "userUsername",
        "userPassword",
        "userDepartment"

    ];


    alanlar.forEach(function (id) {

        var element = document.getElementById(id);

        if (element) {

            element.value = "";

        }

    });


    var role = document.getElementById("userRole");

    if (role) {

        role.value = "operator";

    }


    var status = document.getElementById("userStatus");

    if (status) {

        status.value = "Aktif";

    }

}


// =====================================================
// KULLANICI KAYDET
// ŞİMDİLİK FRONTEND HAZIRLIĞI
// Apps Script bağlantısını GS yapısını gördükten sonra ekleyeceğiz.
// =====================================================

function kullaniciKaydet() {

    var adSoyad =
        document.getElementById("userFullName").value.trim();

    var kullaniciAdi =
        document.getElementById("userUsername").value.trim();

    var sifre =
        document.getElementById("userPassword").value.trim();

    var rol =
        document.getElementById("userRole").value;

    var departman =
        document.getElementById("userDepartment").value.trim();

    var durum =
        document.getElementById("userStatus").value;


    if (!adSoyad) {

        alert("Ad Soyad giriniz.");

        return;

    }


    if (!kullaniciAdi) {

        alert("Kullanıcı adı giriniz.");

        return;

    }


    if (!sifre) {

        alert("Şifre giriniz.");

        return;

    }


    console.log("Yeni kullanıcı:", {

        adSoyad: adSoyad,
        kullaniciAdi: kullaniciAdi,
        sifre: sifre,
        rol: rol,
        departman: departman,
        durum: durum

    });


    // GS bağlantısı burada yapılacak.

    alert("Kullanıcı kayıt bağlantısı bir sonraki aşamada eklenecek.");

}


// =====================================================
// KULLANICI LİSTESİ
// =====================================================

function kullanicilariYukle() {

    var liste =
        document.getElementById("kullaniciListe");


    if (!liste) {

        return;

    }


    liste.innerHTML = `
        <tr>
            <td colspan="6"
                style="text-align:center;padding:30px;">
                Henüz kullanıcı verisi yüklenmedi.
            </td>
        </tr>
    `;

}


// =====================================================
// AYARLAR SAYFASI AÇILDIĞINDA
// =====================================================

function ayarlarYukle() {

    kullanicilariYukle();

}
