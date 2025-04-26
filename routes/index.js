const express = require("express");
const landmarksRouter = require("./landmarks");

const router = express.Router();

router.use("/landmarks", landmarksRouter);

module.exports = router;
