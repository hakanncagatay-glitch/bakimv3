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

    if (!sonuc.success) return;

    const labels = sonuc.data.map(x => x.konum);
    const values = sonuc.data.map(x => x.adet);

    const ctx = document.getElementById("bolumGrafik");

    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: values

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false

        }

    });

}
