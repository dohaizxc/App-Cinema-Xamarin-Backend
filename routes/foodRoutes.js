const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController")

router
  .route("/")
  .get(foodController.getAllFoods)
  .post(foodController.createNewFood)

module.exports = router;
