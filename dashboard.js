alert("dashboard.js yüklendi");

const API = "https://script.google.com/macros/s/AKfycbyp4Dexvk759RdZEEdAIS-urDlkJR9-r39_r_gb1w13eidoSpePkYX-6sUBYYZRdCu6ng/exec";

window.onload = dashboardYukle;

async function dashboardYukle() {

    alert("dashboardYukle başladı");

    try {

        const response = await fetch(API + "?action=dashboardOzet");

        alert("HTTP: " + response.status);

        const sonuc = await response.json();

        alert(JSON.stringify(sonuc));

        const d = sonuc.data;

        document.getElementById("toplamMakine").innerText = d.toplamMakine;
        document.getElementById("toplamBakim").innerText = d.toplamBakim;
        document.getElementById("yaklasanBakim").innerText = d.yaklasanBakim;
        document.getElementById("gecikenBakim").innerText = d.gecikenBakim;

    } catch (err) {

        alert(err);
        console.error(err);

    }

}
