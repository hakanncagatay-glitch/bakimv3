const API = "https://script.google.com/macros/s/AKfycbyp4Dexvk759RdZEEdAIS-urDlkJR9-r39_r_gb1w13eidoSpePkYX-6sUBYYZRdCu6ng/exec";
let tumMakineler = [];
let tumBakimlar = [];
let aktifKonum = "";
let aktifDurum = "";
window.onload = async () => {

    document.getElementById("dashboardPage").style.display = "block";

    document.querySelectorAll("section").forEach(section => {

        if(section.id!="dashboardPage"){
            section.style.display="none";
        }

    });

    await makineleriYukle();

    await dashboardYukle();
    planliBakimlariYukle();

};

async function dashboardYukle() {

    try {

        const response = await fetch(API + "?action=dashboardOzet");
        const sonuc = await response.json();
        const d = sonuc.data;

        document.getElementById("toplamMakine").innerText = d.toplamMakine;
        document.getElementById("toplamBakim").innerText = d.toplamBakim;
        document.getElementById("yaklasanBakim").innerText = d.yaklasanBakim;
        document.getElementById("gecikenBakim").innerText = d.gecikenBakim;

        await grafikYukle();
        await bolumGrafikYukle();
        await yaklasanBakimlariYukle();
        await sonBakimlariYukle();
        await enCokArizaVerenYukle();

    } catch (err) {

        console.error(err);

    }

}

