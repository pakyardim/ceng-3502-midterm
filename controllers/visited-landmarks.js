const fs = require("fs");
const path = require("path");

exports.getVisitedLandmarks = (req, res) => {
  try {
    const dataFilePath = path.join(__dirname, "../data/visited-landmarks.json");

    const visitedLandmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    res.status(200).json(visitedLandmarks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addVisitedLandmark = (req, res) => {
  const { landmark_id, visited_date, visitor_name } = req.body;

  if (!landmark_id || !visited_date || !visitor_name) {
    return res.status(400).json({ error: "Invalid visited landmark data" });
  }

  try {
    const landmarksDataFilePath = path.join(
      __dirname,
      "../data/landmarks.json"
    );

    const landmarks = JSON.parse(
      fs.readFileSync(landmarksDataFilePath, "utf8")
    );

    const landmarkExists = landmarks.some((lm) => lm.id === landmark_id);

    if (!landmarkExists) {
      return res.status(404).json({ error: "Landmark not found" });
    }

    const dataFilePath = path.join(__dirname, "../data/visited-landmarks.json");

    const visitedLandmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    const newVisitedLandmark = {
      id: visitedLandmarks.length + 1,
      ...req.body,
    };

    visitedLandmarks.push(newVisitedLandmark);
    fs.writeFileSync(dataFilePath, JSON.stringify(visitedLandmarks, null, 2));

    res.status(201).json(newVisitedLandmark);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getVisitHistoryByLandmarkId = (req, res) => {
  const { id } = req.params;

  try {
    const landmarksDataFilePath = path.join(
      __dirname,
      "../data/landmarks.json"
    );

    const landmarks = JSON.parse(
      fs.readFileSync(landmarksDataFilePath, "utf8")
    );

    const landmarkExists = landmarks.some((lm) => lm.id === +id);

    if (!landmarkExists) {
      return res.status(404).json({ error: "Landmark not found" });
    }

    const dataFilePath = path.join(__dirname, "../data/visited-landmarks.json");

    const visitedLandmarks = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    const visitHistory = visitedLandmarks.filter(
      (landmark) => landmark.landmark_id === +id
    );

    res.status(200).json(visitHistory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
