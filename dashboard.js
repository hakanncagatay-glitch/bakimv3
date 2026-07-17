const API = "https://script.google.com/macros/s/AKfycbyp4Dexvk759RdZEEdAIS-urDlkJR9-r39_r_gb1w13eidoSpePkYX-6sUBYYZRdCu6ng/exec";

window.onload = dashboardYukle;

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
// Sayfa göster
function showPage(pageId) {

    // Tüm sayfaları gizle
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

    // Seçilen sayfayı göster
    document.getElementById(pageId).style.display = "block";

}
// Menü olayları
document.getElementById("menuDashboard").addEventListener("click", function () {
    showPage("dashboardPage");
});

document.getElementById("menuMachines").addEventListener("click", function () {
    showPage("machinesPage");
});
