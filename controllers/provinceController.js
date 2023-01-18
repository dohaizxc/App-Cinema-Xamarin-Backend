const Province = require("../models/Province");
const asyncHandler = require("express-async-handler");

const getAllProvinces = asyncHandler(async (req, res) => {
  const provinces = await Province.find().populate("cinemas");
  if (!provinces)
    return res.status(400).json({ message: "No provinces found" });

  res.json(provinces);
});
const getOneProvinces = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const province = await Province.findById(id).populate("cinemas");
  if (!province) return res.status(400).json({ message: "No Provinces found" });

  res.json(province);
});

const createNewProvince = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required!" });
  const province = await Province.create({
    name: name,
  });
  if (province) {
    res.status(201).json({ message: `New province ${name} created` });
  } else {
    res.status(400).json({ message: "invalid province received" });
  }
});

const updateProvince = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!id || !name)
    return res.status(400).json({ message: "id, name are required!" });

  const province = await Province.findById(id).exec();
  if (!province) return res.status(400).json({ message: "Province not found" });

  province.name = name;
  await province.save();
  res.json({ message: `${name} updated` });
});

const deleteProvince = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("Province id is required!");
  const province = await Province.findById(id).exec();
  if (!province) return res.status(400).json({ message: "Province not found" });
  const result = province.deleteOne();

  res.json(`${result.name} is deleted!`);
});

module.exports = {
  getAllProvinces,
  getOneProvinces,
  createNewProvince,
  updateProvince,
  deleteProvince,
};
