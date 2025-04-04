import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    username: { type: String, required: true },
    userPic: { type: String },
    fileType: { type: String, enum: ["image", "video", "text"], required: true },
    file: { type: String }, // Image/Video URL
    text: { type: String, trim: true }, // Optional text for story
    viewers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who viewed
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }, // Auto-delete after 24 hours
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
