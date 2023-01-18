const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShowtimeSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
  time_end: {
    type: String,
    require: true,
  },
  seats: [{ type: Number }],
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
});

module.exports = mongoose.model("Showtime", ShowtimeSchema);
