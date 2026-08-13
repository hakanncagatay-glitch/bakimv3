// ==========================
// ARIZALAR
// ==========================
let secilenAriza = null;
let aktifFaultKonum = "";
let aktifFaultDurum = "";

let tumArizalar = [];
async function arizalariYukle(){

    const alan = document.getElementById("faultList");

    if(!alan) return;

    alan.innerHTML = "Yükleniyor...";

    try{

        const response = await fetch(API + "?action=arizaListele");

        const sonuc = await response.json();

        if(!sonuc.success){

            alan.innerHTML = "Kayıt bulunamadı.";

            return;

        }

        tumArizalar = sonuc.data;
        console.log(tumArizalar[0]);

        alan.innerHTML = "";

    tumArizalar.forEach(a=>{

        alan.innerHTML+=arizaSatiri(a);

    });

    document.getElementById("faultOpen").innerText =
    tumArizalar.filter(x=>x.durum=="Açık").length;

    document.getElementById("faultProgress").innerText=
        tumArizalar.filter(x=>x.durum=="Müdahale Ediliyor").length;

    document.getElementById("faultClosed").innerText=
        tumArizalar.filter(x=>x.durum=="Tamamlandı").length;

    document.getElementById("faultAvg").innerText="18 dk";
    faultKonumlariniDoldur();
    }

    catch(err){

        console.error(err);

        alan.innerHTML = "Veriler alınamadı.";

    }

}


function arizaSatiri(a){

    let renk="#ef4444";
    let durum="Açık";

    if(a.durum=="mudahale"){

        renk="#f59e0b";
        durum="Müdahale Ediliyor";

    }

    if(a.durum=="kapali"){

        renk="#22c55e";
        durum="Tamamlandı";

    }

    return `

<div class="fault-item"
     style="
background:#fff;
border-left:7px solid ${renk};
border-radius:14px;
padding:20px;
box-shadow:0 4px 14px rgba(0,0,0,.08);
display:flex;
justify-content:space-between;
align-items:center;
">

<div>

<h3>${a.envanter} - ${a.marka} ${a.model}</h3>

<p>📍 ${a.konum}</p>

<p>${a.aciklama}</p>

<small>

Bildiren : ${a.bildiren}

</small>

</div>

<div style="text-align:right;">

<div
style="
font-weight:bold;
color:${renk};
margin-bottom:10px;
">

${durum}

</div>

<div style="
font-size:13px;
color:#6b7280;
margin-top:8px;
">

🕒 ${beklemeHesapla(a.tarih,a.saat)}

</div>

<div
style="
margin-top:15px;
display:flex;
gap:10px;
justify-content:flex-end;
">

<button
    class="btn-secondary"
    onclick="arizaDetay('${a.id}')">

    Detay

</button>

<button
    class="btn-primary"
   onclick="faultMudahale('${a.id}')">

    Müdahale Et

</button>

</div>

</div>

</div>

`;

}

