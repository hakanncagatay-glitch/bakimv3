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
        await raporBakimGrafigiCiz();

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

    if(tip === "bakimSayisi"){

        await raporBakimGrafigiCiz();

        return;

    }

    if(tip === "arizaSayisi"){

        await raporArizaGrafigiCiz();

        return;

    }

    if(tip === "planliPlansiz"){

        await raporPlanliPlansizGrafigiCiz();

        return;

    }

    console.log("Henüz hazırlanmadı:", tip);

}
async function raporBakimGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporBakimGrafigi" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("Bakım grafik verisi:", sonuc);

        if(!sonuc.success){

            console.error("Grafik verisi alınamadı.");

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.donem);

        const degerler =
            liste.map(x => x.adet);

        const canvas =
            document.getElementById("reportMainChart");

        if(!canvas) return;

        if(raporGrafik){

            raporGrafik.destroy();

        }

        raporGrafik = new Chart(canvas, {

            type:"line",

            data:{

                labels:etiketler,

                datasets:[{

                    label:"Bakım Sayısı",

                    data:degerler,

                    tension:0.3,

                    fill:false

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        display:true

                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{

                            precision:0

                        }

                    }

                }

            }

        });

        document.getElementById("reportChartTitle").innerText =
            "Aylara göre toplam bakım sayısı";

    }

    catch(err){

        console.error("Bakım grafik hatası:",err);

    }

}
async function raporArizaGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporArizaGrafigi" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("Arıza grafik verisi:", sonuc);

        if(!sonuc.success){

            console.error("Arıza grafik verisi alınamadı.");

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.donem);

        const degerler =
            liste.map(x => x.adet);

        const canvas =
            document.getElementById("reportMainChart");

        if(!canvas) return;

        if(raporGrafik){

            raporGrafik.destroy();

        }

        raporGrafik = new Chart(canvas, {

            type:"line",

            data:{

                labels:etiketler,

                datasets:[{

                    label:"Arıza Sayısı",

                    data:degerler,

                    tension:0.3,

                    fill:false

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{
                        display:true
                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{
                            precision:0
                        }

                    }

                }

            }

        });

        document.getElementById("reportChartTitle").innerText =
            "Aylara göre toplam arıza sayısı";

    }

    catch(err){

        console.error("Arıza grafik hatası:",err);

    }

}
async function raporPlanliPlansizGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporPlanliPlansizGrafigi" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("Planlı/Plansız grafik verisi:", sonuc);

        if(!sonuc.success){

            console.error(
                "Planlı/Plansız grafik verisi alınamadı."
            );

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.donem);

        const planli =
            liste.map(x => x.planli);

        const plansiz =
            liste.map(x => x.plansiz);

        const canvas =
            document.getElementById("reportMainChart");

        if(!canvas) return;

        if(raporGrafik){

            raporGrafik.destroy();

        }

        raporGrafik = new Chart(canvas, {

            type:"line",

            data:{

                labels:etiketler,

                datasets:[

                    {

                        label:"Planlı Bakım",

                        data:planli,

                        tension:0.3,

                        fill:false

                    },

                    {

                        label:"Plansız Bakım",

                        data:plansiz,

                        tension:0.3,

                        fill:false

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{
                        display:true
                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{
                            precision:0
                        }

                    }

                }

            }

        });

        document.getElementById("reportChartTitle").innerText =
            "Aylık planlı ve plansız bakım karşılaştırması";

    }

    catch(err){

        console.error(
            "Planlı/Plansız grafik hatası:",
            err
        );

    }

}
