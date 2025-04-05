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

const router = express.Router();

// ✅ Create Post & Story
router.post("/createPost", createPost);
router.post("/createStory", createStory); // ✅ Added Story creation route

// ✅ Fetch Data
router.get("/fetchAllPosts", fetchAllPosts);
router.get("/fetchAllStories", fetchAllStories);
router.post("/fetchUserDetails", fetchUserDetails); // ✅ Combined Name & Image fetch

router.post("/like", likePost);
router.post("/unlike", unlikePost);
router.post("/comment", addComment);
export default router;
