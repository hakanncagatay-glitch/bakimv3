// ==========================
// YEDEK PARÇALAR
// ==========================

let tumParcalar = [];
let seciliParca = null;

async function parcalariYukle(){

    const alan = document.getElementById("partsList");

    if(!alan) return;

    alan.innerHTML = "Yükleniyor...";

    try{

        const response = await fetch(API + "?action=parcaListele");

        const sonuc = await response.json();

        if(!sonuc.success){

            alan.innerHTML = "Parça bulunamadı.";

            return;

        }

        tumParcalar = sonuc.data;

        alan.innerHTML = "";

        tumParcalar.forEach(p=>{

            alan.innerHTML += parcaKarti(p);

        });

        document.getElementById("partCount").innerText =
            tumParcalar.length;

        document.getElementById("criticalCount").innerText =
            tumParcalar.filter(x=>x.stok<=x.min).length;

        document.getElementById("totalStock").innerText =
            tumParcalar.reduce((t,p)=>t+p.stok,0);

        document.getElementById("totalValue").innerText =
            tumParcalar
            .reduce((t,p)=>t+(p.stok*p.fiyat),0)
            .toLocaleString("tr-TR")+" ₺";

    }

    catch(err){

        console.error(err);

        alan.innerHTML = "Veriler alınamadı.";

    }

}
// ==========================
// PARÇA FİLTRELE
// ==========================

function parcaFiltrele(){

    const q = document
        .getElementById("partSearch")
        .value
        .toLowerCase()
        .trim();

    const alan = document.getElementById("partsList");

    const filtre = tumParcalar.filter(p =>

        (p.ad || "").toLowerCase().includes(q) ||
        (p.kod || "").toLowerCase().includes(q) ||
        (p.marka || "").toLowerCase().includes(q)

    );

    console.log("Aranan :", q);
    console.log("Bulunan :", filtre.length);

    alan.innerHTML = "";

    filtre.forEach(p => {

        alan.innerHTML += parcaKarti(p);

    });

}

function parcaKarti(p){

    let renk = "#22c55e";
    let durum = "Normal";

    if(p.stok <= p.min){

        renk = "#ef4444";
        durum = "Kritik";

    }
    else if(p.stok <= p.min*2){

        renk = "#f59e0b";
        durum = "Azalıyor";

    }

    return `

<div class="part-card"
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

<h3>${p.ad}</h3>

<p>📦 ${p.kod}</p>

<p>📍 ${p.konum}</p>

<small>

${p.marka}

</small>

</div>

<div style="text-align:right;">

<div
style="
font-weight:bold;
color:${renk};
">

${durum}

</div>

<h2>

${p.stok}

</h2>

<small>

Min : ${p.min}

</small>

<br><br>

<button
class="btn-secondary"
onclick="parcaDetay('${p.kod}')">

Detay

</button>

</div>

</div>

`;

}

document.addEventListener("DOMContentLoaded", () => {

    parcalariYukle();

    const search = document.getElementById("partSearch");

    if (search) {

        search.addEventListener("input", parcaFiltrele);

    }

});
// ==========================
// FORM AÇ / KAPAT
// ==========================

function togglePartForm(){

    const form = document.getElementById("partForm");

    form.style.display =
        form.style.display=="none"
        ? "block"
        : "none";

}
// ==========================
// FORM TEMİZLE
// ==========================

function partFormTemizle(){

    document.getElementById("partName").value="";
    document.getElementById("partBrand").value="";
    document.getElementById("partLocation").value="";
    document.getElementById("partStock").value=0;
    document.getElementById("partMin").value=0;
    document.getElementById("partPrice").value="";
    document.getElementById("partNote").value="";

    document.getElementById("partCategory").selectedIndex=0;
    document.getElementById("partUnit").selectedIndex=0;

}
// ==========================
// PARÇA KAYDET
// ==========================

async function parcaKaydet(){

    const veri={

        parcaAdi:document.getElementById("partName").value,

        kategori:document.getElementById("partCategory").value,

        marka:document.getElementById("partBrand").value,

        konum:document.getElementById("partLocation").value,

        stok:document.getElementById("partStock").value,

        minStok:document.getElementById("partMin").value,

        birim:document.getElementById("partUnit").value,

        birimFiyat:document.getElementById("partPrice").value,

        aciklama:document.getElementById("partNote").value

    };

    if(veri.parcaAdi==""){

        alert("Parça adı zorunludur.");

        return;

    }

    try{

        const url =
        API+
        "?action=parcaEkle"+
        "&parcaAdi="+encodeURIComponent(veri.parcaAdi)+
        "&kategori="+encodeURIComponent(veri.kategori)+
        "&marka="+encodeURIComponent(veri.marka)+
        "&konum="+encodeURIComponent(veri.konum)+
        "&stok="+encodeURIComponent(veri.stok)+
        "&minStok="+encodeURIComponent(veri.minStok)+
        "&birim="+encodeURIComponent(veri.birim)+
        "&birimFiyat="+encodeURIComponent(veri.birimFiyat)+
        "&aciklama="+encodeURIComponent(veri.aciklama);

        const response=await fetch(url);

        const sonuc=await response.json();

        if(sonuc.success){

            alert("Parça başarıyla eklendi.");

            partFormTemizle();

            togglePartForm();

            parcalariYukle();

        }else{

            alert(sonuc.message);

        }

    }catch(err){

        console.error(err);

        alert("Kayıt sırasında hata oluştu.");

    }

}
// ==========================
// PARÇA DETAY
// ==========================

function parcaDetay(kod){

    const p = tumParcalar.find(x=>x.kod==kod);
    seciliParca=p;

    if(!p) return;

    document.getElementById("partModal").style.display="block";

    document.getElementById("partDetailContent").innerHTML=`

<div class="detayKart">

<h4>Parça Bilgisi</h4>

<p><b>${p.ad}</b></p>

<p>Kod : ${p.kod}</p>

<p>Kategori : ${p.kategori}</p>

<p>Marka : ${p.marka}</p>

</div>

<div class="detayKart">

<h4>Stok</h4>

<p>Stok : ${p.stok}</p>

<p>Minimum : ${p.min}</p>

<p>Birim : ${p.birim}</p>

</div>

<div class="detayKart">

<h4>Konum</h4>

<p>${p.konum}</p>

</div>

<div class="detayKart">

<h4>Maliyet</h4>

<p>Birim Fiyat :
<b>${Number(p.fiyat).toLocaleString("tr-TR")} ₺</b></p>

<p>Toplam Değer :
<b>${(p.stok*p.fiyat).toLocaleString("tr-TR")} ₺</b></p>

</div>

`;

}
function partModalKapat(){

    document.getElementById("partModal").style.display="none";

}
