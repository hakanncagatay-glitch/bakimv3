let secilenParcalar = [];
// ======================================
// PARÇA ARAMA
// ======================================

document.getElementById("maintenancePartSearch")
?.addEventListener("input", async function(){

    const q = this.value.trim();

    const sonucDiv =
        document.getElementById("partSearchResult");

    if(q.length < 2){

        sonucDiv.innerHTML = "";

        return;

    }

    try{

        const response = await fetch(

            API +

            "?action=parcaAra&q=" +

            encodeURIComponent(q)

        );

        const sonuc = await response.json();

        if(!sonuc.success){

            sonucDiv.innerHTML = "";

            return;

        }

        let html = "";

        sonuc.data.forEach(p=>{

            html += `

<div class="part-result">

    <div>

        <b>${p.ad}</b><br>

        <small>📦 Stok : ${p.stok}</small>

    </div>

    <button
        class="btn-primary"
        onclick="parcaSec('${p.kod}','${p.ad}',${p.fiyat})">

        + Ekle

    </button>

</div>

`;

        });

        sonucDiv.innerHTML = html;

    }

    catch(err){

        console.error(err);

    }

});
function parcaSec(kod,ad,fiyat){

    const mevcut = secilenParcalar.find(p => p.kod === kod);

    if(mevcut){

        mevcut.adet++;

    }else{

        secilenParcalar.push({

            kod,
            ad,
            fiyat,
            adet:1

        });

    }

    secilenParcalariGoster();

    document.getElementById("partSearchInput").value = "";
    document.getElementById("partSearchResult").innerHTML = "";
    document.getElementById("partSearchInput").focus();

}
function secilenParcalariGoster(){

    const alan =
        document.getElementById("selectedParts");

    let html = "<h4>Seçilen Parçalar</h4>";

    secilenParcalar.forEach((p,index)=>{

        html += `

<div
style="
display:flex;
justify-content:space-between;
align-items:center;
padding:10px;
margin:8px 0;
background:#f8fafc;
border-radius:8px;
">

<div>

<b>${p.ad}</b>

<br>

<small>

${p.adet} Adet

</small>

</div>

<button
class="btn-danger"
onclick="parcaSil(${index})">

Sil

</button>

</div>

`;

    });

    alan.innerHTML = html;

}
function parcaSil(index){

    secilenParcalar.splice(index,1);

    secilenParcalariGoster();

}