async function grafikYukle() {

    try {

        const response = await fetch(API + "?action=dashboardGrafik");
        const sonuc = await response.json();

        console.log("API Sonucu:", sonuc);

        if (!sonuc.success) return;

        const labels = sonuc.data.map(x => x.gun);
        const values = sonuc.data.map(x => x.adet);

        const ctx = document.getElementById("bakimGrafik");

        console.log("Canvas:", ctx);
        console.log("Labels:", labels);
        console.log("Values:", values);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Bakım Sayısı",
                    data: values,
                    backgroundColor: "#2563eb"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    } catch (err) {

        console.error("Grafik Hatası:", err);

    }

}
async function bolumGrafikYukle() {

    const response = await fetch(API + "?action=dashboardBolumDagilim");
    const sonuc = await response.json();

    console.log("API:", sonuc);

    if (!sonuc.success) return;

    const labels = sonuc.data.map(x => x.konum);
    const values = sonuc.data.map(x => x.adet);

    console.log("Labels:", labels);
    console.log("Values:", values);

    const ctx = document.getElementById("bolumGrafik");

    console.log("Canvas:", ctx);

    new Chart(ctx, {

        type: "doughnut",

        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#dc2626",
                    "#8b5cf6"
                ]
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }

    });

}
async function yaklasanBakimlariYukle() {

    const response = await fetch(API + "?action=yaklasanBakimlar");
    const sonuc = await response.json();

    if (!sonuc.success) return;

    const alan = document.getElementById("yaklasanListe");

    alan.innerHTML = "";

    sonuc.data.forEach(item => {

        let renk = "#22c55e";
        let durum = item.kalan + " Gün";

        if(item.kalan <=7){
            renk="#f59e0b";
        }

        if(item.kalan<0){
            renk="#dc2626";
            durum=Math.abs(item.kalan)+" Gün Gecikti";
        }

        alan.innerHTML += `
        <div class="bakimKart">

            <div class="durum" style="background:${renk}"></div>

            <div class="bilgi">

                <strong>${item.envanter} - ${item.makine}</strong>

                <small>${item.konum}</small>

                <small>${item.tarih}</small>

            </div>

            <div class="kalan">

                ${durum}

            </div>

        </div>
        `;

    });

}
async function sonBakimlariYukle() {

    const response = await fetch(API + "?action=sonBakimlar");
    const sonuc = await response.json();

    if (!sonuc.success) return;

    const tbody = document.querySelector("#sonBakimlar tbody");

    tbody.innerHTML = "";

    sonuc.data.forEach(item => {

        tbody.innerHTML += `
            <tr>
                <td>${item.makine}</td>
                <td>${item.bakim}</td>
                <td>${item.yapan}</td>
                <td>${item.tarih}</td>
            </tr>
        `;

    });

}
async function enCokArizaVerenYukle() {

    const response = await fetch(API + "?action=enCokArizaVeren");
    const sonuc = await response.json();

    if (!sonuc.success) return;

    const alan = document.getElementById("arizaTop10");

    alan.innerHTML = "";

    sonuc.data.forEach((item, index) => {

       let renk = "#22c55e";

if(index==0) renk="#dc2626";
else if(index==1) renk="#f59e0b";
else if(index==2) renk="#eab308";

alan.innerHTML += `

<div class="arizaItem">

    <span>
        <i class="fa-solid fa-triangle-exclamation"
           style="color:${renk}; margin-right:8px;"></i>
        ${item.makine}
    </span>

    <strong>${item.adet}</strong>

</div>

`;

    });

}
async function makineleriYukle() {

    try {

        const response = await fetch(API + "?action=makineleriListele");
        const sonuc = await response.json();

        if (!sonuc.success) return;

        // Tüm makineleri hafızada tut
        tumMakineler = sonuc.data;

        // Kartları göster
      // Bölüm listesini oluştur
konumFiltresiniDoldur();

// Filtreleri uygula
filtreleriUygula();

    } catch (err) {

        console.error(err);

    }

}
function makineKartlariniGoster(veriler) {

    const liste = document.getElementById("makineListe");
    liste.innerHTML = "";

    veriler.forEach(item => {

        let durum = "Güncel";
        let renk = "#22c55e";

        const bugun = new Date();
        const sonraki = new Date(item.sonrakiBakim);

        const kalanGun = Math.ceil(
            (sonraki - bugun) / (1000 * 60 * 60 * 24)
        );

        if (kalanGun <= 7 && kalanGun >= 0) {
            durum = "Yaklaşıyor";
            renk = "#f59e0b";
        }

        if (kalanGun < 0) {
            durum = "Gecikmiş";
            renk = "#dc2626";
        }

        const tarih = new Date(item.sonrakiBakim)
            .toLocaleDateString("tr-TR");

        liste.innerHTML += `

        <div class="machine-card">

            <div class="machine-status"
                 style="background:${renk}"></div>

            <div class="machine-info">

                <h3>${item.envanter}</h3>

                <p>${item.marka} ${item.model}</p>

                <small>📍 ${item.konum}</small><br>

                <small>🗓 ${tarih}</small>

            </div>

            <div class="machine-badge">

                ${durum}

            </div>

        </div>

        `;

    });

}
function filtreleriUygula() {

    const aranan = document
        .getElementById("makineAra")
        .value
        .toLowerCase()
        .trim();

    const filtreli = tumMakineler.filter(item => {

        const metinUygun =
            item.envanter.toLowerCase().includes(aranan) ||
            item.marka.toLowerCase().includes(aranan) ||
            item.model.toLowerCase().includes(aranan) ||
            item.konum.toLowerCase().includes(aranan);

        const bugun = new Date();
        const sonraki = new Date(item.sonrakiBakim);
        const kalan = Math.ceil((sonraki - bugun) / (1000 * 60 * 60 * 24));

       let durum = "guncel";

if (kalan <= 7 && kalan >= 0) durum = "yaklasan";
if (kalan < 0) durum = "geciken";

        const konumUygun =
            aktifKonum === "" || item.konum === aktifKonum;

        const durumUygun =
            aktifDurum === "" || durum === aktifDurum;

        return metinUygun && konumUygun && durumUygun;

    });

    makineKartlariniGoster(filtreli);

}
function konumFiltresiniDoldur() {

    const select = document.getElementById("konumFiltre");

    select.innerHTML = '<option value="">Tüm Bölümler</option>';

    const konumlar = [...new Set(tumMakineler.map(x => x.konum))];

    konumlar.sort().forEach(konum => {

        select.innerHTML += `
            <option value="${konum}">
                ${konum}
            </option>
        `;

    });

}

// =============================
// SPA Menü Yönetimi
// =============================
document.querySelectorAll(".sidebar li").forEach(item => {

    item.addEventListener("click", function () {

        // Aktif menü
        document.querySelectorAll(".sidebar li").forEach(li => {
            li.classList.remove("active");
        });

        this.classList.add("active");

        // Sayfaları gizle
        document.querySelectorAll("section").forEach(section => {
            section.style.display = "none";
        });

        // İlgili sayfayı göster
        const page = this.dataset.page;

        if (page) {

    const pageElement = document.getElementById(page);

    if (pageElement) {
        pageElement.style.display = "block";
    }

    // Sayfaya özel işlemler
    switch (page) {

    case "dashboardPage":
        dashboardYukle();
        break;

    case "machinesPage":
        makineleriYukle();
        break;

    case "newMaintenancePage":
        break;

    case "historyPage":
        bakimGecmisiYukle();
        break;
case "partsPage":
    parcalariYukle();
    break;
    case "settingsPage":
    kullanicilariYukle();
    break;        
}

}

    });

});

