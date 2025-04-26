const API_URL = "http://localhost:5000/api";

let marker = null;
let map = null;
let selectedLocation = null;
let selectedLandmarkId = null;

const landmarks = [];

const landmarkList = document.getElementById("landmarkList");
const landmarkForm = document.getElementById("landmarkForm");
const locationText = document.getElementById("locationText");
const addLandmarkButton = document.getElementById("addLandmarkButton");
const markVisitedModal = document.getElementById("markVisitedModal");
const closeMarkVisitedModalButton = document.getElementById(
  "closeMarkVisitedModal"
);
const closeVisitedLandmarksModalButton = document.getElementById(
  "closeVisitedLandmarksModal"
);
const visitedLandmarksModal = document.getElementById("visitedLandmarksModal");
const visitedFormTitle = document.getElementById("visitedFormTitle");
const markVisitedForm = document.getElementById("markVisitedForm");
const visitedLandmarksBtn = document.getElementById("visitedLandmarksBtn");

visitedLandmarksBtn.addEventListener("click", async () => {
  const response = await fetch(`${API_URL}/visited`);
  const visitedLandmarks = await response.json();
  const visitedLandmarksList = document.getElementById("visitedLandmarksList");
  visitedLandmarksList.innerHTML = "";

  visitedLandmarks.forEach((landmark) => {
    const li = document.createElement("li");
    li.textContent = `Landmark ID: ${landmark.landmark_id}, Visitor: ${landmark.visitor_name}, Date: ${landmark.visited_date}`;
    visitedLandmarksList.appendChild(li);
  });
  visitedLandmarksModal.style.display = "block";
});

markVisitedForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  markAsVisited({
    landmark_id: selectedLandmarkId,
    visitor_name: document.getElementById("visitorName").value,
    visited_date: document.getElementById("visitedDate").value,
  });

  markVisitedModal.style.display = "none";
  selectedLandmarkId = null;
});

closeVisitedLandmarksModalButton.addEventListener("click", () => {
  visitedLandmarksModal.style.display = "none";
});

closeMarkVisitedModalButton.addEventListener("click", () => {
  markVisitedModal.style.display = "none";
  selectedLandmarkId = null;
});

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
    updateLandmarkList();
  }
});

function updateLandmarkList() {
  let list = document.getElementById("landmarkList");
  list.innerHTML = "";
  landmarks.forEach((landmark, index) => {
    console.log(landmark);
    let li = document.createElement("li");
    li.textContent = `Landmark ${index + 1}: Lat ${
      landmark.location.latitude
    }, Lng ${landmark.location.longitude}`;

    if (!landmark.visited) {
      let button = document.createElement("button");
      button.textContent = "Mark as Visited";
      button.addEventListener("click", () => {
        markVisitedModal.style.display = "block";
        visitedFormTitle.textContent = `Mark ${landmark.name} as visited`;
        selectedLandmarkId = landmark.id;
      });

      li.appendChild(button);
    }

    list.appendChild(li);
  });
}

async function fetchLandmarks() {
  try {
    const response = await fetch(API_URL + "/landmarks");
    return await response.json();
  } catch (error) {
    alert("Error fetching landmarks! ", error);
  }
}

async function sendLandmark(landmark) {
  try {
    const response = await fetch(API_URL + "/landmarks", {
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

async function markAsVisited({ landmark_id, visited_date, visitor_name }) {
  try {
    const response = await fetch(`${API_URL}/visited`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ landmark_id, visited_date, visitor_name }),
    });

    if (response.ok) {
      alert("Landmark marked as visited!");
    } else {
      alert("Error marking landmark as visited!");
    }
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
      landmarks.push(landmark);
      const lat = landmark.location.latitude.toFixed(6);
      const lng = landmark.location.longitude.toFixed(6);

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `<p><strong>Name: ${landmark.name}</strong></p>
          <p>Description: ${landmark.description}</p>
          <p>Lat: ${lat}, Lng: ${lng}</p>
          <p>Notes: ${landmark.notes}</p>
          <p>${landmark.visited ? "visited" : "not visited"}</p>
          `
        )
        .openPopup();
    });

    updateLandmarkList();
  }
}

document.addEventListener("DOMContentLoaded", init);
