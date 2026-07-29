// ==========================
// OPERATÖR - ARIZA BİLDİR
// ==========================

async function faultMakineBul(){

    const envanter = document
        .getElementById("faultEnvanter")
        .value
        .trim();

    if(envanter=="") return;

    try{

        const response = await fetch(
            API + "?action=makineGetir&envanter=" +
            encodeURIComponent(envanter)
        );

        const sonuc = await response.json();

        if(!sonuc.success){

            document.getElementById("faultMakineBilgi").innerHTML =
                "<p>❌ Makine bulunamadı.</p>";

            return;

        }

        const m = sonuc.data;

        document.getElementById("faultHat").value = m.Konum;

        document.getElementById("faultMakineBilgi").innerHTML = `
            <h3>${m.EnvanterKodu}</h3>

            <p><strong>${m.Marka}</strong> ${m.Model}</p>

            <p>📍 ${m.Konum}</p>

            <p>⏱ ${m.BakimPeriyotGun} Gün</p>
        `;

    }
    catch(err){

        console.error(err);

        document.getElementById("faultMakineBilgi").innerHTML =
            "<p>❌ Veri alınamadı.</p>";

    }

}