// =============================
// Makine Arama
// =============================
const aramaKutusu = document.getElementById("makineAra");

if (aramaKutusu) {

    aramaKutusu.addEventListener("input", function () {

    filtreleriUygula();

});

}
const konumFiltre = document.getElementById("konumFiltre");

if (konumFiltre) {

    konumFiltre.addEventListener("change", function () {

        aktifKonum = this.value;

        filtreleriUygula();

    });

}
const durumFiltre = document.getElementById("durumFiltre");

if (durumFiltre) {

    durumFiltre.addEventListener("change", function () {

        aktifDurum = this.value;

        filtreleriUygula();

    });

}
function modalAc() {

    document.getElementById("makineModal").style.display = "block";

    bakimPeriyotlariniYeniMakineyeYukle();
    konumlariYeniMakineyeYukle();

    const tarihInput = document.getElementById("sonBakim");

    if (tarihInput) {
        const bugun = new Date();

        const yil = bugun.getFullYear();
        const ay = String(bugun.getMonth() + 1).padStart(2, "0");
        const gun = String(bugun.getDate()).padStart(2, "0");

        tarihInput.value = `${yil}-${ay}-${gun}`;
    }

}

function modalKapat() {

    document.getElementById("makineModal").style.display = "none";

}
function envanterImportAc() {
    document.getElementById("envanterImportModal").style.display = "block";
}

function envanterImportKapat() {
    document.getElementById("envanterImportModal").style.display = "none";
}
// Modal dışına tıklayınca kapansın
window.onclick = function (event) {

    const modal = document.getElementById("makineModal");

    if (event.target === modal) {

        modalKapat();

    }

}
async function yeniMakineKaydet() {

    const envanter = document.getElementById("envanter").value.trim();
    const marka = document.getElementById("marka").value.trim();
    const model = document.getElementById("model").value.trim();
    const sase = document.getElementById("sase").value.trim();
    const konum = document.getElementById("konum").value.trim();
    const periyot = document.getElementById("periyot").value;
    const sonBakim =
    document.getElementById("sonBakim").value;
    const aciklama = document.getElementById("aciklama").value.trim();

    if (!envanter || !marka || !model || !konum) {

        alert("Lütfen zorunlu alanları doldurun.");
        return;

    }

    try {

        const url =
            API +
            "?action=makineEkle" +
            "&envanter=" + encodeURIComponent(envanter) +
            "&marka=" + encodeURIComponent(marka) +
            "&model=" + encodeURIComponent(model) +
            "&konum=" + encodeURIComponent(konum) +
            "&sase=" + encodeURIComponent(sase) +
            "&periyot=" + encodeURIComponent(periyot) +
            "&sonBakim=" + encodeURIComponent(sonBakim)
            "&aciklama=" + encodeURIComponent(aciklama);

        const response = await fetch(url);

        const sonuc = await response.json();

        if (sonuc.success) {

            alert("Makine başarıyla eklendi.");

            modalKapat();

            document.getElementById("envanter").value = "";
            document.getElementById("marka").value = "";
            document.getElementById("model").value = "";
            document.getElementById("sase").value = "";
            document.getElementById("konum").value = "";
            document.getElementById("periyot").value = "";
            document.getElementById("aciklama").value = "";

            await makineleriYukle();

        } else {

            alert(sonuc.message);

        }

    } catch (err) {

        console.error(err);
        alert("Kayıt sırasında hata oluştu.");

    }

}
async function bakimMakineBul() {

    const envanter = document
        .getElementById("bakimMakineAra")
        .value
        .trim();

    if (!envanter) {

        alert("Envanter kodu giriniz.");
        return;

    }

    try {

        const response = await fetch(

            API + "?action=makineGetir&envanter=" + encodeURIComponent(envanter)

        );

        const sonuc = await response.json();

        if (!sonuc.success) {

            document.getElementById("bakimMakineBilgi").innerHTML = `
                <h3>Makine Bilgileri</h3>
                <p>Makine bulunamadı.</p>
            `;
            return;

        }

        const m = sonuc.data;
        secilenMakine = m;
const sonBakim = m.SonBakim
    ? new Date(m.SonBakim).toLocaleDateString("tr-TR")
    : "-";

const sonrakiBakim = m.SonrakiBakim
    ? new Date(m.SonrakiBakim).toLocaleDateString("tr-TR")
    : "-";
        document.getElementById("bakimMakineBilgi").innerHTML = `

            <h3>${m.EnvanterKodu}</h3>

            <p><strong>${m.Marka} ${m.Model}</strong></p>

            <p>📍 ${m.Konum}</p>

           <p>🛠 Son Bakım : ${sonBakim}</p>

<p>📅 Sonraki Bakım : ${sonrakiBakim}</p>

            <p>⏱ Periyot : ${m.BakimPeriyotGun} Gün</p>

        `;
        if (window.secilenAriza) {

    document.getElementById("bakimAciklama").value =
        "ARIZA BİLDİRİMİ\n\n" + secilenAriza.aciklama;

}

    }

    catch(err){

        console.error(err);

        alert("Makine okunamadı.");

    }

}

