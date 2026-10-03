const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// Get or search all users
// GET /api/user?search=
// Protected route
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      }
    : {};

  // Don't show the currently logged-in user in search results
  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user._id },
  }).select("-password");

  return res.status(200).json(users);
});

// Register a new user
// POST /api/user
// Public route
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  // Check whether the email is already registered
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    // An empty string would fail validation; undefined lets the schema default apply
    pic: pic || undefined,
  });

  if (!user) {
    res.status(400);
    throw new Error("User could not be created");
  }

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    pic: user.pic,
    token: generateToken(user._id),
  });
});

// Authenticate/login user
// POST /api/user/login
// Public route
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  }

  res.status(401);
  throw new Error("Invalid Email or Password");
});

module.exports = {
  allUsers,
  registerUser,
  authUser,
};