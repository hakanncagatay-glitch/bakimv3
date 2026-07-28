// ==========================
// PLANLI BAKIMLAR
// ==========================

const planliBakimlar = [

    {
        envanter:"A3",
        marka:"JUKI",
        model:"DDL8700",
        konum:"HAT-2",
        sonBakim:"28.03.2026",
        sonrakiBakim:"25.07.2026",
        periyot:120,
        durum:"geciken",
        kalan:-5
    },

    {
        envanter:"A5",
        marka:"YUKI",
        model:"YK5214",
        konum:"HAT-1",
        sonBakim:"01.04.2026",
        sonrakiBakim:"28.07.2026",
        periyot:120,
        durum:"bugun",
        kalan:0
    },

    {
        envanter:"A7",
        marka:"JUKI",
        model:"D9000",
        konum:"HAT-4",
        sonBakim:"05.04.2026",
        sonrakiBakim:"31.07.2026",
        periyot:120,
        durum:"yaklasan",
        kalan:3
    }

];
function planliBakimlariYukle(){

    const alan=document.getElementById("plannedCards");

    if(!alan) return;

    alan.innerHTML="";

    planliBakimlar.forEach(k=>{

        alan.innerHTML+=planliKartOlustur(k);

    });

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

            <p><strong>Son Bakım</strong><br>${k.sonBakim}</p>

            <p><strong>Planlanan</strong><br>${k.sonrakiBakim}</p>

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
