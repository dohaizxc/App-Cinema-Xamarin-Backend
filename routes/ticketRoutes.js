const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const verifyJWT = require("../middleware/verifyJWT");
router.route("/").post(ticketController.createTicket);

router.route("/:id").get(ticketController.getOneTicket);
router.route("/user/:id").get(ticketController.getTicketByUser);

module.exports = router;
