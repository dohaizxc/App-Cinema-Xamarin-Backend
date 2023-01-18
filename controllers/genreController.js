const Genre = require("../models/Genre");
const asyncHandler = require("express-async-handler");
const getAllGenres = asyncHandler(async (req, res) => {
  const genres = await Genre.find();
  if (!genres) return res.status(400).json({ message: "No genres found" });

  res.json(genres);
});

const createNewGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log(name);
  if (!name) return res.status(400).json({ message: "name are required!" });
  const genre = await Genre.create({
    name: name,
  });
  if (genre) {
    res.status(201).json({ message: `New genre ${genre.name} created` });
  } else {
    res.status(400).json({ message: "invalid genre received" });
  }
});

module.exports = { getAllGenres, createNewGenre };
