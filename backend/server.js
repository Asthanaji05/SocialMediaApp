import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "passport";
import configurePassport from "./config/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";  // Ensure CORS is handled
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS Middleware to allow cookies in frontend
app.use(cors({
    origin: "http://localhost:5173",  // Ensure frontend URL is correct
    credentials: true,
}));

// Session Configuration with MongoDB Store
app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultSecret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Persist sessions
        cookie: {
            secure: false,  // Set true in production with HTTPS
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000  // 1 day
        }
    })
);

// Passport Initialization
// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Persist sessions
  cookie: {
      secure: false,  // Set true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000  // 1 day
  }
}));

// Passport Initialization (AFTER session middleware)
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    
  res.send("Backend is running!");
});
import userRoutes from "./routes/userRoutes.js";

app.use("/users", userRoutes);

import postRoutes from "./routes/postRoutes.js";
app.use("/posts", postRoutes);


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
