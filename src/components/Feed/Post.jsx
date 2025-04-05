import React, { useState } from "react";
import axios from "axios";

import { ThumbsUp, MessageSquare, User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Post = ({
  _id,
  userName,
  userPic,
  description,
  file,
  likes,
  comments,
}) => {
  const { primaryColor } = useTheme();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments || []);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);

  const handleLike = async () => {
    try {
      const res = await axios.post("http://localhost:3000/posts/like", {
        postId: _id,
        userId: localStorage.getItem("userId"),
        userName: localStorage.getItem("userName"), // ✅ Add this line
        text: newComment,
      });

      setLiked(true);
      setLikeCount(res.data.likes.length);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const res = await axios.post("http://localhost:3000/posts/unlike", {
        postId: _id,
        userId: localStorage.getItem("userId"),
      });
      setLiked(false);
      setLikeCount(res.data.likes.length);
    } catch (error) {
      console.error("Unlike error:", error);
    }
  };
  const handleCommentChange = (e) => setNewComment(e.target.value);
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    handleCommentPost();
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleCommentPost = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const commentUserName = storedUser?.userName || "Anonymous";
      const res = await axios.post("http://localhost:3000/posts/comment", {
        postId: _id,
        userId: localStorage.getItem("userId"),
        userName: commentUserName,
        text: newComment,
      });
      // Update comment list locally
      setCommentList([
        ...commentList,
        {
          userId: localStorage.getItem("userId"),
          userName: commentUserName,
          text: newComment,
          createdAt: new Date(),
        },
      ]);
      setNewComment("");
      console.log("Comment added:", res.data);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleLikeToggle = () => {
    liked ? handleUnlike() : handleLike();
  };

  return (
    <div className="bg-white text-black rounded-xl shadow-lg border border-[var(--primary-color)] overflow-hidden max-w-md mx-auto mb-6">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {userPic ? (
            <img
              src={userPic}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-[var(--primary-color)]" />
          )}
          <h2 className="font-semibold text-[var(--primary-color)] text-2xl">{userName}</h2>
        </div>
        <p className="mt-2 text-black break-words">{description}</p>
      </div>

      {file && (
        <div className="w-full">
          <img src={file} alt="Post" className="w-full object-cover" />
        </div>
      )}

      <div className="p-4 border-t border-gray-800 flex justify-between text-black text-sm">
        <span
          className="flex items-center gap-1 cursor-pointer  text-[var(--primary-color)]"
          onClick={handleLikeToggle}
        >
          <ThumbsUp
            size={16}
            className={`${
              liked ? "text-[var(--primary-color)]" : "text-gray-400"
            }`}
          />
          {likeCount}
        </span>

        <span
          className="flex items-center gap-1 cursor-pointer"
          onClick={toggleComments}
        >
          <span
            className="flex items-center gap-1 cursor-pointer text-[var(--primary-color)]"
            onClick={toggleComments}
          >
            <MessageSquare size={16} className={`${
              liked ? "text-[var(--primary-color)]" : "text-gray-400"
            }`}/>
            {commentList.length}
          </span>
        </span>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <textarea
            className="w-full p-2 rounded bg-white text-black border border-[var(--primary-color)]"
            rows="2"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentPost}
            className="mt-2 text-[var(--primary-color)] border-[var(--primary-color)] bg-white px-4 py-1 rounded hover:bg-[var(--primary-color)] hover:text-white transition duration-200"
          >
            Post
          </button>
          {/* Render comment list */}
          <div className="mt-4 space-y-2">
            {commentList.map((comment, index) => (
              <div key={index} className="text-sm">
                <span className="font-semibold">{comment.userName}:</span>{" "}
                {comment.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
