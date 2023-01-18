const express = require("express");
const router = express.Router();
const ShowtimeController = require("../controllers/showtimeController");
const verifyJWT = require("../middleware/verifyJWT");
router.route("/").post(ShowtimeController.createNewShowtime);

router;
router
  .route("/:id")
  .get(ShowtimeController.getOneShowtime)
  .delete(ShowtimeController.deleteShowtime);

// router
//   .route("/cinema/:cinemaId/:date")
//   .get(ShowtimeController.getShowtimeByCinemaXamarin);
// router
//   .route("/:movieId/:provinceId/:date")
//   .get(ShowtimeController.getShowtimesByProvince);

router
  .route("/cinema2/:cinemaId/:date")
  .get(ShowtimeController.getShowtimeByDay);

  router
  .route("/movie2/:movieId/:date")
  .get(ShowtimeController.getShowtimeByMovie);
module.exports = router;
