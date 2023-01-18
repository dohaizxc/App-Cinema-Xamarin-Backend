const mongoose = require("mongoose");
const { Schema } = mongoose;

const CinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  province: { type: Schema.Types.ObjectId, ref: "Province" },
  address_url: String,
});

module.exports = mongoose.model("Cinema", CinemaSchema);
