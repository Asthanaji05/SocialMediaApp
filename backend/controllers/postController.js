import Post from "../models/Post.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const SECRET_KEY = "MaitriLokSecret";

// 🔥 Fetch all posts (sorted by latest)
export const fetchAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔥 Fetch user details (Name + Image)
export const fetchUserDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("username profilePic");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔥 Fetch all stories (latest first)
export const fetchAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (error) {
    console.error("Fetch stories error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔥 Create a new post
export const createPost = async (req, res) => {
  try {
    const { userId, description, fileType } = req.body;

    // Validate fileType
    if (!["image", "video", "text"].includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const file = req.file ? `/uploads/${req.file.filename}` : null; // Use relative path

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newPost = new Post({
      userId,
      userName: user.userName,
      userPic: user.profilePic,
      fileType,
      file,
      description,
      likes: [],
      comments: [],
    });

    await newPost.save();
    // ✅ Generate Share Token
    const shareToken = jwt.sign(
      { postId: newPost._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save shareToken to post
    newPost.shareToken = shareToken;
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔥 Create a new story
export const createStory = async (req, res) => {
  try {
    const { userId, fileType, file, text } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newStory = new Story({
      userId,
      username: user.userName,
      userPic: user.profilePic,
      fileType,
      file,
      text,
      viewers: [],
    });

    await newStory.save();
    res.status(201).json({ message: "Story created successfully" });
  } catch (error) {
    console.error("Create story error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Like a post
export const likePost = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }

    res.status(200).json({ message: "Post liked", likes: post.likes });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// unlike
export const unlikePost = async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.likes = post.likes.filter((id) => id && id.toString() !== userId);
    await post.save();

    res.status(200).json({ message: "Post unliked", likes: post.likes });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// comment
export const addComment = async (req, res) => {
  const { postId, userId, userName, text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = { userId, userName, text };
    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// get post for a user
// 🔥 Fetch latest 5 posts by a user
export const fetchUserTopPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Fetch top posts error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// delete post
export const deletePost = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// edit post
export const editPost = async (req, res) => {
  const { postId, userId, description } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.description = description || post.description;
    await post.save();

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    console.error("Edit post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /posts/save
export const savePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Add the post to the user's savedPosts array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPosts: postId } }, // Prevent duplicates
      { new: true } // Return the updated user
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "Post saved", savedPosts: user.savedPosts });
  } catch (err) {
    console.error("Save post error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// POST /posts/unsave
export const unsavePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Remove the post from the user's savedPosts array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPosts: postId } }, // 👈 yeh line daalo
      { new: true }
    ).populate({
      path: "savedPosts",
      populate: {
        path: "userId",
        select: "firstName lastName userName",
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "Post unsaved", savedPosts: user.savedPosts });
  } catch (err) {
    console.error("Unsave post error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "savedPosts",
      populate: {
        path: "userId", // post ka author
        select: "firstName lastName userName image", // jo fields chahiye
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.savedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const validateShareToken = (token) => {
  try {
    console.log("Token received:", token); // Log the token to see its format
    if (!token || token.split(".").length !== 3) {
      return res.status(400).json({ error: "Malformed token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    return decoded?.postId;
  } catch (error) {
    console.error("Error verifying token:", error); // Log the error to see more details
    return null;
  }
};

// Assuming you have a function to validate the token
export const getPostIdFromShareToken = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log("Received token:", token);

    // Validate the token (you might need to decrypt it or use a different method)
    const postId = await validateShareToken(token); // Implement the validation method
    // console.log("Post ID from token:", postId);

    if (!postId) {
      return res.status(400).json({ error: "Invalid or expired share token" });
    }

    // Find the post using the postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Return the postId
    res.status(200).json({ postId: postId });
  } catch (error) {
    console.error("Share Token error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const fetchPost = async (req, res) => {
  const { postId } = req.params; // Get postId from the URL parameters
  console.log("Post ID received:", postId); // Log the postId to see its format
  try {
    const post = await Post.findById(postId); // Find the post by ID

    // If post doesn't exist, return 404
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Return the post with a 200 status code
    res.status(200).json({ data: post });
  } catch (error) {
    console.error("Fetch post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔥 Increment Reach (Unique Impression)
export const incrementReach = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id; // From verifyToken middleware

  try {
    // Attempt to update only if userId is NOT in the viewers array
    const post = await Post.findOneAndUpdate(
      { _id: postId, viewers: { $ne: userId } },
      {
        $addToSet: { viewers: userId },
        $inc: { reach: 1 }
      },
      { new: true }
    );

    // If no update happened, either post exists or user already seen it
    if (!post) {
      const existingPost = await Post.findById(postId);
      if (!existingPost) return res.status(404).json({ message: "Post not found" });
      return res.status(200).json({ reach: existingPost.reach, message: "Already seen" });
    }

    res.status(200).json({ reach: post.reach });
  } catch (error) {
    console.error("Reach update error:", error);
    res.status(500).json({ message: "Error updating reach" });
  }
};
