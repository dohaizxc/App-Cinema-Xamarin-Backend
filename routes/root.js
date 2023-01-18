const { json } = require("body-parser");
const express = require("express");

const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  return res.status(200).json("ok");
});

module.exports = router;
