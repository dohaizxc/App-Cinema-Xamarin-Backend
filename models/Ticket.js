const mongoose = require("mongoose");
const { Schema } = mongoose;

const TicketSchema = new mongoose.Schema({
  Showtime: { type: Schema.Types.ObjectId, required: true, ref: "Showtime" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  seat: String,
  foods: String,
  paymentMethod: String,
  movieName: String,
  cinemaName: String,
  time: String,
  date: String,
  totalTicket: Number,
  totalFood: Number,
  total: Number,
  id: String,
  movieImage: String,
  room: Number,
});

module.exports = mongoose.model("Ticket", TicketSchema);
