const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController")

router
  .route("/")
  .get(genreController.getAllGenres)
  .post(genreController.createNewGenre)


module.exports = router;
