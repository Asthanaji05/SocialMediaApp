import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    userName: { type: String, required: true },
    userPic: { type: String },
    fileType: { type: String, enum: ["image", "video", "text"], required: false }, // Not required now
    file: { type: String }, // Image/Video URL
    description: { type: String, trim: true }, // Optional
    location: { type: String, trim: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store User IDs
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shareToken: { type: String, default: null },
    tags: [{ type: String, trim: true }],
    reach: { type: Number, default: 0 }, // View count / Reach
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Unique viewers
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