async function bakimKaydet() {

    const bilgi = document.getElementById("bakimMakineBilgi");

    if (!bilgi || bilgi.innerHTML.includes("Henüz")) {
        alert("Önce makine seçiniz.");
        return;
    }

    const envanterElement = bilgi.querySelector("h3");

    if (!envanterElement) {
        alert("Makine bilgisi alınamadı.");
        return;
    }

    const envanter = envanterElement.innerText.trim();

    const bakimTuru =
        document.getElementById("bakimTipi").value;

    const bakimiYapan = "Hakan Çağatay";

    const arizaNedeni =
        document.getElementById("arizaNedeni").value.trim();

    const degisenParcalar =
        document.getElementById("degisenParcalar").value.trim();

    const aciklama =
        document.getElementById("bakimAciklama").value.trim();


    // ==========================================
    // AKTİF ARIZA
    // ==========================================

    const aktifAriza =
        window.secilenAriza ||
        secilenAriza ||
        null;


    console.log(
        "BAKIM KAYDI - AKTİF ARIZA:",
        aktifAriza
    );


    // ==========================================
    // BAKIM VERİSİ
    // ==========================================

    const veri = {

        action: "bakimKaydet",

        envanterKodu: envanter,

        bakimTuru: bakimTuru,

        bakimiYapan: bakimiYapan,

        arizaNedeni: arizaNedeni,

        degisenParcalar: degisenParcalar,

        // Bakım ekranındaki gerçek yapılan iş / çözüm
        aciklama: aciklama,

        // ARIZALAR → Çözüm sütununa gidecek
        cozum: aciklama,

        parcalar: JSON.stringify(
            secilenParcalar || []
        )

    };


    try {

        // ==========================================
        // API URL
        // ==========================================

        let url =
            API +
            "?action=bakimKaydet" +

            "&envanterKodu=" +
            encodeURIComponent(
                veri.envanterKodu
            ) +

            "&bakimTuru=" +
            encodeURIComponent(
                veri.bakimTuru
            ) +

            "&bakimiYapan=" +
            encodeURIComponent(
                veri.bakimiYapan
            ) +

            "&arizaNedeni=" +
            encodeURIComponent(
                veri.arizaNedeni
            ) +

            "&degisenParcalar=" +
            encodeURIComponent(
                veri.degisenParcalar
            ) +

            "&aciklama=" +
            encodeURIComponent(
                veri.aciklama
            ) +

            "&cozum=" +
            encodeURIComponent(
                veri.cozum
            ) +

            "&parcalar=" +
            encodeURIComponent(
                veri.parcalar
            );


        // ==========================================
        // ARIZADAN GELDİYSE ARIZA ID'SİNİ GÖNDER
        // ==========================================

        if (
            aktifAriza &&
            aktifAriza.id
        ) {

            url +=
                "&arizaId=" +
                encodeURIComponent(
                    aktifAriza.id
                );

        }


        console.log(
            "BAKIM KAYIT URL:",
            url
        );


        // ==========================================
        // API ÇAĞRISI
        // ==========================================

        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        console.log(
            "BAKIM KAYIT SONUCU:",
            sonuc
        );


        // ==========================================
        // HATA KONTROLÜ
        // ==========================================

        if (!sonuc.success) {

            alert(
                sonuc.message ||
                "Bakım kaydedilemedi."
            );

            return;

        }


        // ==========================================
        // BAŞARILI
        // ==========================================

        alert(
            "✅ Bakım başarıyla kaydedildi."
        );


        // ==========================================
        // FORMU TEMİZLE
        // ==========================================

        document
            .getElementById("bakimAciklama")
            .value = "";

        document
            .getElementById("degisenParcalar")
            .value = "";

        document
            .getElementById("arizaNedeni")
            .value = "";

        document
            .getElementById("bakimTipi")
            .selectedIndex = 0;


        // ==========================================
        // AKTİF ARIZA BİLGİSİNİ TEMİZLE
        // ==========================================

        secilenAriza = null;
        window.secilenAriza = null;


        // ==========================================
        // PLANLI BAKIMDAN GELDİYSE
        // ==========================================

        if (planliBakimdanGelindi) {

            planliBakimdanGelindi = false;


            document
                .querySelectorAll("section")
                .forEach(s => {

                    s.style.display = "none";

                });


            document
                .getElementById("plannedPage")
                .style.display = "block";


            document
                .querySelectorAll(".sidebar li")
                .forEach(li => {

                    li.classList.remove("active");

                });


            document
                .querySelector(
                    '[data-page="plannedPage"]'
                )
                ?.classList.add("active");


            return;

        }


        // ==========================================
        // ARIZA BAKIMINDAN GELDİYSE
        // ARIZALAR SAYFASINA GERİ DÖN
        // ==========================================

        if (
            bakimTuru === "Arıza Bakımı" ||
            aktifAriza
        ) {

            document
                .querySelectorAll("section")
                .forEach(s => {

                    s.style.display = "none";

                });


            document
                .getElementById("faultPage")
                .style.display = "block";


            document
                .querySelectorAll(".sidebar li")
                .forEach(li => {

                    li.classList.remove("active");

                });


            document
                .getElementById("menuFault")
                ?.classList.add("active");


            // Arıza listesini yenile
            if (
                typeof arizalariYukle === "function"
            ) {

                await arizalariYukle();

            }

        }

    }

    catch (err) {

        console.error(
            "Bakım kaydetme hatası:",
            err
        );


        alert(
            "Bakım kaydedilirken bağlantı hatası oluştu."
        );

    }

}
function qrBaslat(){

    document.getElementById("qrReader").style.display="block";

    const html5QrCode=new Html5Qrcode("qrReader");

    html5QrCode.start(

        { facingMode:"environment" },

        {
            fps:10,
            qrbox:250
        },

        function(decodedText){

            html5QrCode.stop();

            document.getElementById("qrReader").style.display="none";

            document.getElementById("bakimMakineAra").value=decodedText;

            bakimMakineBul();

        }

    );

}
function barTenderExport() {
console.log(tumMakineler);
    const veri = tumMakineler.map(m => ({

        Envanter: m.envanter,

        MakineAdi: (m.marka || "") + " " + (m.model || ""),

        SaseNo: m.saseNo || "",

        QR: m.envanter

    }));

    const ws = XLSX.utils.json_to_sheet(veri);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "QR");

    XLSX.writeFile(wb, "BakimPro_QR.xlsx");

}
async function bakimGecmisiYukle() {

    const tbody = document.querySelector("#bakimGecmisTablo tbody");

    if (!tbody) {
        console.error("bakimGecmisTablo tbody bulunamadı!");
        return;
    }

    tbody.innerHTML = "<tr><td colspan='5'>Yükleniyor...</td></tr>";

    try {

        const r = await fetch(API + "?action=tumBakimlariGetir");

        const sonuc = await r.json();
        tumBakimlar = sonuc.data;

        console.log("API Sonucu:", sonuc);

        if (!sonuc.success) {

            tbody.innerHTML =
                "<tr><td colspan='5'>Kayıt bulunamadı.</td></tr>";

            return;

        }

        console.log("Kayıt Sayısı:", sonuc.data.length);

        filtreliBakimlariGoster(tumBakimlar);

    } catch (err) {

        console.error("Bakım Geçmişi Hatası:", err);

        tbody.innerHTML =
            "<tr><td colspan='5'>Hata oluştu.</td></tr>";

    }

}
function formatTarih(tarih){

    if(!tarih) return "-";

    return new Date(tarih).toLocaleDateString("tr-TR");

}
function filtreliBakimlariGoster(liste){

    const tbody = document.querySelector("#bakimGecmisTablo tbody");

    const ara =
        document.getElementById("gecmisAra").value.toLowerCase().trim();

    const tur =
        document.getElementById("gecmisBakimTuru").value;

    tbody.innerHTML = "";

    const filtreli = liste.filter(k => {

        const araUygun =
            !ara ||
            k.EnvanterKodu.toLowerCase().includes(ara);

        const turUygun =
            !tur ||
            k.BakimTuru === tur;

        return araUygun && turUygun;

    });

    if(filtreli.length===0){

        tbody.innerHTML =
        "<tr><td colspan='5'>Kayıt bulunamadı.</td></tr>";

        return;

    }

    filtreli.forEach(k=>{

        tbody.innerHTML += `
<tr onclick='detayGoster(${JSON.stringify(k).replace(/'/g,"&#39;")})'>

    <td>${formatTarih(k.BakimTarihi)}</td>
    <td>${k.EnvanterKodu}</td>
    <td>${k.BakimTuru}</td>
    <td>${k.BakimiYapan}</td>
    <td>${k.Durum}</td>

</tr>
`;

    });

}
document.getElementById("gecmisAra")
?.addEventListener("input",()=>{

    filtreliBakimlariGoster(tumBakimlar);

});

