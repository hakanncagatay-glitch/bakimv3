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


    var params = new URLSearchParams();

    params.append("action", "kullaniciEkle");
    params.append("adSoyad", adSoyad);
    params.append("kullaniciAdi", kullaniciAdi);
    params.append("sifre", sifre);
    params.append("rol", rol);
    params.append("departman", departman);
    params.append("durum", durum);


    fetch(API_URL + "?" + params.toString())

        .then(function(response) {

            return response.json();

        })

        .then(function(result) {

            console.log("Kullanıcı kayıt sonucu:", result);


            if (!result.success) {

                alert(result.message || "Kullanıcı kaydedilemedi.");

                return;

            }


            alert("Kullanıcı başarıyla kaydedildi.");

            kullaniciFormKapat();

            kullanicilariYukle();

        })

        .catch(function(error) {

            console.error("Kullanıcı kayıt hatası:", error);

            alert("Sunucu bağlantısında hata oluştu.");

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


    fetch(API_URL + "?action=kullanicilariListele")

        .then(function(response) {

            return response.json();

        })

        .then(function(result) {

            console.log("Kullanıcı listesi:", result);


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
                                type="button">

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
