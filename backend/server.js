const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Frontend URLs allowed to call this API (local dev + deployed site).
// Add your Vercel URL to CLIENT_URL on Render (comma separated for more than one).
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((u) => u.trim()) : []),
];

app.use(cors({ origin: allowedOrigins }));

// Allow JSON request body
app.use(express.json());

// API routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Simple API health check
app.get("/", (req, res) => {
  res.send("ConnectX API is running..");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Socket.io setup for real-time chat
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Connect the logged-in user to their personal socket room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Join a particular chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // Show typing status to other users in the chat
  socket.on("typing", (room) => socket.in(room).emit("typing", room));

  socket.on("stop typing", (room) =>
    socket.in(room).emit("stop typing", room)
  );

  // Send new message to all users except the sender
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});