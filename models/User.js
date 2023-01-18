const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },

  phoneNumber: {
    type: String,
    require: true,
  },

  dayOfBirth: {
    type: Date,
  },

  gender: {
    type: String,
  },
  active: {
    type: Boolean,
    require: true,
    default: true,
  },
  name: {
    type: String,
    require: true,
  },
  tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
});

module.exports = mongoose.model("User", UserSchema);
