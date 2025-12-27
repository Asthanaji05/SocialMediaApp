import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";  // Ensure CORS is handled

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://moscownpur-circles.onrender.com"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

app.set("io", io);

app.use(express.json());

// CORS Middleware to allow cookies in frontend
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Socket.io Connection Logic
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    // console.log(`User joined chat: ${chatId}`);
  });

  socket.on("sendMessage", (messageData) => {
    // Broadcast message to everyone in the room (including sender)
    io.to(messageData.chatId).emit("newMessage", messageData);
  });

  socket.on("readMessages", ({ chatId, userId }) => {
    // Notify others in the room that messages were read
    socket.to(chatId).emit("messagesRead", { chatId, userId });
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.get("/", (req, res) => {
    res.send("Backend is running!");
  });
}
import userRoutes from "./routes/userRoutes.js";

app.use("/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
import postRoutes from "./routes/postRoutes.js";
app.use("/posts", postRoutes);
import chatRoutes from "./routes/chatRoutes.js";
app.use("/chats", chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const listRoutes = (app) => {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Clean route path
      const routePath = middleware.route.path;
      // console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${routePath}`);
    } else if (middleware.name === 'router') {
      // If it's a router, loop through its stack and print routes
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const routePath = handler.route.path;
          // console.log(`${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${routePath}`);
        }
      });
    }
  });
};

// Log all routes
// listRoutes(app);

// Serve static files from Frontend build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve index.html for all other routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
