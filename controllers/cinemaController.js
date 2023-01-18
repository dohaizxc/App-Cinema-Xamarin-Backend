const Province = require("../models/Province");
const Cinema = require("../models/Cinema");
const asyncHandler = require("express-async-handler");

const getAllCinemas = asyncHandler(async (req, res) => {
  const cinemas = await Cinema.find().populate("province").populate("rooms");
  if (!cinemas) return res.status(400).json({ message: "No cinemas found" });
  const newCinema = cinemas.map((cinema) => {
    return {
      cinemaID: cinema._id,
      address: cinema.address,
      provinceID: cinema.province.name,
      cinemaName: cinema.name,
      address_url: cinema.address_url
    };
  });
  res.json(newCinema);
});
const getOneCinemas = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const cinema = await Cinema.findById(id)
    .populate("province")
    .populate("rooms");
  if (!cinema) return res.status(400).json({ message: "No cinemas found" });

  res.json(cinema);
});

const createNewCinema = asyncHandler(async (req, res) => {
  const { name, provinceId, address, address_url } = req.body;
  if (!name || !provinceId || !address || !address_url)
    return res
      .status(400)
      .json({ message: "name, provinceId, address are required!" });
  const province = await Province.findById(provinceId).exec();
  if (!province)
    return res.status(400).json({ message: "provinceId is not correct" });
  const cinema = await Cinema.create({
    name: name,
    address: address,
    province: provinceId,
    address_url: address_url,
  });
  if (cinema) {
    province.cinemas.push(cinema);
    await province.save();
    res.status(201).json({ message: `New cinema ${name} created` });
  } else {
    res.status(400).json({ message: "invalid cinema received" });
  }
});

const updateCinema = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, address, provinceId, address_url } = req.body;
  if (!id || !address || !provinceId || !name)
    return res
      .status(400)
      .json({ message: "id ,name, address, provinceId are required!" });

  const cinema = await Cinema.findById(id).exec();
  if (!cinema) return res.status(400).json({ message: "Cinema not found" });
  const province = await Province.findById(provinceId).exec();
  if (!province)
    return res.status(400).json({ message: "provinceId is not exact" });

  cinema.name = name;
  cinema.address = address;
  cinema.provinceId = provinceId;
  cinema.address_url = address_url;
  await cinema.save();
  res.json({ message: `${name} updated` });
});

const deleteCinema = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("Cinema id is required!");
  const cinema = await Cinema.findById(id).exec();
  if (!cinema) return res.status(400).json({ message: "Cinema not found" });
  const result = cinema.deleteOne();

  res.json(`${result.name} is deleted!`);
});

module.exports = {
  getAllCinemas,
  getOneCinemas,
  createNewCinema,
  updateCinema,
  deleteCinema,
};
