const Food = require("../models/Food");
const asyncHandler = require("express-async-handler");

const getAllFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find();
  if (!foods) return res.status(400).json({ message: "No foods found" });
  res.json(foods);
});

const createNewFood = asyncHandler(async (req, res) => {
  const { name, price, image } = req.body;
  console.log(name);
  if (!name || !price || !image) return res.status(400).json({ message: "name, price, image are required!" });
  const food = await Food.create({
    name: name,
    price: price,
    image: image,
  });
  if (food) {
    res.status(201).json({ message: `New food ${food.name} created` });
  } else {
    res.status(400).json({ message: "invalid food received" });
  }
});

module.exports = { getAllFoods, createNewFood };
