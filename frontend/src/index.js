import "./css/styles.css";
import layoutTemplate from "./hbs/layout.hbs";
import layoutMap from "./hbs/map.hbs";
import layoutContact from "./hbs/contact.hbs";
import layoutAdd from "./hbs/addContact.hbs";

import module from "./js/module";


const appEl = document.getElementById("app");
const siteInfo = { title: "Sample WebPack+Handlebars Frontend" };
const contactsUrl = "http://localhost:4000/api/";
window.document.title = siteInfo.title;
appEl.innerHTML = layoutTemplate(siteInfo);

const mapEl = document.getElementById("map-pane");
document.getElementById("add-pane").innerHTML = layoutAdd();
mapEl.innerHTML = layoutMap();

const contactsEl = document.getElementById("content-pane");




mapboxgl.accessToken = "pk.eyJ1Ijoic2hhbnNoYW4tMjUxMiIsImEiOiJjbDJod2lhc2wwaHc1M2Jtc2R3ZDFtcHV6In0.bRFSbbkug6JVWUlG7u0Knw";
let map;
let contactId;

let init = async function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/shanshan-2512/cl2hwlkh5001415o87kbihru3',
        center: [-75.765, 45.456],
        zoom: 13.5

    });
    getContacts();

    document.getElementById("addContactBtn").addEventListener("click", async () => {

        let newContact = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            phoneNumber: document.getElementById("phoneNumber").value,
            streetNumber: document.getElementById("streetNumber").value,
            street: document.getElementById("Street").value,
            city: document.getElementById("City").value,
            state: document.getElementById("State").value,
            country: document.getElementById("Country").value
        };

        let addContactFetch = await (await fetch(contactsUrl, {
            mode: 'cors',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        })).json();
        getContacts();

    });


}
let markers = {};

let getContacts = async () => {
    let contactsList = await (await fetch(contactsUrl, {
        mode: 'cors'
    })).json();

    markers = {};

    contactsList.forEach((el) => {
        let marker = {};
        marker.marker = new mapboxgl.Marker({ color: "#aa1acd" })
            .setLngLat([el.Lng, el.Lat])
            .setPopup(new mapboxgl.Popup().setHTML("<h1>" + el.FirstName + "</h1>"));
        marker.lat = el.Lat;
        marker.lng = el.Lng;

        markers[el.ContactId + ""] = marker;
    });

    // console.log(markers);
    contactsEl.innerHTML = layoutContact(contactsList);

    let btns = contactsEl.querySelectorAll(".locateBtn");
    btns.forEach((el) => {
        el.addEventListener("click", function () {
            let marker = markers[this.parentNode.dataset.contactid]
            marker.layer = marker.marker.addTo(map);

            map.flyTo({ center: [marker.lng, marker.lat] });

        });
    });


    let deleteBtns = contactsEl.querySelectorAll(".deleteBtn");

    deleteBtns.forEach((el) => {
        el.addEventListener("click", async function () {
            let marker = markers[this.parentNode.dataset.contactid];
            console.log(marker);
            if (marker.layer != null) {
                map.removeLayer(marker.layer);
            }

            let result = await (await fetch(contactsUrl + this.parentNode.dataset.contactid, {
                method: "delete"
            })).json();
            getContacts();
        });
    });

    let editBtns = contactsEl.querySelectorAll(".editBtn");
    editBtns.forEach((el) => {
        el.addEventListener("click", async function () {
            contactId = this.parentNode.dataset.contactid;
            // console.log(this.parentNode);
            document.getElementById("firstName").value = this.parentNode.dataset.firstname;
            document.getElementById("lastName").value = this.parentNode.dataset.lastname;
            document.getElementById("phoneNumber").value = this.parentNode.dataset.phonenumber;
            document.getElementById("streetNumber").value = this.parentNode.dataset.streetnumber;
            document.getElementById("Street").value = this.parentNode.dataset.street;
            document.getElementById("City").value = this.parentNode.dataset.city;
            document.getElementById("State").value = this.parentNode.dataset.state;
            document.getElementById("Country").value = this.parentNode.dataset.country;
        })
    });
    document.getElementById("updateContactBtn").addEventListener("click", async () => {

        let newContact = {
            FirstName: document.getElementById("firstName").value,
            LastName: document.getElementById("lastName").value,
            PhoneNumber: document.getElementById("phoneNumber").value,
            StreetNumber: document.getElementById("streetNumber").value,
            Street: document.getElementById("Street").value,
            City: document.getElementById("City").value,
            State: document.getElementById("State").value,
            Country: document.getElementById("Country").value
        };
        console.log(newContact);
        let updateContactFetch = await (await fetch(contactsUrl + contactId, {
            mode: 'cors',
            method: 'patch',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        })).json();
        getContacts();

    });
    return (contactsList);
}
init();