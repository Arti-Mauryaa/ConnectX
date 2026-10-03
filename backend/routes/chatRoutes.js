const express = require("express");

const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create or access a one-to-one chat
router.route("/").post(protect, accessChat);

// Fetch all chats of the logged-in user
router.route("/").get(protect, fetchChats);

// Create a new group chat
router.route("/group").post(protect, createGroupChat);

// Rename an existing group
router.route("/rename").put(protect, renameGroup);

// Remove a user from a group
router.route("/groupremove").put(protect, removeFromGroup);

// Add a user to a group
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;