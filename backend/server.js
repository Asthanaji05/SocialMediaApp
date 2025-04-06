import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";  // Ensure CORS is handled

import path from 'path';
// Serve static files from the "uploads" directory
const __dirname = path.resolve();

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS Middleware to allow cookies in frontend
app.use(cors({
    origin: "http://localhost:5173",  // Ensure frontend URL is correct
    credentials: true,
}));



app.get("/", (req, res) => {
    
  res.send("Backend is running!");
});
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
        console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${routePath}`);
      } else if (middleware.name === 'router') {
        // If it's a router, loop through its stack and print routes
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const routePath = handler.route.path;
            console.log(`${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${routePath}`);
          }
        });
      }
    });
  };
  
  // Log all routes
  listRoutes(app);
  
  
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
