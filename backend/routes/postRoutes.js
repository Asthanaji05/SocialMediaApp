import express from "express";
import {
  fetchAllPosts,
  fetchAllStories,
  fetchUserDetails,
  createPost,
  createStory,
} from "../controllers/postController.js";

const router = express.Router();

// ✅ Create Post & Story
router.post("/createPost", createPost);
router.post("/createStory", createStory); // ✅ Added Story creation route

// ✅ Fetch Data
router.get("/fetchAllPosts", fetchAllPosts);
router.get("/fetchAllStories", fetchAllStories);
router.post("/fetchUserDetails", fetchUserDetails); // ✅ Combined Name & Image fetch
export default router;
