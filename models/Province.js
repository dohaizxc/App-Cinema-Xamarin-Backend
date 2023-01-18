const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProvinceSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  cinemas: [{ type: Schema.Types.ObjectId, ref: "Cinema" }],
});

module.exports = mongoose.model("Province", ProvinceSchema);
