const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// Get all messages of a chat
// GET /api/message/:chatId
// Protected route
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name pic email")
      .populate("chat");

    return res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create a new message
// POST /api/message
// Protected route
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    // Create the message in MongoDB
    let message = await Message.create(newMessage);

    // Mongoose 6+ / current versions:
    // execPopulate() is no longer used.
    message = await message.populate([
      {
        path: "sender",
        select: "name pic email",
      },
      {
        path: "chat",
      },
    ]);

    // Populate all users of the chat
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Keep the latest message reference in the chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    return res.status(201).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  allMessages,
  sendMessage,
};