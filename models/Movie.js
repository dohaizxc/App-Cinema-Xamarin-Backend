const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: String,
  director: String,
  actors: String,
  genre: [String],
  releaseDate: Date,
  endDate: Date,
  duration: Number,
  language: String,
  description: String,
  rated: String,
  trailer_url: String,
});

module.exports = mongoose.model("Movie", MovieSchema);
