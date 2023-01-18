const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getOneUser)
  .post(userController.updateUser)
  .delete(verifyJWT, userController.deleteUser);

module.exports = router;
