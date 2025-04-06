import express from "express";
import {
  fetchAllPosts,
  fetchAllStories,
  fetchUserDetails,
  createPost,
  createStory,
  likePost,
  unlikePost,
  addComment,
} from "../controllers/postController.js";
import { upload } from "../middleware/uploadMiddleware.js"; // Import multer middleware for file uploads

const router = express.Router();

// ✅ Create Post & Story
router.post("/createPost", upload.single("file"), createPost); // File upload for posts
router.post("/createStory", upload.single("file"), createStory); // File upload for stories

// ✅ Fetch Data
router.get("/fetchAllPosts", fetchAllPosts); // Fetch all posts
router.get("/fetchAllStories", fetchAllStories); // Fetch all stories
router.post("/fetchUserDetails", fetchUserDetails); // Fetch user details (name + image)

// ✅ Like, Unlike, and Comment
router.post("/like", likePost); // Like a post
router.post("/unlike", unlikePost); // Unlike a post
router.post("/comment", addComment); // Add a comment to a post

export default router;