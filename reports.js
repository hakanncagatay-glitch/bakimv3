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
        await raporArizaTipiParetoCiz();
        await raporIyilestirmeAlanlariYukle();
        await raporYoneticiOzetiYukle(r);

    }

    catch(err){

        console.error("Rapor hatası:", err);

        alert("Rapor oluşturulurken hata oluştu.");

    }

}
let raporGrafik = null;
let paretoGrafik = null;

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


    if(tip === "mttr"){
        await raporMttrGrafigiCiz();
        return;
    }


    if(tip === "mtbf"){
        await raporMtbfGrafigiCiz();
        return;
    }


    if(tip === "durus"){
        await raporDurusGrafigiCiz();
        return;
    }


    // ==========================
    // ARIZA TİPİ PARETO
    // ==========================

    if(tip === "arizaTipi"){
        await raporArizaTipiParetoCiz();
        return;
    }


    // ==========================
    // HAT
    // ==========================

    if(tip === "hatAriza"){
        await raporHatArizaGrafigiCiz();
        return;
    }


    // ==========================
    // MAKİNE MODELİ
    // ==========================

    if(tip === "makineTipi"){
        await raporModelArizaGrafigiCiz();
        return;
    }


    // ==========================
    // MARKA
    // ==========================

    if(tip === "marka"){
        await raporMarkaArizaGrafigiCiz();
        return;
    }


    // ==========================
    // PARÇA
    // ==========================

    if(tip === "parca"){

    await raporParcaKullanimiGrafigiCiz();

    return;

}

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
async function raporMttrGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporMttrGrafigi" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("MTTR grafik verisi:", sonuc);

        if(!sonuc.success){

            console.error("MTTR verisi alınamadı.");

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.donem);

        const degerler =
            liste.map(x => x.mttr);

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

                    label:"MTTR (dk)",

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

                        title:{

                            display:true,

                            text:"Dakika"

                        }

                    }

                }

            }

        });

        document.getElementById("reportChartTitle").innerText =
            "Aylık ortalama tamir süresi (MTTR)";

    }

    catch(err){

        console.error(
            "MTTR grafik hatası:",
            err
        );

    }

}
async function raporDurusGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporDurusGrafigi" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("Duruş grafik verisi:", sonuc);

        if(!sonuc.success){

            console.error("Duruş verisi alınamadı.");

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.donem);

        const degerler =
            liste.map(x => x.durusSaat);

        const canvas =
            document.getElementById("reportMainChart");

        if(!canvas) return;

        if(raporGrafik){

            raporGrafik.destroy();

        }

        raporGrafik = new Chart(canvas, {

            type:"bar",

            data:{

                labels:etiketler,

                datasets:[{

                    label:"Duruş Süresi (saat)",

                    data:degerler,

                    tension:0.3

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

                        title:{

                            display:true,

                            text:"Saat"

                        }

                    }

                }

            }

        });

        document.getElementById("reportChartTitle").innerText =
            "Aylık toplam arıza duruş süresi";

    }

    catch(err){

        console.error(
            "Duruş grafik hatası:",
            err
        );

    }

}
async function raporMtbfGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporMtbfGrafigi" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("MTBF grafik verisi:", sonuc);

        if(!sonuc.success){

            console.error("MTBF verisi alınamadı.");

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.donem);

        const degerler =
            liste.map(x => x.mtbf);

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

                    label:"MTBF (saat)",

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

                        title:{

                            display:true,

                            text:"Saat"

                        }

                    }

                }

            }

        });

        document.getElementById("reportChartTitle").innerText =
            "En az 2 arızası bulunan makinelerin aylık MTBF değeri";

    }

    catch(err){

        console.error(
            "MTBF grafik hatası:",
            err
        );

    }
}
async function raporArizaTipiParetoCiz(){

    try{

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;

        const url =
            API +
            "?action=raporArizaTipiPareto" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);

        const response = await fetch(url);

        const sonuc = await response.json();

        console.log("Arıza tipi Pareto:", sonuc);

        if(!sonuc.success){

            console.error("Pareto verisi alınamadı.");

            return;

        }

        const liste = sonuc.data;

        const etiketler =
            liste.map(x => x.tip);

        const adetler =
            liste.map(x => x.adet);

        const kumulatif =
            liste.map(x => x.kumulatif);

        const canvas =
            document.getElementById("paretoChart");

        if(!canvas) return;

        if(paretoGrafik){

            paretoGrafik.destroy();

        }

        paretoGrafik = new Chart(canvas, {

            data:{

                labels:etiketler,

                datasets:[

                    {

                        type:"bar",

                        label:"Arıza Sayısı",

                        data:adetler,

                        yAxisID:"y"

                    },

                    {

                        type:"line",

                        label:"Kümülatif %",

                        data:kumulatif,

                        yAxisID:"y1",

                        tension:0.3

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                interaction:{

                    mode:"index",

                    intersect:false

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        title:{

                            display:true,

                            text:"Arıza Sayısı"

                        }

                    },

                    y1:{

                        position:"right",

                        min:0,

                        max:100,

                        title:{

                            display:true,

                            text:"Kümülatif %"

                        },

                        grid:{

                            drawOnChartArea:false

                        }

                    }

                }

            }

        });

    }

    catch(err){

        console.error(
            "Pareto grafik hatası:",
            err
        );

    }

}
async function raporHatArizaGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById(
                "reportStart"
            ).value;

        const bitis =
            document.getElementById(
                "reportEnd"
            ).value;


        const url =
            API +
            "?action=raporHatAriza" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);


        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        console.log(
            "Hat arıza verisi:",
            sonuc
        );


        if(!sonuc.success){

            console.error(
                "Hat arıza verisi alınamadı."
            );

            return;

        }


        const liste =
            sonuc.data;


        const etiketler =
            liste.map(
                x => x.kategori
            );


        const degerler =
            liste.map(
                x => x.adet
            );


        const canvas =
            document.getElementById(
                "reportMainChart"
            );


        if(!canvas) return;


        if(raporGrafik){

            raporGrafik.destroy();

        }


        raporGrafik =
            new Chart(
                canvas,
                {

                    type:"bar",

                    data:{

                        labels:
                            etiketler,

                        datasets:[{

                            label:
                                "Arıza Sayısı",

                            data:
                                degerler,

                            borderWidth:1

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

                }
            );


        document
            .getElementById(
                "reportChartTitle"
            )
            .innerText =
                "Hatlara göre arıza sayısı";


    }
    catch(err){

        console.error(
            "Hat arıza grafik hatası:",
            err
        );

    }

}
async function raporMarkaArizaGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById(
                "reportStart"
            ).value;

        const bitis =
            document.getElementById(
                "reportEnd"
            ).value;


        const url =
            API +
            "?action=raporMarkaAriza" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);


        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        console.log(
            "Marka arıza verisi:",
            sonuc
        );


        if(!sonuc.success){

            console.error(
                "Marka arıza verisi alınamadı."
            );

            return;

        }


        const liste =
            sonuc.data;


        const etiketler =
            liste.map(
                x => x.kategori
            );


        const degerler =
            liste.map(
                x => x.adet
            );


        const canvas =
            document.getElementById(
                "reportMainChart"
            );


        if(!canvas) return;


        if(raporGrafik){

            raporGrafik.destroy();

        }


        raporGrafik =
            new Chart(
                canvas,
                {

                    type:"bar",

                    data:{

                        labels:
                            etiketler,

                        datasets:[{

                            label:
                                "Arıza Sayısı",

                            data:
                                degerler,

                            borderWidth:1

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

                }
            );


        document
            .getElementById(
                "reportChartTitle"
            )
            .innerText =
                "Markalara göre arıza sayısı";


    }
    catch(err){

        console.error(
            "Marka arıza grafik hatası:",
            err
        );

    }

}
async function raporModelArizaGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById(
                "reportStart"
            ).value;

        const bitis =
            document.getElementById(
                "reportEnd"
            ).value;


        const url =
            API +
            "?action=raporModelAriza" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);


        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        console.log(
            "Model arıza verisi:",
            sonuc
        );


        if(!sonuc.success){

            console.error(
                "Model arıza verisi alınamadı."
            );

            return;

        }


        const liste =
            sonuc.data;


        const etiketler =
            liste.map(
                x => x.kategori
            );


        const degerler =
            liste.map(
                x => x.adet
            );


        const canvas =
            document.getElementById(
                "reportMainChart"
            );


        if(!canvas) return;


        if(raporGrafik){

            raporGrafik.destroy();

        }


        raporGrafik =
            new Chart(
                canvas,
                {

                    type:"bar",

                    data:{

                        labels:
                            etiketler,

                        datasets:[{

                            label:
                                "Arıza Sayısı",

                            data:
                                degerler,

                            borderWidth:1

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

                }
            );


        document
            .getElementById(
                "reportChartTitle"
            )
            .innerText =
                "Makine modellerine göre arıza sayısı";


    }
    catch(err){

        console.error(
            "Model arıza grafik hatası:",
            err
        );

    }

}
// =====================================================
// PARÇA KULLANIM GRAFİĞİ
// =====================================================
async function raporParcaKullanimiGrafigiCiz(){

    try{

        const baslangic =
            document.getElementById(
                "reportStart"
            ).value;


        const bitis =
            document.getElementById(
                "reportEnd"
            ).value;


        const url =
            API +
            "?action=raporParcaKullanimi" +
            "&baslangic=" +
            encodeURIComponent(
                baslangic
            ) +
            "&bitis=" +
            encodeURIComponent(
                bitis
            );


        console.log(
            "Parça kullanım API:",
            url
        );


        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        console.log(
            "Parça kullanım verisi:",
            sonuc
        );


        if(!sonuc.success){

            console.error(
                "Parça kullanım verisi alınamadı."
            );

            return;

        }


        const liste =
            sonuc.data || [];


        const etiketler =
            liste.map(
                x => x.kategori
            );


        const degerler =
            liste.map(
                x => x.adet
            );


        const canvas =
            document.getElementById(
                "reportMainChart"
            );


        if(!canvas) return;


        if(raporGrafik){

            raporGrafik.destroy();

        }


        raporGrafik =
            new Chart(
                canvas,
                {

                    type:"bar",

                    data:{

                        labels:
                            etiketler,

                        datasets:[{

                            label:
                                "Kullanılan Adet",

                            data:
                                degerler,

                            borderWidth:1

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

                                },

                                title:{

                                    display:true,

                                    text:"Adet"

                                }

                            }

                        }

                    }

                }

            );


        document
            .getElementById(
                "reportChartTitle"
            )
            .innerText =
                "Yedek parça kullanım miktarları";


    }
    catch(err){

        console.error(
            "Parça kullanım grafik hatası:",
            err
        );

    }

}
// =====================================================
// İYİLEŞTİRME ALANLARINI YÜKLE
// =====================================================
async function raporIyilestirmeAlanlariYukle(){

    try{

        const baslangic =
            document.getElementById(
                "reportStart"
            ).value;


        const bitis =
            document.getElementById(
                "reportEnd"
            ).value;


        const url =
            API +
            "?action=raporIyilestirmeAlanlari" +
            "&baslangic=" +
            encodeURIComponent(
                baslangic
            ) +
            "&bitis=" +
            encodeURIComponent(
                bitis
            );


        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        console.log(
            "İyileştirme alanları:",
            sonuc
        );


        if(!sonuc.success){

            console.error(
                "İyileştirme alanları alınamadı."
            );

            return;

        }


        const liste =
            sonuc.data || [];


        const container =
            document.getElementById(
                "improvementList"
            );


        if(!container) return;


        if(liste.length === 0){

            container.innerHTML = `
                <div class="report-empty">
                    Bu tarih aralığında
                    iyileştirme gerektiren
                    veri bulunamadı.
                </div>
            `;

            return;

        }


        container.innerHTML =
            liste.map(item => {

                const renk =
                    item.oncelik === "Yüksek"
                    ? "#ef4444"
                    : "#f59e0b";


                return `

                    <div
                        style="
                            display:flex;
                            gap:14px;
                            align-items:flex-start;
                            padding:14px;
                            margin-bottom:10px;
                            border-left:5px solid ${renk};
                            background:#f8fafc;
                            border-radius:10px;
                        "
                    >

                        <div
                            style="
                                font-size:22px;
                            "
                        >
                            ${
                                item.oncelik === "Yüksek"
                                ? "🔴"
                                : "🟠"
                            }
                        </div>


                        <div>

                            <div
                                style="
                                    font-weight:700;
                                    margin-bottom:4px;
                                "
                            >
                                ${item.kategori}:
                                ${item.alan}
                            </div>


                            <div
                                style="
                                    color:#475569;
                                    font-size:14px;
                                "
                            >
                                ${item.mesaj}
                            </div>


                            <div
                                style="
                                    margin-top:5px;
                                    font-size:12px;
                                    color:#64748b;
                                "
                            >
                                Öncelik:
                                ${item.oncelik}
                            </div>

                        </div>

                    </div>

                `;

            }).join("");


    }
    catch(err){

        console.error(
            "İyileştirme alanları hatası:",
            err
        );

    }

}
// =====================================================
// YÖNETİCİ ÖZETİ
// =====================================================
async function raporYoneticiOzetiYukle(rapor) {

    try {

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;


        // ==========================================
        // İYİLEŞTİRME ALANLARINI AL
        // ==========================================

        const url =
            API +
            "?action=raporIyilestirmeAlanlari" +
            "&baslangic=" +
            encodeURIComponent(baslangic) +
            "&bitis=" +
            encodeURIComponent(bitis);


        const response =
            await fetch(url);


        const sonuc =
            await response.json();


        let iyilestirmeler = [];


        if (sonuc.success) {

            iyilestirmeler =
                sonuc.data || [];

        }


        // ==========================================
        // TARİH
        // ==========================================

        let tarihMetni = "";

        if (baslangic && bitis) {

            const bas =
                new Date(baslangic)
                    .toLocaleDateString("tr-TR");

            const son =
                new Date(bitis)
                    .toLocaleDateString("tr-TR");

            tarihMetni =
                `${bas} - ${son}`;

        }


        // ==========================================
        // ANA KPI'LAR
        // ==========================================

        const toplamBakim =
            Number(rapor.toplamBakim || 0);

        const planli =
            Number(rapor.planliOran || 0);

        const plansiz =
            Number(rapor.plansizOran || 0);

        const mttr =
            Number(rapor.mttr || 0);

        const mtbf =
            Number(rapor.mtbf || 0);

        const durus =
            Number(rapor.durusSuresi || 0);


        // ==========================================
        // ÖZET METNİ
        // ==========================================

        let metin = `
            <div style="
                line-height:1.7;
                color:#334155;
            ">

                <div style="
                    font-weight:700;
                    font-size:17px;
                    margin-bottom:8px;
                    color:#0f172a;
                ">
                    ${tarihMetni}
                </div>


                <p>
                    Seçilen dönemde toplam
                    <strong>${toplamBakim}</strong>
                    bakım gerçekleştirilmiştir.
                    Bakımların
                    <strong>%${planli}</strong>'i
                    planlı,
                    <strong>%${plansiz}</strong>'i
                    plansız bakımdır.
                </p>


                <p>
                    Ortalama tamir süresi
                    <strong>${mttr} dakika</strong>,
                    MTBF değeri
                    <strong>${mtbf} saat</strong>
                    ve toplam arıza duruş süresi
                    <strong>${durus} saat</strong>
                    olarak gerçekleşmiştir.
                </p>
        `;


        // ==========================================
        // ÖNCELİKLİ ALANLAR
        // ==========================================

        if (iyilestirmeler.length > 0) {

            metin += `
                <p style="
                    margin-bottom:6px;
                    font-weight:700;
                    color:#0f172a;
                ">
                    Öncelikli iyileştirme alanları:
                </p>

                <ul style="
                    margin-top:5px;
                    padding-left:22px;
                ">
            `;


            iyilestirmeler
                .slice(0, 4)
                .forEach(item => {

                    const ikon =
                        item.oncelik === "Yüksek"
                        ? "🔴"
                        : "🟠";


                    metin += `
                        <li style="
                            margin-bottom:5px;
                        ">
                            ${ikon}
                            <strong>
                                ${item.kategori}:
                                ${item.alan}
                            </strong>
                            —
                            ${item.mesaj}
                        </li>
                    `;

                });


            metin += `
                    </ul>
            `;


            // ======================================
            // SONUÇ
            // ======================================

            const yuksek =
                iyilestirmeler.filter(
                    x => x.oncelik === "Yüksek"
                );


            if (yuksek.length > 0) {

                metin += `
                    <div style="
                        margin-top:12px;
                        padding:12px 14px;
                        background:#fff7ed;
                        border-left:4px solid #f97316;
                        border-radius:8px;
                    ">
                        <strong>Yönetici değerlendirmesi:</strong>
                        Öncelikli aksiyonlar
                        ${
                            yuksek
                                .map(x => x.alan)
                                .join(", ")
                        }
                        üzerinde yoğunlaştırılmalıdır.
                    </div>
                `;

            }

        }
        else {

            metin += `
                <div style="
                    margin-top:12px;
                    padding:12px 14px;
                    background:#f0fdf4;
                    border-left:4px solid #22c55e;
                    border-radius:8px;
                ">
                    Seçilen dönem için belirgin bir
                    iyileştirme alanı tespit edilmemiştir.
                </div>
            `;

        }


        metin += `
            </div>
        `;


        // ==========================================
        // EKRANA YAZ
        // ==========================================

        const alan =
            document.getElementById(
                "reportSummary"
            );


        if (alan) {

            alan.innerHTML = metin;

        }


    }
    catch (err) {

        console.error(
            "Yönetici özeti hatası:",
            err
        );

    }

}
// =====================================================
// EXCEL RAPORU OLUŞTUR
// =====================================================
function raporExcelOlustur(){

    try{

        // ==========================================
        // TARİH BİLGİLERİ
        // ==========================================

        const baslangic =
            document.getElementById("reportStart").value;

        const bitis =
            document.getElementById("reportEnd").value;


        // ==========================================
        // KPI DEĞERLERİ
        // ==========================================

        const toplamBakim =
            document.getElementById("rToplamBakim")?.innerText || "0";

        const planli =
            document.getElementById("rPlanli")?.innerText || "0";

        const plansiz =
            document.getElementById("rPlansiz")?.innerText || "0";

        const mttr =
            document.getElementById("rMttr")?.innerText || "0";

        const mtbf =
            document.getElementById("rMtbf")?.innerText || "0";

        const durus =
            document.getElementById("rDurus")?.innerText || "0";


        // ==========================================
        // YÖNETİCİ ÖZETİ
        // ==========================================

        const yoneticiOzeti =
            document.getElementById(
                "reportSummary"
            )?.innerText || "";


        // ==========================================
        // İYİLEŞTİRME ALANLARI
        // ==========================================

        const improvement =
            document.getElementById(
                "improvementList"
            );


        const iyilestirmeSatirlari = [];


        if(improvement){

            const alanlar =
                improvement.children;


            for(let i = 0; i < alanlar.length; i++){

                const metin =
                    alanlar[i].innerText
                        .replace(/\n+/g, " | ")
                        .trim();


                if(metin){

                    iyilestirmeSatirlari.push([
                        i + 1,
                        metin
                    ]);

                }

            }

        }


        // ==========================================
        // ÖZET SAYFASI
        // ==========================================

        const ozetData = [

            ["BAKIM PRO - TPM RAPORU"],

            [],

            ["Rapor Dönemi",
             `${baslangic} - ${bitis}`],

            [],

            ["KPI", "Değer"],

            ["Toplam Bakım",
             toplamBakim],

            ["Planlı Bakım",
             planli],

            ["Plansız Bakım",
             plansiz],

            ["MTTR",
             mttr],

            ["MTBF",
             mtbf],

            ["Duruş Süresi",
             durus]

        ];


        // ==========================================
        // İYİLEŞTİRME SAYFASI
        // ==========================================

        const iyilestirmeData = [

            ["İYİLEŞTİRME ALANLARI"],

            [],

            ["No", "Alan"]

        ];


        if(iyilestirmeSatirlari.length > 0){

            iyilestirmeSatirlari.forEach(
                satir => {

                    iyilestirmeData.push(
                        satir
                    );

                }
            );

        }
        else{

            iyilestirmeData.push([
                "",
                "Bu dönem için iyileştirme alanı bulunamadı."
            ]);

        }


        // ==========================================
        // YÖNETİCİ ÖZETİ SAYFASI
        // ==========================================

        const yoneticiData = [

            ["YÖNETİCİ ÖZETİ"],

            [],

            ["Rapor Dönemi",
             `${baslangic} - ${bitis}`],

            [],

            ["Değerlendirme"],

            [yoneticiOzeti]

        ];


        // ==========================================
        // WORKBOOK OLUŞTUR
        // ==========================================

        const wb =
            XLSX.utils.book_new();


        // ==========================================
        // SHEET 1 - ÖZET
        // ==========================================

        const wsOzet =
            XLSX.utils.aoa_to_sheet(
                ozetData
            );


        wsOzet["!cols"] = [

            { wch: 28 },

            { wch: 25 }

        ];


        XLSX.utils.book_append_sheet(
            wb,
            wsOzet,
            "Özet"
        );


        // ==========================================
        // SHEET 2 - İYİLEŞTİRME
        // ==========================================

        const wsIyilestirme =
            XLSX.utils.aoa_to_sheet(
                iyilestirmeData
            );


        wsIyilestirme["!cols"] = [

            { wch: 8 },

            { wch: 80 }

        ];


        XLSX.utils.book_append_sheet(
            wb,
            wsIyilestirme,
            "İyileştirme"
        );


        // ==========================================
        // SHEET 3 - YÖNETİCİ ÖZETİ
        // ==========================================

        const wsYonetici =
            XLSX.utils.aoa_to_sheet(
                yoneticiData
            );


        wsYonetici["!cols"] = [

            { wch: 25 },

            { wch: 100 }

        ];


        XLSX.utils.book_append_sheet(
            wb,
            wsYonetici,
            "Yönetici Özeti"
        );


        // ==========================================
        // DOSYA ADI
        // ==========================================

        const tarih =
            new Date()
                .toISOString()
                .slice(0,10);


        const dosyaAdi =
            "BakimPro_TPM_Rapor_" +
            tarih +
            ".xlsx";


        // ==========================================
        // EXCEL İNDİR
        // ==========================================

        XLSX.writeFile(
            wb,
            dosyaAdi
        );


        console.log(
            "Excel raporu oluşturuldu:",
            dosyaAdi
        );

    }
    catch(err){

        console.error(
            "Excel oluşturma hatası:",
            err
        );

        alert(
            "Excel oluşturulurken hata oluştu. " +
            err.message
        );

    }

}
// =====================================================
// PDF RAPORU OLUŞTUR
// =====================================================
async function raporPDFOlustur(){

    try{

        const raporAlani =
            document.querySelector(".reports-page") ||
            document.querySelector("#reportsPage") ||
            document.querySelector("section");

        if(!raporAlani){

            alert("Rapor alanı bulunamadı.");

            return;

        }


        // ==========================================
        // PDF OLUŞTURULUYOR
        // ==========================================

        const btn =
            document.querySelector(
                ".report-export .btn-primary"
            );

        const eskiYazi =
            btn ? btn.innerText : "";


        if(btn){

            btn.innerText =
                "⏳ PDF hazırlanıyor...";

            btn.disabled = true;

        }


        // ==========================================
        // RAPORUN GÖRÜNÜR OLMASINI SAĞLA
        // ==========================================

        const eskiScroll =
            window.scrollY;


        // PDF alınırken butonları göstermeyelim
        const exportAlani =
            document.querySelector(
                ".report-export"
            );


        let eskiExportDisplay = "";


        if(exportAlani){

            eskiExportDisplay =
                exportAlani.style.display;

            exportAlani.style.display =
                "none";

        }


        // ==========================================
        // TÜM GRAFİKLERİN RENDER OLMASINI BEKLE
        // ==========================================

        await new Promise(resolve =>
            setTimeout(resolve, 800)
        );


        // ==========================================
        // HTML2CANVAS
        // ==========================================

        const canvas =
            await html2canvas(
                raporAlani,
                {

                    scale:2,

                    useCORS:true,

                    allowTaint:false,

                    backgroundColor:"#ffffff",

                    logging:false,

                    scrollX:0,

                    scrollY:-window.scrollY,

                    windowWidth:
                        document.documentElement
                            .scrollWidth,

                    windowHeight:
                        raporAlani.scrollHeight

                }
            );


        // ==========================================
        // ESKİ HALİ GERİ GETİR
        // ==========================================

        if(exportAlani){

            exportAlani.style.display =
                eskiExportDisplay;

        }


        window.scrollTo(
            0,
            eskiScroll
        );


        // ==========================================
        // JSPDF
        // ==========================================

        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF({

                orientation:"portrait",

                unit:"mm",

                format:"a4",

                compress:true

            });


        const sayfaGenislik = 210;

        const sayfaYukseklik = 297;

        const kenar = 10;

        const kullanilabilirGenislik =
            sayfaGenislik -
            (kenar * 2);


        const imgWidth =
            kullanilabilirGenislik;


        const imgHeight =
            canvas.height *
            imgWidth /
            canvas.width;


        let kalanYukseklik =
            imgHeight;


        let pozisyonY =
            10;


        const imgData =
            canvas.toDataURL(
                "image/jpeg",
                0.92
            );


        // ==========================================
        // ÇOK SAYFALI PDF
        // ==========================================

        pdf.addImage(
            imgData,
            "JPEG",
            kenar,
            pozisyonY,
            imgWidth,
            imgHeight
        );


        kalanYukseklik -=
            (sayfaYukseklik - 20);


        while(kalanYukseklik > 0){

            pozisyonY =
                kalanYukseklik -
                imgHeight;

            pdf.addPage();

            pdf.addImage(
                imgData,
                "JPEG",
                kenar,
                pozisyonY,
                imgWidth,
                imgHeight
            );

            kalanYukseklik -=
                (sayfaYukseklik - 20);

        }


        // ==========================================
        // DOSYA ADI
        // ==========================================

        const tarih =
            new Date()
                .toISOString()
                .slice(0,10);


        const dosyaAdi =
            "BakimPro_TPM_Rapor_" +
            tarih +
            ".pdf";


        // ==========================================
        // PDF İNDİR
        // ==========================================

        pdf.save(
            dosyaAdi
        );


        if(btn){

            btn.innerText =
                eskiYazi || "📄 PDF Oluştur";

            btn.disabled = false;

        }


        console.log(
            "PDF başarıyla oluşturuldu:",
            dosyaAdi
        );


    }
    catch(err){

        console.error(
            "PDF oluşturma hatası:",
            err
        );


        const exportAlani =
            document.querySelector(
                ".report-export"
            );


        if(exportAlani){

            exportAlani.style.display =
                "";

        }


        const btn =
            document.querySelector(
                ".report-export .btn-primary"
            );


        if(btn){

            btn.innerText =
                "📄 PDF Oluştur";

            btn.disabled = false;

        }


        alert(
            "PDF oluşturulurken hata oluştu: " +
            err.message
        );

    }

}
