import L from 'leaflet';

let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let marker = L.marker([51.5, -0.09]).addTo(map);

getIp();

const ipInput = document.querySelector(".header__input");
const btn = document.querySelector(".header__submit");

const ipElem = document.querySelector("#IP-adress");
const locationElem = document.querySelector("#location");
const timezoneElem = document.querySelector("#timezone");
const ispElem = document.querySelector("#isp");

btn.addEventListener("click", getData);
ipInput.addEventListener("keydown", handleKey);

function validateIPaddress(ipaddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  alert("IP adress is not valid!");
  return false;
}

function getIp() {
  fetch('https://api.ipify.org?format=json&callback=getip')
  .then((response) => response.json())
  .then((data) => {
    console.log(data.ip);
    ipInput.value = data.ip;
    getData();
  });
}

function getData() {
  if (!validateIPaddress(ipInput.value)) {
    return;
  }

  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_HKLlpzPKGPLyqOmFlmGGaH57pgpQf&ipAddress=${ipInput.value}`
  )
    .then((response) => response.json())
    .then(setInfo);
}

function handleKey(event) {
  if (event.key === "Enter") {
    getData();
  }
}

function setInfo(data) {
  console.log(data);
  ipElem.innerText = data.ip;
  locationElem.innerText = `${data.location.country}, ${data.location.region}, ${data.location.city}`;
  timezoneElem.innerText = `UTC ${data.location.timezone}`;
  ispElem.innerText = data.isp;

  changeMapCoord(data);
}

function changeMapCoord(data) {
  map.setView([data.location.lat, data.location.lng], 13);
  marker.removeFrom(map);
  marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
}