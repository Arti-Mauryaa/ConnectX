const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Create or fetch a one-to-one chat
// POST /api/chat
// Protected route
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // Check if a private chat already exists between both users
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // Populate sender information of the latest message
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res.status(200).json(isChat[0]);
  }

  // Create a new private chat if it doesn't exist
  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({
      _id: createdChat._id,
    }).populate("users", "-password");

    return res.status(201).json(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Fetch all chats for the logged-in user
// GET /api/chat
// Protected route
const fetchChats = asyncHandler(async (req, res) => {
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // Populate sender information of the latest message
    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    return res.status(200).json(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create a new group chat
// POST /api/chat/group
// Protected route
const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  let parsedUsers;

  try {
    parsedUsers = JSON.parse(users);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid users data",
    });
  }

  if (parsedUsers.length < 2) {
    return res.status(400).json({
      message: "More than 2 users are required to form a group chat",
    });
  }

  // Add the logged-in user as the group admin/member
  parsedUsers.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Rename a group
// PUT /api/chat/rename
// Protected route
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).json({
      message: "Chat ID and chat name are required",
    });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      message: "Chat Not Found",
    });
  }

  // Only the group admin can rename the group
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Only the group admin can rename the group",
    });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  return res.status(200).json(updatedChat);
});

// Remove a user from a group
// PUT /api/chat/groupremove
// Protected route
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      message: "Chat Not Found",
    });
  }

  const isAdmin =
    chat.groupAdmin.toString() === req.user._id.toString();

  // Admin can remove anyone; a user can remove themselves (leave group)
  if (!isAdmin && userId !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Only admins can remove other users",
    });
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  return res.status(200).json(removed);
});

// Add a user to a group
// PUT /api/chat/groupadd
// Protected route
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      message: "Chat Not Found",
    });
  }

  // Only the group admin can add new members
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Only admins can add users",
    });
  }

  // Prevent adding the same user twice
  if (chat.users.some((id) => id.toString() === userId)) {
    return res.status(400).json({
      message: "User is already in the group",
    });
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  return res.status(200).json(added);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};