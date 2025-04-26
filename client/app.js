const API_URL = "http://localhost:5000/api/landmarks";

async function fetchLandmarks() {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching landmarks:", error);
  }
}

function updateLandmarkList(landmarks) {
  let list = document.getElementById("landmarkList");
  list.innerHTML = "";
  landmarks.forEach((point, index) => {
    let li = document.createElement("li");
    li.textContent = `Landmark ${index + 1}: Lat ${point.latitude}, Lng ${
      point.longitude
    }`;
    list.appendChild(li);
  });
}

async function init() {
  const map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let landmarks = [];

  map.on("click", function (e) {
    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
      .openPopup();

    landmarks.push({ latitude: lat, longitude: lng });
    updateLandmarkList(landmarks);
  });

  const response = await fetchLandmarks(map);

  if (response) {
    landmarks.push(...response.map((landmark) => landmark.location));
    updateLandmarkList(landmarks);

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
