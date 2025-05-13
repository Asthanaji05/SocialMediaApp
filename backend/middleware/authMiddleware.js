/* eslint-disable no-undef */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      // token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user ID to the request object
      req.user = { userId: decoded.userId };
      // console.log("Incoming Token:", authHeader);
      // console.log("JWT_SECRET:", process.env.JWT_SECRET);

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  } else {
    return res.status(403).json({ message: "Forbidden, no token provided" });
  }
};


