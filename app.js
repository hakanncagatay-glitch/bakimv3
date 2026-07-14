const API = "https://script.google.com/macros/s/AKfycbyp4Dexvk759RdZEEdAIS-urDlkJR9-r39_r_gb1w13eidoSpePkYX-6sUBYYZRdCu6ng/exec";

const btnAra = document.getElementById("btnAra");

btnAra.addEventListener("click", makineAra);

async function makineAra() {

    const envanter = document.getElementById("envanter").value.trim();
    const sase = document.getElementById("sase").value.trim();

    if (envanter === "" && sase === "") {

        alert("Envanter veya Şase No giriniz.");
        return;

    }

    try {

        const url =
            API +
            "?action=makineGetir" +
            "&envanter=" + encodeURIComponent(envanter) +
            "&sase=" + encodeURIComponent(sase);

        const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    mode: "cors"
});

        const sonuc = await response.json();

        if (!sonuc.success) {

            alert(sonuc.message);
            return;

        }

        const m = sonuc.data;

        document.getElementById("makineKart").style.display = "block";

        document.getElementById("lblEnvanter").innerText = m.EnvanterKodu;
        document.getElementById("lblMarka").innerText = m.Marka;
        document.getElementById("lblModel").innerText = m.Model;
        document.getElementById("lblKonum").innerText = m.Konum;
        document.getElementById("lblPeriyot").innerText = m.BakimPeriyotGun + " Gün";
        document.getElementById("lblSonBakim").innerText = m.SonBakim || "-";
        document.getElementById("lblSonrakiBakim").innerText = m.SonrakiBakim || "-";

    }
 catch (err) {

    console.error(err);

    alert(err.message);

}

}
