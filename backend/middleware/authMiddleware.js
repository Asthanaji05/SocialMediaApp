/* eslint-disable no-undef */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user ID to the request object
      req.user = { userId: decoded.userId };

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  } else {
    return res.status(403).json({ message: "Forbidden, no token provided" });
  }
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User authenticated hai, proceed karo
    }
    res.status(401).json({ message: "Unauthorized" });
};