// ==========================
// ARIZALAR
// ==========================
let aktifFaultKonum = "";
let aktifFaultDurum = "";
let tumArizalar = [

    {
        id:1,
        envanter:"A4",
        marka:"BROTHER",
        model:"SDF",
        konum:"HAT-2",
        aciklama:"Makine çalışmıyor.",
        bildiren:"Ahmet",
        durum:"acik",
        bekleme:"45 dk"
    },

    {
        id:2,
        envanter:"A8",
        marka:"JUKI",
        model:"DDL8700",
        konum:"HAT-4",
        aciklama:"İplik koparıyor.",
        bildiren:"Mehmet",
        durum:"mudahale",
        bekleme:"12 dk"
    },

    {
        id:3,
        envanter:"A12",
        marka:"YUKI",
        model:"YK5214",
        konum:"HAT-1",
        aciklama:"Ses yapıyor.",
        bildiren:"Ali",
        durum:"kapali",
        bekleme:"Tamamlandı"
    }

];

function arizalariYukle(){

    const alan=document.getElementById("faultList");

    if(!alan) return;

    alan.innerHTML="";

    tumArizalar.forEach(a=>{

        alan.innerHTML+=arizaSatiri(a);

    });

    document.getElementById("faultOpen").innerText=
        tumArizalar.filter(x=>x.durum=="acik").length;

    document.getElementById("faultProgress").innerText=
        tumArizalar.filter(x=>x.durum=="mudahale").length;

    document.getElementById("faultClosed").innerText=
        tumArizalar.filter(x=>x.durum=="kapali").length;

    document.getElementById("faultAvg").innerText="18 dk";

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

<div>

${a.bekleme}

</div>

<div
style="
margin-top:15px;
display:flex;
gap:10px;
justify-content:flex-end;
">

<button class="btn-secondary">

Detay

</button>

<button class="btn-primary">

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
