const Room = require("../models/Room");
const Cinema = require("../models/Cinema");
const asyncHandler = require("express-async-handler");

const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate("cinema").populate("Showtimes");
  if (!rooms) return res.status(400).json({ message: "No rooms found" });

  res.json(rooms);
});
const getOneRooms = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const room = await Room.findById(id).populate("cinema").populate("Showtimes");
  if (!room) return res.status(400).json({ message: "No rooms found" });

  res.json(room);
});

const createNewRoom = asyncHandler(async (req, res) => {
  const { name, cinema: id } = req.body;
  if (!name)
    return res.status(400).json({ message: "name,cinema is required!" });

  const cinema = await Cinema.findById(id).exec();
  if (!cinema)
    return res.status(400).json({ message: "cinema is not correct" });
  const room = await Room.create({
    name: name,
    cinema: id,
  });
  if (room) {
    cinema.rooms.push(room);
    await cinema.save();
    res.status(201).json({ message: `New room ${name} created` });
  } else {
    res.status(400).json({ message: "invalid room received" });
  }
});

const updateRoom = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!id || !name)
    return res.status(400).json({ message: "id, name are required!" });

  const room = await Room.findById(id).exec();
  if (!room) return res.status(400).json({ message: "Room not found" });

  room.name = name;
  await room.save();
  res.json({ message: `${name} updated` });
});

const deleteRoom = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("Room id is required!");
  const room = await Room.findById(id).exec();
  if (!room) return res.status(400).json({ message: "Room not found" });
  const result = room.deleteOne();

  res.json(`${result.name} is deleted!`);
});

module.exports = {
  getAllRooms,
  getOneRooms,
  createNewRoom,
  updateRoom,
  deleteRoom,
};
