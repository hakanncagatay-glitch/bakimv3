const tarih = new Date();

document.getElementById("today").innerHTML =
tarih.toLocaleDateString("tr-TR",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});
