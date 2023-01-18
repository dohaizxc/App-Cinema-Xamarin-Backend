const Movie = require("../models/Movie");
const asyncHandler = require("express-async-handler");
const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find().populate("genre");
  if (!movies) return res.status(400).json({ message: "No movies found" });

  res.json(movies);
});
const getOneMovies = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(id).exec();
  if (!movie) return res.status(400).json({ message: "No movies found" });
  movie.genres = movie.genre.join(", ");
  res.json(movie);
});

const createNewMovie = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    director,
    actors,
    genre,
    releaseDate,
    duration,
    language,
    description,
    rated,
    trailer_url,
  } = req.body;
  if (!name || !image || !duration)
    return res
      .status(400)
      .json({ message: "name, image,duration are required!" });
  const movie = await Movie.create({
    name: name,
    image: image,
    director: director,
    actors: actors,
    genre: genre,
    releaseDate: releaseDate,
    duration: duration,
    language: language,
    description: description,
    rated: rated,
    trailer_url: trailer_url,
  });

  if (movie) {
    res.status(201).json({ message: `New movie ${name} created` });
  } else {
    res.status(400).json({ message: "invalid movie received" });
  }
});

const updateMovie = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    name,
    image,
    director,
    actors,
    genre,
    releaseDate,
    endDate,
    duration,
    language,
    description,
    rated,
    trailer_url,
  } = req.body;
  if (!id || !name || !image || !duration)
    return res
      .status(400)
      .json({ message: "id, name, image,duration are required!" });

  const movie = await Movie.findById(id).exec();
  if (!movie) return res.status(400).json({ message: "Movie not found" });

  movie.name = name;
  movie.image = image;
  movie.director = director;
  movie.actors = actors;
  movie.genre = genre;
  movie.releaseDate = releaseDate;
  movie.endDate = endDate;
  movie.duration = duration;
  movie.language = language;
  movie.description = description;
  movie.rated = rated;
  movie.trailer_url = trailer_url;
  await movie.save();
  res.json({ message: `${name} updated` });
});

const deleteMovie = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("Movie id is required!");
  const movie = await Movie.findById(id).exec();
  if (!movie) return res.status(400).json({ message: "Movie not found" });
  const result = movie.deleteOne();
  res.json(`${result.name} is deleted!`);
});

const getMovieByDate = asyncHandler(async (req, res) => {
  let date = new Date("2022-12-6");
  let nextDate = new Date(date);
  const movies = await Movie.find({
    releaseDate: {
      $gte: date,
      $lt: nextDate.setDate(date.getDate() + 1),
    },
  }).populate("genre");
  console.log(date, nextDate);
  if (!movies) return res.status(400).json({ message: "No movies found" });

  res.json(movies);
});
module.exports = {
  getAllMovies,
  getOneMovies,
  createNewMovie,
  updateMovie,
  deleteMovie,
  getMovieByDate,
};
