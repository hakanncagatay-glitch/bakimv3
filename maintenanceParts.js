let secilenParcalar = [];
// ======================================
// PARÇA ARAMA
// ======================================

document.getElementById("partSearchInput")
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

<div class="part-result"
onclick="parcaSec('${p.kod}')">

<b>${p.ad}</b>

<br>

Stok : ${p.stok}

</div>

`;

        });

        sonucDiv.innerHTML = html;

    }

    catch(err){

        console.error(err);

    }

});
function parcaSec(kod){

    alert(kod);

}