document.getElementById("gecmisBakimTuru")
?.addEventListener("change",()=>{

    filtreliBakimlariGoster(tumBakimlar);

});
async function detayGoster(k){
     if(tumMakineler.length===0){

        await makineleriYukle();

    }

    document.getElementById("bakimDetay").classList.add("active");

    document.getElementById("bakimDetayIcerik").innerHTML = `

<div class="detayKart">

<h3>🏷 Makine</h3>

<p>

<b>${k.EnvanterKodu}</b><br>

${makineAdiBul(k.EnvanterKodu)}

</p>

</div>

<div class="detayKart">

<h3>📅 Bakım Tarihi</h3>

<p>${formatTarih(k.BakimTarihi)}</p>

</div>

<div class="detayKart">

<h3>🔧 Bakım Türü</h3>

<p>${k.BakimTuru}</p>

</div>

<div class="detayKart">

<h3>👤 Bakımı Yapan</h3>

<p>${k.BakimiYapan || "-"}</p>

</div>

<div class="detayKart">

<h3>⚠ Arıza Nedeni</h3>

<p>${k.ArizaNedeni || "-"}</p>

</div>

<div class="detayKart">

<h3>🔩 Değişen Parçalar</h3>

<p>${k.DegisenParcalar || "-"}</p>

</div>

<div class="detayKart">

<h3>📝 Yapılan İşlem</h3>

<p>${k.Aciklama || "-"}</p>

</div>

<div class="detayKart">

<h3>✅ Durum</h3>

<p>${k.Durum}</p>

</div>

`;

}

