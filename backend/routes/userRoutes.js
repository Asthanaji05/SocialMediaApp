import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserProfileByEmail,
  getUserProfileByUsername,
  getFollowingUsers,
  searchUsers,

} from "../controllers/userController.js";
import { fetchUserTopPosts as getUserTopPosts,   getSavedPosts } from "../controllers/postController.js"; // Import the getUserTopPosts function
import { verifyToken } from "../middleware/authMiddleware.js"; // Import the verifyToken middleware
// import { isAuthenticated } from '../middleware/authMiddleware.js'; // Import the isAuthenticated middleware
const router = express.Router();
// User Profile Route
router.get("/profile", verifyToken, getUserProfile);
// route
router.get("/search", verifyToken, searchUsers);
// In routes/userRoutes.js
// router.get('/:id/saved-posts', verifyToken, getSavedPosts);

// saved posts
router.get("/:userId/saved-posts/",  getSavedPosts);


router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
// Login Route
router.post("/login", loginUser);
// Follow a user
router.post("/follow/:id", verifyToken, followUser);
// Unfollow a user
router.post("/unfollow/:id", verifyToken, unfollowUser);
// Get followers of a user
router.get("/followers/:userId", verifyToken, getFollowers);
// Get following of a user
router.get("/following/:userId", verifyToken, getFollowing);
// Get user profile by ID
router.get("/profile/:id", verifyToken, getUserProfile);
// Get user profile by username
router.get("/profile/:username", verifyToken, getUserProfileByUsername);
// Get user profile by email
router.get("/profile/:email", verifyToken, getUserProfileByEmail);
// Get following users of a user
router.get("/:userId/following", verifyToken, getFollowingUsers);
// get top posts
router.get("/top-posts/:userId", verifyToken, getUserTopPosts);



export default router;
