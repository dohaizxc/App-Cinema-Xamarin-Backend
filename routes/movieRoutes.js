const express = require("express");
const router = express.Router();
const movieController = require("../controllers/moviesController");
const verifyJWT = require("../middleware/verifyJWT");
router
  .route("/")
  .get(movieController.getAllMovies)
  .post(verifyJWT, movieController.createNewMovie);
router.route("/date").get(movieController.getMovieByDate);
router
  .route("/:id")
  .get(movieController.getOneMovies)
  .patch(verifyJWT, movieController.updateMovie)
  .delete(verifyJWT, movieController.deleteMovie);

module.exports = router;
