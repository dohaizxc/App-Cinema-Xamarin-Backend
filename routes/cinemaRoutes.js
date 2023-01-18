const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");
const verifyJWT = require("../middleware/verifyJWT");
router
  .route("/")
  .get(cinemaController.getAllCinemas)
  .post(verifyJWT, cinemaController.createNewCinema);

router
  .route("/:id")
  .get(cinemaController.getOneCinemas)
  .patch(verifyJWT, cinemaController.updateCinema)
  .delete(verifyJWT, cinemaController.deleteCinema);

module.exports = router;
