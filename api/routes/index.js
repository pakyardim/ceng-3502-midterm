const express = require("express");
const landmarksRouter = require("./landmarks");
const visitedLandmarksRouter = require("./visited-landmarks");

const router = express.Router();

router.use("/landmarks", landmarksRouter);
router.use("/visited", visitedLandmarksRouter);

module.exports = router;
