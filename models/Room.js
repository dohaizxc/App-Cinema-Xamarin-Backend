const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new mongoose.Schema({
  name: {
    type: Number,
    require: true,
  },
  Showtimes: [{ type: Schema.Types.ObjectId, ref: "Showtime" }],
  cinema: { type: Schema.Types.ObjectId, ref: "Cinema" },
});

module.exports = mongoose.model("Room", RoomSchema);
