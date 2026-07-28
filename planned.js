// ==========================
// PLANLI BAKIMLAR
// ==========================

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

        sonuc.data.forEach(k=>{

            alan.innerHTML += planliKartOlustur(k);

        });

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

                <button class="btn-secondary">

                    Detay

                </button>

                <button class="btn-primary">

                    Bakıma Başla

                </button>

            </div>

        </div>

    `;

}
document.addEventListener("DOMContentLoaded", () => {

    planliBakimlariYukle();

});
