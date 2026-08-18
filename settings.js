// =====================================================
// SETTINGS.JS
// Bakım Pro - Ayarlar Modülü
// =====================================================


// =====================================================
// AYARLAR SEKME DEĞİŞTİRME
// =====================================================
let duzenlenenKullaniciId = null;
let ayarKullanicilar = [];
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
    if (sekmeId === "locationsSettings") {

        konumlariYukle();

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


    // Yeni kullanıcıda şifre zorunlu
    // Düzenlemede boş bırakılabilir
    if (!duzenlenenKullaniciId && !sifre) {

        alert("Şifre giriniz.");

        return;

    }


    var params = new URLSearchParams();


    // =================================================
    // DÜZENLEME
    // =================================================

    if (duzenlenenKullaniciId) {

        params.append(
            "action",
            "kullaniciGuncelle"
        );

        params.append(
            "id",
            duzenlenenKullaniciId
        );

    }

    // =================================================
    // YENİ KULLANICI
    // =================================================

    else {

        params.append(
            "action",
            "kullaniciEkle"
        );

    }


    params.append(
        "adSoyad",
        adSoyad
    );

    params.append(
        "kullaniciAdi",
        kullaniciAdi
    );

    params.append(
        "sifre",
        sifre
    );

    params.append(
        "rol",
        rol
    );

    params.append(
        "departman",
        departman
    );

    params.append(
        "durum",
        durum
    );


    fetch(
        API + "?" + params.toString()
    )

    .then(function(response) {

        return response.json();

    })

    .then(function(result) {

        console.log(
            "Kullanıcı kayıt sonucu:",
            result
        );


        if (!result.success) {

            alert(
                result.message ||
                "İşlem gerçekleştirilemedi."
            );

            return;

        }


        alert(
            result.message ||
            "İşlem başarılı."
        );


        duzenlenenKullaniciId = null;


        kullaniciFormKapat();

        kullanicilariYukle();

    })

    .catch(function(error) {

        console.error(
            "Kullanıcı işlem hatası:",
            error
        );

        alert(
            "Sunucu bağlantısında hata oluştu."
        );

    });

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


    fetch(API + "?action=kullanicilariListele")

        .then(function(response) {

            return response.json();

        })

        .then(function(result) {

            console.log("Kullanıcı listesi:", result);
ayarKullanicilar = result.data || [];

            if (!result.success) {

                liste.innerHTML = `
                    <tr>
                        <td colspan="6"
                            style="text-align:center;padding:30px;">
                            ${result.message || "Kullanıcılar yüklenemedi."}
                        </td>
                    </tr>
                `;

                return;

            }


            if (!result.data || result.data.length === 0) {

                liste.innerHTML = `
                    <tr>
                        <td colspan="6"
                            style="text-align:center;padding:30px;">
                            Henüz kullanıcı bulunmuyor.
                        </td>
                    </tr>
                `;

                return;

            }


            liste.innerHTML = "";


            result.data.forEach(function(user) {

                var rolAdi = {

                    operator: "Operatör",
                    technician: "Bakımcı",
                    supervisor: "Bakım Sorumlusu",
                    admin: "Yönetici"

                }[user.rol] || user.rol;


                liste.innerHTML += `

                    <tr>

                        <td>${user.adSoyad || ""}</td>

                        <td>${user.kullaniciAdi || ""}</td>

                        <td>${rolAdi}</td>

                        <td>${user.departman || "-"}</td>

                        <td>${user.durum || ""}</td>

                        <td>

                            <button
    class="btn-secondary"
    type="button"
    onclick="kullaniciDuzenle('${user.id}')">

    Düzenle

</button>

                        </td>

                    </tr>

                `;

            });

        })

        .catch(function(error) {

            console.error("Kullanıcı listeleme hatası:", error);

            liste.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;padding:30px;">
                        Kullanıcılar yüklenemedi.
                    </td>
                </tr>
            `;

        });

}

// =====================================================
// AYARLAR SAYFASI AÇILDIĞINDA
// =====================================================

function ayarlarYukle() {

    kullanicilariYukle();

}
// =====================================================
// KULLANICI DÜZENLE
// =====================================================

function kullaniciDuzenle(id) {

    const user = ayarKullanicilar.find(function(item) {

        return String(item.id) === String(id);

    });

    if (!user) {

        alert("Kullanıcı bulunamadı.");

        return;

    }


    duzenlenenKullaniciId = user.id;


    document.getElementById("userFullName").value =
        user.adSoyad || "";

    document.getElementById("userUsername").value =
        user.kullaniciAdi || "";

    document.getElementById("userPassword").value = "";

    document.getElementById("userRole").value =
        user.rol || "operator";

    document.getElementById("userDepartment").value =
        user.departman || "";

    document.getElementById("userStatus").value =
        user.durum || "Aktif";


    // Formu aç
    document.getElementById("kullaniciForm").style.display =
        "block";


    // Başlığı değiştir
    const baslik =
        document.querySelector("#kullaniciForm h3");

    if (baslik) {

        baslik.innerText = "Kullanıcı Düzenle";

    }


    // Şifre zorunlu değil
    const sifreLabel =
        document.querySelector('label[for="userPassword"]');

    if (sifreLabel) {

        sifreLabel.innerText =
            "Şifre (değiştirmek için)";

    }


    // Kaydet butonunu Güncelle yap
    const buton =
        document.querySelector(
            '#kullaniciForm button[onclick="kullaniciKaydet()"]'
        );

    if (buton) {

        buton.innerHTML =
            '<i class="fa-solid fa-save"></i> Güncelle';

    }

}
// =====================================================
// KONUM YÖNETİMİ
// =====================================================

let ayarKonumlar = [];


// =====================================================
// KONUM FORMU AÇ
// =====================================================

function konumFormAc() {

    const form =
        document.getElementById("konumForm");

    if (form) {

        form.style.display = "block";

    }

    const input =
        document.getElementById("konumAdi");

    if (input) {

        input.value = "";

        input.focus();

    }

}


// =====================================================
// KONUM FORMU KAPAT
// =====================================================

function konumFormKapat() {

    const form =
        document.getElementById("konumForm");

    if (form) {

        form.style.display = "none";

    }
duzenlenenKonumId = null;
}


// =====================================================
// KONUM LİSTELE
// =====================================================

function konumlariYukle() {

    const liste =
        document.getElementById("konumListe");

    if (!liste) {

        return;

    }


    liste.innerHTML = `
        <tr>
            <td colspan="3"
                style="text-align:center;padding:25px;">
                Konumlar yükleniyor...
            </td>
        </tr>
    `;


    fetch(
        API + "?action=konumlariListele"
    )

    .then(function(response) {

        return response.json();

    })

    .then(function(result) {

        console.log(
            "Konum listesi:",
            result
        );


        if (!result.success) {

            liste.innerHTML = `
                <tr>
                    <td colspan="3"
                        style="text-align:center;padding:25px;">
                        ${result.message || "Konumlar yüklenemedi."}
                    </td>
                </tr>
            `;

            return;

        }


        ayarKonumlar =
            result.data || [];


        if (ayarKonumlar.length === 0) {

            liste.innerHTML = `
                <tr>
                    <td colspan="3"
                        style="text-align:center;padding:25px;">
                        Henüz konum bulunmuyor.
                    </td>
                </tr>
            `;

            return;

        }


        liste.innerHTML = "";


        ayarKonumlar.forEach(function(konum) {

            liste.innerHTML += `

                <tr>

                    <td>
                        ${konum.konum || ""}
                    </td>

                    <td>
                        ${konum.durum || ""}
                    </td>

                    <td>

                       <button
    class="btn-secondary"
    type="button"
    onclick="konumDuzenle('${konum.id}')">

    Düzenle

</button>

                    </td>

                </tr>

            `;

        });

    })

    .catch(function(error) {

        console.error(
            "Konum listeleme hatası:",
            error
        );

        liste.innerHTML = `
            <tr>
                <td colspan="3"
                    style="text-align:center;padding:25px;">
                    Konumlar yüklenemedi.
                </td>
            </tr>
        `;

    });

}


// =====================================================
// KONUM KAYDET
// =====================================================

function konumKaydet() {

    const konum =
        document
            .getElementById("konumAdi")
            .value
            .trim();


    if (!konum) {

        alert("Konum adı giriniz.");

        return;

    }


    const params =
        new URLSearchParams();


    // Düzenleme
    if (duzenlenenKonumId) {

        params.append(
            "action",
            "konumGuncelle"
        );

        params.append(
            "id",
            duzenlenenKonumId
        );

    }

    // Yeni konum
    else {

        params.append(
            "action",
            "konumEkle"
        );

    }


    params.append(
        "konum",
        konum
    );


    fetch(
        API + "?" + params.toString()
    )

    .then(function(response) {

        return response.json();

    })

    .then(function(result) {

        console.log(
            "Konum işlem sonucu:",
            result
        );


        if (!result.success) {

            alert(
                result.message ||
                "İşlem gerçekleştirilemedi."
            );

            return;

        }


        alert(
            result.message ||
            "İşlem başarılı."
        );


        duzenlenenKonumId = null;


        konumFormKapat();

        konumlariYukle();

    })

    .catch(function(error) {

        console.error(
            "Konum işlem hatası:",
            error
        );

        alert(
            "Sunucu bağlantısında hata oluştu."
        );

    });

}
// =====================================================
// KONUM DÜZENLE
// =====================================================

let duzenlenenKonumId = null;


function konumDuzenle(id) {

    const konum =
        ayarKonumlar.find(function(item) {

            return String(item.id) === String(id);

        });


    if (!konum) {

        alert("Konum bulunamadı.");

        return;

    }


    duzenlenenKonumId = konum.id;


    const input =
        document.getElementById("konumAdi");

    if (input) {

        input.value =
            konum.konum || "";

    }


    konumFormAc();


    const baslik =
        document.querySelector("#konumForm h3");

    if (baslik) {

        baslik.innerText =
            "Konum Düzenle";

    }


    const buton =
        document.querySelector(
            '#konumForm button[onclick="konumKaydet()"]'
        );

    if (buton) {

        buton.innerHTML =
            '<i class="fa-solid fa-save"></i> Güncelle';

    }

}
