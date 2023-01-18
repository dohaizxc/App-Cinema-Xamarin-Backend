const asyncHandler = require("express-async-handler");
const Ticket = require("../models/Ticket");
const Showtime = require("../models/Showtime");
const Cinema = require("../models/Cinema");
const User = require("../models/User");

const createTicket = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { showtime, user, seat, foods, paymentMethod } = req.body;
  console.log("aaaaa", { seat });
  if (!showtime || !user || !seat)
    return res
      .status(400)
      .json({ message: "Showtime, user, seat are required!" });

  const showtimeFound = await Showtime.findById(showtime)
    .populate("roomId")
    .populate("movieId")
    .populate("roomId");
  const userFound = await User.findById(user).exec();

  if (!showtimeFound || !userFound)
    return res
      .status(400)
      .json({ message: "showtime, showtime are not correct" });



  const date = new Date(showtimeFound.date);
  const formatDate = date.toLocaleDateString();

  const seatIDs = seat.map((item) => item.id);

  const cinema = await Cinema.findById(showtimeFound.roomId.cinema);
  for (oneSeat of seatIDs) {
    if (showtimeFound.seats.includes(oneSeat))
      return res.status(400).json({ message: `Ghế  bạn chọn đã có người đặt` });
  }

  const foodNames = foods?.map((item) => item.foodName + " x" + item.quantity);
  const totalFood = foods?.reduce((a, b) => a + b.price * b.quantity, 0) || 0;
  const totalTicket = seat.reduce((a, b) => a + b.price, 0);
  const total = totalFood + totalTicket;
  const ticket = await Ticket.create({
    Showtime: showtime,
    user: user,
    seat: seatIDs.join(", "),
    foods: foods ? foodNames.join(", ") : "",

    movieName: showtimeFound.movieId.name,
    cinemaName: cinema.name,
    movieImage: showtimeFound.movieId.image,
    room: showtimeFound.roomId.name,

    time:
      showtimeFound.time +
      " - " +
      showtimeFound.time_end +
      " ~ " +
      showtimeFound.movieId.duration +
      " phút",
    date: formatDate,
    totalTicket: totalTicket,
    totalFood: totalFood,
    total: total,
    paymentMethod: paymentMethod,
    id: Date.now(),
  });

  if (ticket) {
    showtimeFound.tickets.push(ticket);

    if (!showtimeFound.seats) {
      showtimeFound.seats = [...seatIDs];
    } else showtimeFound.seats = [...showtimeFound.seats, ...seatIDs];
    await showtimeFound.save();
    userFound.tickets.push(ticket);
    await userFound.save();

    res.status(201).json( ticket);
  } else {
    res.status(400).json({ message: "invalid showtime received" });
  }

  console.log("333333333", ticket);
});

const getOneTicket = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const ticket = await Ticket.findById(id);
  if (!ticket) return res.status(400).json({ message: "No ticket found" });
 const getTicket = {
    movieImage: ticket.movieImage,
    movieName: ticket.movieName,
    cinemaName: ticket.cinemaName,
    seat: ticket.seat,
    time: ticket.time,
    date: ticket.date,
    totalTicket: ticket.totalTicket,
    totalFood: ticket.totalFood,
    paymentMethod: ticket.paymentMethod,
    id: ticket.id.toString(),
    foods: ticket.foods,
  };

 
  res.json(ticket);
  console.log("444444", ticket);
});

const getTicketByUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).populate("tickets");
  if (!user) return res.status(400).json({ message: "User not found" });

  res.json(user.tickets.reverse());
});

module.exports = {
  createTicket,
  getOneTicket,
  getTicketByUser,
};
