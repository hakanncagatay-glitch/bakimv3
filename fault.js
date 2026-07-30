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

        </div>

        <hr>

        <h4>📝 Arıza Açıklaması</h4>

        <p>${a.aciklama}</p>

        <hr>

        <h4>🔧 Çözüm</h4>

        <p>${a.cozum || "-"}</p>

        <br>

        <button
            class="btn-primary"
            onclick="faultMudahale('${a.id}')">

            🛠 Müdahale Et

        </button>

    `;

   document.getElementById("bakimDetay").classList.add("active");

}
function faultMudahale(id){

    detayKapat();

    const a = tumArizalar.find(x => x.id == id);

    if(!a) return;

    secilenAriza = a;

    // Sayfaları gizle
    document.querySelectorAll("section").forEach(section=>{
        section.style.display="none";
    });

    // Yeni Bakım sayfasını aç
    document.getElementById("newMaintenancePage").style.display="block";

    // Menü
    document.querySelectorAll(".sidebar li")
        .forEach(li=>li.classList.remove("active"));

    document.getElementById("menuNewMaintenance")
        .classList.add("active");

  // Envanteri otomatik yaz
document.getElementById("bakimMakineAra").value = a.envanter;

// Sayfa açıldıktan sonra bilgileri yükle
setTimeout(async () => {

    await bakimMakineBul();

    document.getElementById("bakimTipi").value = "Arıza Bakımı";

}, 100);

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
function beklemeHesapla(tarih,saat){
    console.log(tarih, saat);

    if(!tarih || !saat) return "-";

    try{

        const p = tarih.split(".");
        const s = saat.split(":");

        const baslangic = new Date(

            Number(p[2]),
            Number(p[1])-1,
            Number(p[0]),
            Number(s[0]),
            Number(s[1])
        );

        const fark = Math.floor((new Date()-baslangic)/60000);

        if(fark<60)
            return fark+" dk";

        if(fark<1440)
            return Math.floor(fark/60)+" sa";

        return Math.floor(fark/1440)+" gün";

    }catch{

        return "-";

    }

}
function faultQrOku(){

    document.getElementById("qrReader").style.display = "block";

    const html5QrCode = new Html5Qrcode("qrReader");

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        function(decodedText){

            html5QrCode.stop().then(()=>{

                document.getElementById("qrReader").style.display="none";

                // QR değerini yaz
                document.getElementById("faultEnvanter").value = decodedText;

                // Makineyi otomatik getir
                faultMakineBul();

            });

        },

        function(errorMessage){
            // okumaya devam et
        }

    );

}
