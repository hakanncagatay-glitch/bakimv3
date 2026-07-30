// ==========================
// YEDEK PARÇALAR
// ==========================

let tumParcalar = [];

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
class="btn-secondary">

Detay

</button>

</div>

</div>

`;

}

document.addEventListener("DOMContentLoaded",()=>{

    parcalariYukle();

});