document.addEventListener("DOMContentLoaded",()=>{

    arizalariYukle();

});
function arizaFiltrele(){

    const ara = document
        .getElementById("faultSearch")
        .value
        .toLowerCase()
        .trim();

    const liste = tumArizalar.filter(a=>{

        const araUygun=

            a.envanter.toLowerCase().includes(ara) ||

            a.marka.toLowerCase().includes(ara) ||

            a.model.toLowerCase().includes(ara) ||

            a.konum.toLowerCase().includes(ara);

        const konumUygun=

            aktifFaultKonum=="" ||

            a.konum==aktifFaultKonum;

        const durumUygun=

            aktifFaultDurum=="" ||

            a.durum==aktifFaultDurum;

        return araUygun && konumUygun && durumUygun;

    });

    const alan=document.getElementById("faultList");

    alan.innerHTML="";

    liste.forEach(a=>{

        alan.innerHTML+=arizaSatiri(a);

    });

}
function faultKonumlariniDoldur(){

    const select=document.getElementById("faultLocation");

    select.innerHTML=
        '<option value="">Tüm Bölümler</option>';

    const konumlar=[...new Set(

        tumArizalar.map(x=>x.konum)

    )];

    konumlar.sort().forEach(k=>{

        select.innerHTML+=`
        <option value="${k}">
        ${k}
        </option>
        `;

    });

}
function arizaDetay(id){

    console.log("DETAY ÇALIŞTI", id);

    const a = tumArizalar.find(x => x.id == id);

    if(!a) return;

    let kapatmaAlani = "";

    // Arıza henüz kapanmadıysa kapatma alanını göster
    if(a.durum !== "Tamamlandı"){

        kapatmaAlani = `

            <hr>

            <h4>🔧 Arıza Çözümü</h4>

            <textarea
                id="arizaCozum"
                placeholder="Yapılan işlemi ve çözümü yazınız..."
                style="
                    width:100%;
                    min-height:100px;
                    padding:10px;
                    border:1px solid #d1d5db;
                    border-radius:8px;
                    box-sizing:border-box;
                    margin-top:8px;
                "
            >${a.cozum || ""}</textarea>

            <h4 style="margin-top:18px;">
                🏷️ Arıza Tipi
            </h4>

            <select
                id="arizaTipi"
                style="
                    width:100%;
                    padding:10px;
                    border:1px solid #d1d5db;
                    border-radius:8px;
                    margin-top:8px;
                "
            >

                <option value="">Arıza tipi seçiniz</option>

                <option value="Mekanik"
                    ${a.arizaTipi === "Mekanik" ? "selected" : ""}>
                    Mekanik
                </option>

                <option value="Elektrik"
                    ${a.arizaTipi === "Elektrik" ? "selected" : ""}>
                    Elektrik
                </option>

                <option value="Elektronik"
                    ${a.arizaTipi === "Elektronik" ? "selected" : ""}>
                    Elektronik
                </option>

                <option value="Pnömatik"
                    ${a.arizaTipi === "Pnömatik" ? "selected" : ""}>
                    Pnömatik
                </option>

                <option value="Hidrolik"
                    ${a.arizaTipi === "Hidrolik" ? "selected" : ""}>
                    Hidrolik
                </option>

                <option value="Yazılım"
                    ${a.arizaTipi === "Yazılım" ? "selected" : ""}>
                    Yazılım
                </option>

                <option value="Diğer"
                    ${a.arizaTipi === "Diğer" ? "selected" : ""}>
                    Diğer
                </option>

            </select>

            <button
                class="btn-primary"
                style="margin-top:20px;"
                onclick="arizaKapatKaydet('${a.id}')">

                ✅ Arızayı Kapat

            </button>

        `;

    }

    document.getElementById("bakimDetayIcerik").innerHTML = `

        <h2 style="margin-bottom:20px;">
            🚨 Arıza Detayı
        </h2>

        <div class="detail-grid">

            <div class="detail-item">
                <label>Arıza No</label>
                <strong>${a.id}</strong>
            </div>

            <div class="detail-item">
                <label>Durum</label>
                <strong>${a.durum}</strong>
            </div>

            <div class="detail-item">
                <label>Tarih</label>
                <strong>${a.tarih}</strong>
            </div>

            <div class="detail-item">
                <label>Saat</label>
                <strong>${a.saat}</strong>
            </div>

            <div class="detail-item">
                <label>Envanter</label>
                <strong>${a.envanter}</strong>
            </div>

            <div class="detail-item">
                <label>Marka</label>
                <strong>${a.marka}</strong>
            </div>

            <div class="detail-item">
                <label>Model</label>
                <strong>${a.model}</strong>
            </div>

            <div class="detail-item">
                <label>Hat</label>
                <strong>${a.konum}</strong>
            </div>

            <div class="detail-item">
                <label>Bildiren</label>
                <strong>${a.bildiren}</strong>
            </div>

            <div class="detail-item">
                <label>Bakımcı</label>
                <strong>${a.bakimci || "-"}</strong>
            </div>

            <div class="detail-item">
                <label>Başlama</label>
                <strong>${a.baslama || "-"}</strong>
            </div>

            <div class="detail-item">
                <label>Bitiş</label>
                <strong>${a.bitis || "-"}</strong>
            </div>

        </div>

        <hr>

        <h4>📝 Arıza Açıklaması</h4>

        <p>${a.aciklama}</p>

        <hr>

        <h4>🔧 Çözüm</h4>

        <p>${a.cozum || "-"}</p>

        ${kapatmaAlani}

    `;

    document
        .getElementById("bakimDetay")
        .classList.add("active");

}
async function arizaKapatKaydet(id){

    const cozum =
        document.getElementById("arizaCozum")
        .value
        .trim();

    const arizaTipi =
        document.getElementById("arizaTipi")
        .value
        .trim();

    if(arizaTipi === ""){

        alert("Lütfen arıza tipini seçiniz.");

        return;

    }

    if(cozum === ""){

        alert("Lütfen yapılan işlemi / çözümü giriniz.");

        return;

    }

    try{

        const url =
            API +
            "?action=arizaKapat" +
            "&id=" +
            encodeURIComponent(id) +
            "&cozum=" +
            encodeURIComponent(cozum) +
            "&arizaTipi=" +
            encodeURIComponent(arizaTipi);

        const response =
            await fetch(url);

        const sonuc =
            await response.json();

        console.log(
            "Arıza kapatma sonucu:",
            sonuc
        );

        if(!sonuc.success){

            alert(
                sonuc.message ||
                "Arıza kapatılamadı."
            );

            return;

        }

        alert("✅ Arıza başarıyla kapatıldı.");

        detayKapat();

        await arizalariYukle();

    }

    catch(err){

        console.error(
            "Arıza kapatma hatası:",
            err
        );

        alert(
            "Arıza kapatılırken bağlantı hatası oluştu."
        );

    }

}
async function faultMudahale(id){

    detayKapat();

    const a = tumArizalar.find(x => x.id == id);

    if(!a) return;

    // Aktif arızayı sakla
    secilenAriza = a;
    window.secilenAriza = a;

    console.log("MÜDAHALE EDİLECEK ARIZA:", a);

    try{

        // ===============================
        // ARIZAYI MÜDAHALE DURUMUNA AL
        // ===============================

        const url =
            API +
            "?action=arizaDurumGuncelle" +
            "&id=" + encodeURIComponent(a.id) +
            "&durum=" + encodeURIComponent("Müdahale Ediliyor") +
            "&bakimci=" + encodeURIComponent("Hakan Çağatay");

        console.log("MÜDAHALE API:", url);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log(
            "MÜDAHALE SONUCU:",
            sonuc
        );

        // API başarısızsa bakım ekranına geçme
        if(!sonuc.success){

            alert(
                sonuc.message ||
                "Arıza müdahale durumuna geçirilemedi."
            );

            return;

        }

        // ===============================
        // SAYFALARI GİZLE
        // ===============================

        document
            .querySelectorAll("section")
            .forEach(section => {

                section.style.display = "none";

            });

        // ===============================
        // YENİ BAKIM SAYFASINI AÇ
        // ===============================

        document
            .getElementById("newMaintenancePage")
            .style.display = "block";

        // ===============================
        // MENÜ
        // ===============================

        document
            .querySelectorAll(".sidebar li")
            .forEach(li => {

                li.classList.remove("active");

            });

        document
            .getElementById("menuNewMaintenance")
            .classList.add("active");

        // ===============================
        // ENVANTERİ OTOMATİK YAZ
        // ===============================

        document
            .getElementById("bakimMakineAra")
            .value = a.envanter;

        // ===============================
        // MAKİNEYİ YÜKLE
        // ===============================

        setTimeout(async () => {

            await bakimMakineBul();

            document
                .getElementById("bakimTipi")
                .value = "Arıza Bakımı";

        }, 100);

    }
    catch(err){

        console.error(
            "Müdahale işlemi hatası:",
            err
        );

        alert(
            "Arıza müdahale durumu güncellenemedi."
        );

    }

}
async function arizaGonder(){

    const envanter = document.getElementById("faultEnvanter").value.trim();
    const hat = document.getElementById("faultHat").value.trim();
    const bildiren = document.getElementById("faultBildiren").value.trim();
    const aciklama = document.getElementById("faultAciklama").value.trim();

    if(envanter==""){

        alert("Makine seçiniz.");

        return;

    }

    if(bildiren==""){

        alert("Bildiren adını giriniz.");

        return;

    }

    if(aciklama==""){

        alert("Arıza açıklamasını giriniz.");

        return;

    }

    try{

        const response = await fetch(

            API +

            "?action=arizaKaydet" +

            "&envanter=" + encodeURIComponent(envanter) +

            "&marka=" + encodeURIComponent(secilenMakine.Marka) +

            "&model=" + encodeURIComponent(secilenMakine.Model) +

            "&hat=" + encodeURIComponent(hat) +

            "&bildiren=" + encodeURIComponent(bildiren) +

            "&aciklama=" + encodeURIComponent(aciklama)

        );

        const sonuc = await response.json();

        if(!sonuc.success){

            alert("Kayıt başarısız.");

            return;

        }

        alert("✅ Arıza başarıyla kaydedildi.");

        document.getElementById("faultEnvanter").value="";
        document.getElementById("faultHat").value="";
        document.getElementById("faultBildiren").value="";
        document.getElementById("faultAciklama").value="";
        document.getElementById("faultMakineBilgi").innerHTML="Makine seçilmedi.";

        toggleFaultForm();

        arizalariYukle();

    }

    catch(err){

        console.error(err);

        alert("Sunucu bağlantı hatası.");

    }

}
function toggleFaultForm(){

    const form = document.getElementById("faultForm");

    if(!form) return;

    if(form.style.display === "none" || form.style.display === ""){

        form.style.display = "block";

    }else{

        form.style.display = "none";

    }

}
function beklemeHesapla(tarih, saat){

    if(!tarih) return "-";

    let baslangic;

    // Google Sheets Date objesi geldiyse
    if(tarih instanceof Date){

        baslangic = new Date(tarih);

        if(saat){

            const s = String(saat).split(":");

            baslangic.setHours(Number(s[0]) || 0);
            baslangic.setMinutes(Number(s[1]) || 0);

        }

    }
    // String geldiyse
    else{

        const p = String(tarih).split(".");

        if(p.length !== 3) return "-";

        const s = (saat || "00:00").split(":");

        baslangic = new Date(

            Number(p[2]),
            Number(p[1]) - 1,
            Number(p[0]),
            Number(s[0]),
            Number(s[1])

        );

    }

    if(isNaN(baslangic.getTime()))
        return "-";

    const fark = Math.floor((Date.now() - baslangic.getTime()) / 60000);

    if(fark < 60)
        return fark + " dk";

    if(fark < 1440)
        return Math.floor(fark / 60) + " sa";

    return Math.floor(fark / 1440) + " gün";

}
function faultQrOku(){

    document.getElementById("faultQrReader").style.display = "block";

    const html5QrCode = new Html5Qrcode("faultQrReader");

    html5QrCode.start(

        { facingMode:"environment" },

        {
            fps:10,
            qrbox:250
        },

        function(decodedText){

            html5QrCode.stop().then(()=>{

                document.getElementById("faultQrReader").style.display="none";

                document.getElementById("faultEnvanter").value = decodedText;

                faultMakineBul();

            });

        }

    );

}
