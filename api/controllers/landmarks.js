const fs = require("fs");
const path = require("path");

exports.getLandmarks = (req, res) => {
  try {
    const dataFilePath = path.join(__dirname, "../data/landmarks.json");
    const landmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    const visitedLanDmarkFilePath = path.join(
      __dirname,
      "../data/visited-landmarks.json"
    );

    const visitedLandmarks = JSON.parse(
      fs.readFileSync(visitedLanDmarkFilePath, "utf8")
    );

    const visitedLandmarkIds = visitedLandmarks.map((lm) => lm.id);

    const landmarksWithVisitedStatus = landmarks.map((landmark) => {
      return {
        ...landmark,
        visited: visitedLandmarkIds.includes(landmark.id),
      };
    });

    res.status(200).json(landmarksWithVisitedStatus);
  } catch (error) {
    console.error("Error reading landmarks file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addLandmark = (req, res) => {
  const { name, description, location, category, notes } = req.body;

  if (!name || !description || !location || !category) {
    return res.status(400).json({ error: "Invalid landmark data" });
  }

  try {
    const dataFilePath = path.join(__dirname, "../data/landmarks.json");
    const landmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    const id = landmarks.length ? landmarks[landmarks.length - 1].id + 1 : 1;

    const newLandmark = {
      id,
      name,
      description,
      location: {
        latitude: +location.latitude,
        longitude: +location.longitude,
      },
      category,
      notes: notes || "",
    };

    landmarks.push(newLandmark);
    fs.writeFileSync(dataFilePath, JSON.stringify(landmarks, null, 2));
    res.status(201).json(newLandmark);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLandmark = (req, res) => {
  const { id } = req.params;

  try {
    const dataFilePath = path.join(__dirname, "../data/landmarks.json");
    const landmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    const landmark = landmarks.find((lm) => lm.id === +id);

    if (!landmark) {
      return res.status(404).json({ error: "Landmark not found" });
    }

    res.status(200).json(landmark);
  } catch (error) {
    console.error("Error reading landmarks file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateLandmark = (req, res) => {
  const { id } = req.params;
  const { name, description, location, category, notes } = req.body;

  if (!name || !description || !location || !category) {
    return res.status(400).json({ error: "Invalid landmark data" });
  }

  try {
    const dataFilePath = path.join(__dirname, "../data/landmarks.json");
    const landmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    const landmarkIndex = landmarks.findIndex((lm) => lm.id === +id);

    if (landmarkIndex === -1) {
      return res.status(404).json({ error: "Landmark not found" });
    }

    const updatedLandmark = {
      ...landmarks[landmarkIndex],
      name,
      description,
      location,
      category,
      notes,
    };

    landmarks[landmarkIndex] = updatedLandmark;
    fs.writeFileSync(dataFilePath, JSON.stringify(landmarks, null, 2));
    res.status(200).json(updatedLandmark);
  } catch (error) {
    console.error("Error writing to landmarks file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteLandmark = (req, res) => {
  const { id } = req.params;

  try {
    const dataFilePath = path.join(__dirname, "../data/landmarks.json");
    const landmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    const landmarkIndex = landmarks.findIndex((lm) => lm.id === +id);

    if (landmarkIndex === -1) {
      return res.status(404).json({ error: "Landmark not found" });
    }

    landmarks.splice(landmarkIndex, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(landmarks, null, 2));
    res.status(200).json({ message: "Landmark deleted successfully" });
  } catch (error) {
    console.error("Error writing to landmarks file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
