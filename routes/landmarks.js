const express = require("express");
const {
  getLandmarks,
  addLandmark,
  getLandmark,
  updateLandmark,
  deleteLandmark,
} = require("../controllers/landmarks");

const router = express.Router();

router.route("/").get(getLandmarks).post(addLandmark);
router
  .route("/:id")
  .get(getLandmark)
  .put(updateLandmark)
  .delete(deleteLandmark);

module.exports = router;
