const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");
const Room = require("../models/Room");
const asyncHandler = require("express-async-handler");
const Province = require("../models/Province");
const Cinema = require("../models/Cinema");

const getShowtimeByCinema = asyncHandler(async (req, res) => {
  const { date, cinemaId } = req.params;

  if (!date && !cinemaId)
    return res.status(400).json({ message: "cinemaId, date is required!" });
  let currentDate = new Date(date);
  let nextDate = new Date(date);
  const showtimes = [];
  const cinema = await Cinema.findById(cinemaId);
  const movies = await Movie.find();

  for (const movie of movies) {
    const filter = {
      $and: [
        {
          date: {
            $gte: date,
            $lt: nextDate.setDate(currentDate.getDate() + 1),
          },
        },

        { roomId: { $in: cinema.rooms } },
        { movieId: { $eq: movie._id } },
      ],
    };

    const showtimesMovies = await Showtime.find(filter)
      .populate("movieId")
      .populate("roomId");

    showtimesMovies.sort(function (a, b) {
      const aHour = a.time?.split(":")[0];
      const bHour = b.time?.split(":")[0];
      if (aHour == bHour) return a.time?.split(":")[1] - b.time?.split(":")[1];
      return aHour - bHour;
    });

    const showtimes = [];
    for (const showtime of showtimesMovies) {
      showtimes.push({
        showtimeID: showtime._id,
        time: showtime.time,
        timeEnd: showtime.time_end,
        movie: showtime.movieId,
        cinemaID: cinema?.name,
        datetime: showtime.date,
      });
    }
  }

  res.status(200).json(showtimes);
});

const getShowtimesByProvince = asyncHandler(async (req, res) => {
  const { provinceId, date, movieId } = req.params;

  if (!provinceId || !date)
    return res
      .status(400)
      .json({ message: "ProvinceId,movieId, date is required!" });

  const province = await Province.findById(provinceId).populate("cinemas");
  let currentDate = new Date(date);
  let nextDate = new Date(date);
  const showtimes = [];
  for (const cinema of province.cinemas) {
    const filter = {
      $and: [
        {
          date: {
            $gte: date,
            $lt: nextDate.setDate(currentDate.getDate() + 1),
          },
        },

        { roomId: { $in: cinema.rooms } },
      ],
    };
    if (movieId !== "null") {
      filter.$and.push({ movieId: { $eq: movieId } });
    }
    const showtimesCinema = await Showtime.find(filter)
      .populate("movieId")
      .populate("roomId");

    showtimesCinema.sort(function (a, b) {
      const aHour = a.time?.split(":")[0];
      const bHour = b.time?.split(":")[0];
      if (aHour == bHour) return a.time?.split(":")[1] - b.time?.split(":")[1];
      return aHour - bHour;
    });

    showtimes.push({
      cinema: cinema,
      showtimes: [...showtimesCinema],
    });
  }
  res.json(showtimes);
});
const getOneShowtime = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const showtime = await Showtime.findById(id)
    .populate("movieId")
    .populate("roomId");
  if (!showtime) return res.status(400).json({ message: "No Showtimes found" });

  const cinema = await Cinema.findById(showtime.roomId.cinema);

  res.json({ cinemaID: cinema.name,
    time: showtime.time,
    timeEnd: showtime.time_end,
    showtimeID: showtime._id,
    datetime: showtime.date,
    seats: showtime.seats,
    room: showtime.roomId.name,
    movie: showtime.movieId
  });
});

const createNewShowtime = asyncHandler(async (req, res) => {
  const { date, roomId, movieId, time } = req.body;
  if (!date || !roomId || !movieId || !time)
    return res
      .status(400)
      .json({ message: "date, roomId, movieId are required!" });

  const room = await Room.findById(roomId).exec();
  const movie = await Movie.findById(movieId).exec();

  if (!room || !movie)
    return res.status(400).json({ message: "movie, room are not correct" });

  const totalMinute =
    Number(time.split(":")[0]) * 60 + Number(time.split(":")[1]);
  const hour_end = Math.floor((movie.duration + totalMinute) / 60);
  const minute_end = (movie.duration + totalMinute) % 60;

  const time_end = hour_end + ":" + minute_end;
  const showtime = await Showtime.create({
    date: date,
    roomId: roomId,
    movieId: movieId,
    time: time,
    time_end: time_end,
  });

  if (showtime) {
    room.Showtimes.push(showtime);
    await room.save();
    res.status(201).json({ message: `New showtine created` });
  } else {
    res.status(400).json({ message: "invalid showtime received" });
  }
});

