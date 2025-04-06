import Post from "../models/Post.js";
import Story from "../models/Story.js";
import User from "../models/User.js";

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
