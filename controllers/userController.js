const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const register = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password, phoneNumber, name, dayOfBirth, gender } = req.body;
  if (!email || !password || !phoneNumber || !name)
    return res
      .status(400)
      .json("email, password, phoneNumber,name are required!");

  const foundUser = await User.findOne({ email: email });
  if (foundUser) return res.status(400).json({ message: "email is existed" });

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email,
    password: hashPassword,
    phoneNumber: phoneNumber,
    name: name,
    dayOfBirth: dayOfBirth,
    gender: gender,
  });

  if (user) {
    res.status(201).json({ message: `${email} register successfully` });
  } else {
    res.status(400);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ active: true }).populate("tickets");
  if (!users) return res.status(400).json({ message: "No users found" });

  res.json(users);
});
const getOneUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).populate("tickets");
  if (!user) return res.status(400).json({ message: "No users found" });

  const total = user?.tickets.reduce(
    (total, ticket) => total + ticket.totalTicket + ticket.totalFood,
    0
  );
  console.log({ total });

  const newUser = {
    _id: user._id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    dayOfBirth: user.dayOfBirth,
    phoneNumber: user.phoneNumber,
    total: total
  }
  console.log(newUser);
  res.json(newUser);
});

const updateUser = asyncHandler(async (req, res) => {
  console.log("req.body")
  console.log(req.body)
  const id = req.params.id;
  const {phoneNumber, name, dayOfBirth, gender} = req.body;
  if (!phoneNumber || !name)
    return res
      .status(400)
      .json("phoneNumber,name are required!");

  const user = await User.findById(id);
  if (!user) return res.status(400).json({ message: "user not found" });
  user.name = name;
  user.phoneNumber = phoneNumber;
  user.dayOfBirth = dayOfBirth;
  user.gender = gender;
  await user.save();
  res.json({ message: `${name} updated` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json("User id is required!");
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: "User not found" });
  user.active = false;
  user.save();

  res.json(`${result.name} is deleted!`);
});

module.exports = {
  register,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
};