function detayKapat(){

    console.log("KAPAT ÇALIŞTI");

    document.getElementById("bakimDetay").classList.remove("active");

}
function makineAdiBul(envanter){

    const m = tumMakineler.find(x => x.envanter == envanter);

    if(!m) return "";

    return `${m.marka} ${m.model}`;

}
async function bakimPeriyotlariniYeniMakineyeYukle() {

    const select = document.getElementById("periyot");

    if (!select) return;

    try {

        const response =
            await fetch(API + "?action=bakimPeriyotlariListele");

        const sonuc =
            await response.json();

        if (!sonuc.success) {

            select.innerHTML =
                '<option value="">Periyotlar yüklenemedi</option>';

            return;
        }

        const periyotlar =
            (sonuc.data || []).filter(
                p => p.durum === "Aktif"
            );

        select.innerHTML =
            '<option value="">Periyot seçiniz</option>';

        periyotlar.forEach(p => {

            select.innerHTML += `
                <option value="${p.gun}">
                    ${p.periyotAdi} (${p.gun} gün)
                </option>
            `;

        });

    } catch (err) {

        console.error(
            "Bakım periyotları yüklenemedi:",
            err
        );

        select.innerHTML =
            '<option value="">Periyotlar yüklenemedi</option>';
    }
}
async function konumlariYeniMakineyeYukle() {

    const select = document.getElementById("konum");

    if (!select) return;

    select.innerHTML =
        '<option value="">Konumlar yükleniyor...</option>';

    try {

        const response =
            await fetch(
                API + "?action=konumlariListele"
            );

        const sonuc =
            await response.json();

        if (!sonuc.success) {

            select.innerHTML =
                '<option value="">Konumlar yüklenemedi</option>';

            return;
        }

        const konumlar =
            (sonuc.data || []).filter(
                k => k.durum === "Aktif"
            );

        select.innerHTML =
            '<option value="">Konum seçiniz</option>';

        konumlar.forEach(function(konum) {

    select.innerHTML += `
        <option value="${konum.konum}">
            ${konum.konum}
        </option>
    `;

});

    } catch (err) {

        console.error(
            "Konumlar yüklenemedi:",
            err
        );

        select.innerHTML =
            '<option value="">Konumlar yüklenemedi</option>';
    }
}
