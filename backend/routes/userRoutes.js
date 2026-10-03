const express = require("express");

const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Search/fetch users — requires login
router.route("/").get(protect, allUsers);

// Register a new user
router.route("/").post(registerUser);

// Login existing user
router.post("/login", authUser);

module.exports = router;