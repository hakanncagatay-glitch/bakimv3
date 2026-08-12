async function raporlariYukle(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporOzet" +
            "&baslangic=" + encodeURIComponent(baslangic) +
            "&bitis=" + encodeURIComponent(bitis);

        console.log("Rapor API:", url);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("Rapor sonucu:", sonuc);

        if(!sonuc.success){

            alert("Rapor verileri alınamadı.");

            return;

        }

        const r = sonuc.data;

        // ==========================
        // KPI
        // ==========================

        document.getElementById("rToplamBakim").innerText =
            r.toplamBakim;

        document.getElementById("rPlanli").innerText =
            "%" + r.planliOran;

        document.getElementById("rPlansiz").innerText =
            "%" + r.plansizOran;

        document.getElementById("rMttr").innerText =
            r.mttr + " dk";

        document.getElementById("rMtbf").innerText =
            r.mtbf + " saat";

        document.getElementById("rDurus").innerText =
            r.durusSuresi + " saat";

    }

    catch(err){

        console.error("Rapor hatası:", err);

        alert("Rapor oluşturulurken hata oluştu.");

    }

}
let raporGrafik = null;

async function raporGrafigiDegistir(){

    const tip =
        document.getElementById("reportChartType").value;

    if(tip !== "bakimSayisi"){

        console.log("Henüz hazırlanmadı:", tip);

        return;

    }

    await raporBakimGrafigiCiz();

}
