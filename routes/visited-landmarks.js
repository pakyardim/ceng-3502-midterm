const express = require("express");
const {
  getVisitedLandmarks,
  addVisitedLandmark,
  getVisitHistoryByLandmarkId,
} = require("../controllers/visited-landmarks");

const router = express.Router();

router.route("/").get(getVisitedLandmarks).post(addVisitedLandmark);

router.route("/:id").get(getVisitHistoryByLandmarkId);

module.exports = router;
