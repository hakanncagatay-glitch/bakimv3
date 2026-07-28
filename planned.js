// ==========================
// PLANLI BAKIMLAR
// ==========================
let tumPlanliBakimlar = [];
let aktifPlannedKonum = "";
function plannedKonumlariniDoldur(){

    const select = document.getElementById("plannedLocation");

    if(!select) return;

    select.innerHTML = '<option value="">Tüm Bölümler</option>';

    const konumlar = [...new Set(
        tumPlanliBakimlar.map(x => x.konum)
    )];

    konumlar.sort().forEach(k => {

        select.innerHTML += `
            <option value="${k}">
                ${k}
            </option>
        `;

    });

}
async function planliBakimlariYukle(){

    const alan = document.getElementById("plannedCards");

    if(!alan) return;

    alan.innerHTML = "Yükleniyor...";

    try{

        const response = await fetch(API + "?action=planliBakimlar");

        const sonuc = await response.json();

        console.log("Planlı Bakımlar:", sonuc);

        if(!sonuc.success){

            alan.innerHTML = "Kayıt bulunamadı.";

            return;

        }

        alan.innerHTML = "";

tumPlanliBakimlar = sonuc.data;

plannedKonumlariniDoldur();

planliKartlariGoster(tumPlanliBakimlar);

        document.getElementById("plannedOverdue").innerText =
            sonuc.data.filter(x=>x.durum=="geciken").length;

        document.getElementById("plannedToday").innerText =
            sonuc.data.filter(x=>x.durum=="bugun").length;

        document.getElementById("plannedUpcoming").innerText =
            sonuc.data.filter(x=>x.durum=="yaklasan").length;

    }
    catch(err){

        console.error(err);

        alan.innerHTML = "Veri alınamadı.";

    }

}

function planliKartOlustur(k){

    let renk = "#22c55e";
    let durum = "Yaklaşıyor";

    if(k.durum=="geciken"){

        renk="#ef4444";
        durum=`${Math.abs(k.kalan)} Gün Gecikti`;

    }

    else if(k.durum=="bugun"){

        renk="#f59e0b";
        durum="Bugün Yapılacak";

    }

    return `

        <div class="planned-card">

            <div style="height:6px;background:${renk};
                        margin:-20px -20px 18px;
                        border-radius:16px 16px 0 0;"></div>

            <div style="display:flex;
                        justify-content:space-between;
                        align-items:center;">

                <h3>${k.envanter}</h3>

                <span class="badge">${k.periyot} Gün</span>

            </div>

            <h4 style="margin:8px 0;">
                ${k.marka} ${k.model}
            </h4>

            <p>📍 ${k.konum}</p>

            <hr>

            <p><strong>Son Bakım</strong><br>${
    new Date(k.sonBakim).toLocaleDateString("tr-TR")
}</p>

<p><strong>Planlanan</strong><br>${
    new Date(k.sonrakiBakim).toLocaleDateString("tr-TR")
}</p>

            <div class="planned-status"
                 style="color:${renk};">

                 ${durum}

            </div>

            <div class="planned-actions">

    <button
        class="btn-secondary"
        onclick="planliDetay('${k.envanter}')">

        Detay

    </button>

    <button
        class="btn-primary"
        onclick="planliBakimBaslat('${k.envanter}')">

        Bakıma Başla

    </button>

</div>

            </div>

        </div>

    `;

}
function planliKartlariGoster(liste){

    const alan = document.getElementById("plannedCards");

    alan.innerHTML="";

    liste.forEach(k=>{

        alan.innerHTML += planliKartOlustur(k);

    });

}
function planliFiltrele(){

    const ara = document
        .getElementById("plannedSearch")
        .value
        .toLowerCase()
        .trim();

   const filtreli = tumPlanliBakimlar.filter(k => {

    const aramaUygun =
        k.envanter.toLowerCase().includes(ara) ||
        k.marka.toLowerCase().includes(ara) ||
        k.model.toLowerCase().includes(ara) ||
        k.konum.toLowerCase().includes(ara);

    const konumUygun =
        aktifPlannedKonum === "" ||
        k.konum === aktifPlannedKonum;

    return aramaUygun && konumUygun;

});

    planliKartlariGoster(filtreli);

}
document.addEventListener("DOMContentLoaded", () => {

    planliBakimlariYukle();

});
async function planliBakimBaslat(envanter){

    // Tüm sayfaları gizle
    document.querySelectorAll("section").forEach(section=>{
        section.style.display="none";
    });

    // Yeni Bakım sayfasını aç
    document.getElementById("newMaintenancePage").style.display="block";

    // Sidebar aktif menü
    document.querySelectorAll(".sidebar li").forEach(li=>{
        li.classList.remove("active");
    });

    document
        .querySelector('[data-page="newMaintenancePage"]')
        ?.classList.add("active");

    // Envanter kodunu doldur
    document.getElementById("bakimMakineAra").value = envanter;

    // Makine bilgilerini otomatik getir
    await bakimMakineBul();

}