const deleteShowtime = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("Showtime id is required!");
  const showtime = await Showtime.findById(id).exec();
  if (!showtime) return res.status(400).json({ message: "Showtime not found" });
  const room = await Room.findById(showtime.roomId).exec();
  room.Showtimes.filter((item) => item !== id);
  await room.save();
  await showtime.deleteOne();

  res.json(`Showtiem is deleted!`);
});

const getShowtimeByDay = asyncHandler(async (req, res) => {
  const { date, cinemaId } = req.params;
  console.log("hehe",{date, cinemaId});
  if (!date || !cinemaId)
    return res.status(400).json({ message: "date is required!" });
  let currentDate = new Date(date);
  cinema = await Cinema.findById(cinemaId);
  if (!cinema) return res.status(400).json({ message: "cinema not found!" });

  let nextDate = new Date(date);

  const showtimesMovies = await Showtime.find({
    $and: [
      {
        date: {
          $gte: date,
          $lt: nextDate.setDate(currentDate.getDate() + 1),
        },
      },
      { roomId: { $in: cinema.rooms } },
    ],
  })
    .populate("movieId")
    .populate("roomId");

  showtimesMovies.sort(function (a, b) {
    const aHour = a.time?.split(":")[0];
    const bHour = b.time?.split(":")[0];
    if (aHour == bHour) return a.time?.split(":")[1] - b.time?.split(":")[1];
    return aHour - bHour;
  });

  const showtimes = [];
  for (const showtime of showtimesMovies) {
    showtimes.push({
      showtimeID: showtime._id,
      time: showtime.time,
      timeEnd: showtime.time_end,
      movie: showtime.movieId,
      cinemaID: cinema.name,
      datetime: showtime.date,
    });
  }

  res.status(200).json(showtimes);
});


const getShowtimeByMovie = asyncHandler(async (req, res) => {
  const { date, movieId } = req.params;
  console.log("hehe",{date, movieId});
  if (!date || !movieId)
    return res.status(400).json({ message: "date is required!" });
  let currentDate = new Date(date);
  movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).json({ message: "movie not found!" });

  let nextDate = new Date(date);

  const showtimesMovies = await Showtime.find({
    $and: [
      {
        date: {
          $gte: date,
          $lt: nextDate.setDate(currentDate.getDate() + 1),
        },
      },
      { movieId: movieId},
    ],
  })
    .populate("movieId")
    .populate("roomId");

  showtimesMovies.sort(function (a, b) {
    const aHour = a.time?.split(":")[0];
    const bHour = b.time?.split(":")[0];
    if (aHour == bHour) return a.time?.split(":")[1] - b.time?.split(":")[1];
    return aHour - bHour;
  });
 const cinemas = await Cinema.find();
 
  const showtimes = [];
  for (const showtime of showtimesMovies) {
    if(!showtime.roomId) continue;
    const cinema = cinemas.find(cinema=>cinema._id.equals(showtime.roomId.cinema))

    showtimes.push({
      showtimeID: showtime._id,
      time: showtime.time,
      timeEnd: showtime.time_end,
      movie: showtime.movieId,
      cinemaID: cinema.name,
      datetime: showtime.date,
    });
  }

  res.status(200).json(showtimes);
});


const getShowtimeByCinemaXamarin = asyncHandler(async (req, res) => {
  const { date, cinemaId } = req.params;

  if (!date && !cinemaId)
    return res.status(400).json({ message: "cinemaId, date is required!" });
  let currentDate = new Date(date);
  console.log(currentDate);
  let nextDate = new Date(date);
  const showtimes = [];
  const cinema = await Cinema.findById(cinemaId);
  const movies = await Movie.find();

  for (const movie of movies) {
    const filter = {
      $and: [
        {
          date: {
            $gte: date,
            $lt: nextDate.setDate(currentDate.getDate() + 1),
          },
        },

        { roomId: { $in: cinema.rooms } },
        { movieId: { $eq: movie._id } },
      ],
    };

    const showtimesMovies = await Showtime.find(filter)
      .populate("movieId")
      .populate("roomId");

    showtimesMovies.sort(function (a, b) {
      const aHour = a.time?.split(":")[0];
      const bHour = b.time?.split(":")[0];
      if (aHour == bHour) return a.time?.split(":")[1] - b.time?.split(":")[1];
      return aHour - bHour;
    });

    showtimes.push({
      movie: movie,
      time: [...showtimesMovies].time,
      timeEnd: [...showtimesMovies].time_end,
      // cinemaID: cinema.name,
      // showtimes: [...showtimesMovies],
    });
  }
  res.json(showtimes);
});

module.exports = {
  getShowtimesByProvince,
  getShowtimeByCinema,
  getOneShowtime,
  createNewShowtime,
  deleteShowtime,
  getShowtimeByDay,
  getShowtimeByCinemaXamarin,
  getShowtimeByMovie
};
