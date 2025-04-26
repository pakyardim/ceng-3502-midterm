const API_URL = "http://localhost:5000/api/landmarks";

let marker = null;
let map = null;
let selectedLocation = null;

const landmarkList = document.getElementById("landmarkList");
const landmarkForm = document.getElementById("landmarkForm");
const locationText = document.getElementById("locationText");
const addLandmarkButton = document.getElementById("addLandmarkButton");

landmarkForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("landmarkName").value.trim();
  const description = document
    .getElementById("landmarkDescription")
    .value.trim();
  const category = document.getElementById("landmarkCategory").value;
  const notes = document.getElementById("landmarkNotes").value.trim();

  const landmark = {
    name,
    description,
    category,
    location: {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    },
    notes,
  };

  const response = await sendLandmark(landmark);

  if (response) {
    alert("Landmark added successfully!");

    marker = null;
    addLandmarkButton.disabled = true;
    selectedLocation = null;
    landmarkForm.reset();
    locationText.textContent = "Location:";
  }
});

async function fetchLandmarks() {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    alert("Error fetching landmarks! ", error);
  }
}

async function sendLandmark(landmark) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(landmark),
    });

    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      return alert(`Error adding landmark! ${jsonResponse.error}`);
    }

    return jsonResponse;
  } catch (error) {
    alert("Error! ", error);
  }
}

async function init() {
  map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  map.on("click", function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    selectedLocation = { lat, lng };

    if (marker) map.removeLayer(marker);

    marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
      .openPopup();

    locationText.textContent = `Lat: ${lat}, Lng: ${lng}`;
    addLandmarkButton.disabled = false;
  });

  const response = await fetchLandmarks(map);

  if (response) {
    response.forEach((landmark) => {
      const lat = landmark.location.latitude.toFixed(6);
      const lng = landmark.location.longitude.toFixed(6);

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
        .openPopup();
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
