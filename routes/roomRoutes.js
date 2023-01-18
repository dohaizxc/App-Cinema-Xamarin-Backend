const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const verifyJWT = require("../middleware/verifyJWT");
router
  .route("/")
  .get(roomController.getAllRooms)
  .post(verifyJWT, roomController.createNewRoom);

router
  .route("/:id")
  .get(roomController.getOneRooms)
  .patch(verifyJWT, roomController.updateRoom)
  .delete(verifyJWT, roomController.deleteRoom);

module.exports = router;
