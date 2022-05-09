const elLoad = document.getElementById("load");
const elLicensees = document.getElementById("licensees")
const elDate = document.getElementById("date");

const elAdd = document.getElementById("insert");

const elFirst = document.getElementById("first");
const elLast = document.getElementById("last");
const elExpiry = document.getElementById("expiry");

elAdd.addEventListener('click', async() => {

    let data = { first: elFirst.value, last: elLast.value, expiry: elExpiry.value };
    //console.log(data);
    const rdata = await (await fetch("/api/licensee/", {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })).json();
    console.log(rdata);
});

elLoad.addEventListener("click", async() => {

    //const data = await (await fetch("/api/licensee")).json();



    const data = await (await fetch("/api/licensee/" + elDate.value)).json();

    console.log(data);
    elLicensees.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        elLicensees.innerHTML += `<div class="licensee" id="licenseseeId${data[i].licenseeId}">${data[i].first}</div>`;
    }

});