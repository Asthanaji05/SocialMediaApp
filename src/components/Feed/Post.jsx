import React, { useState } from "react";
import axios from "axios";

import { ThumbsUp, MessageSquare, User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const Post = ({
  _id,
  userName,
  userPic,
  description,
  file,
  fileType, // Add fileType to props
  likes,
  comments,
  userId, // Add userId to props
}) => {
  const { primaryColor } = useTheme();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments || []);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const handleLike = async () => {
    try {
      const res = await axios.post("http://localhost:3000/posts/like", {
        postId: _id,
        userId: localStorage.getItem("userId"),
        userName: localStorage.getItem("userName"),
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
    <div className="bg-black text-white rounded-xl shadow-lg border border-[var(--primary-color)] overflow-hidden max-w-md mx-auto mb-6">
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
          <h2
            className="font-semibold text-[var(--primary-color)] text-2xl cursor-pointer"
            onClick={() => {
              if (userId && userId !== currentUserId) {
                navigate(`/profile/${userId}`);
              }
            }}
          >
            {userName}
          </h2>
        </div>
        <p className="mt-2 break-words">{description}</p>
      </div>

      {/* Conditional rendering for fileType */}
      {fileType === "image" && file && (
        <div className="w-full">
          <img
            src={`http://localhost:3000${file}`}
            alt="Post"
            className="w-full object-cover"
          />
        </div>
      )}
      {fileType === "video" && file && (
        <div className="w-full">
          <video
            src={`http://localhost:3000${file}`}
            controls
            className="w-full object-cover"
          />
        </div>
      )}

      {fileType === "text" && (
        <div className="p-4">
          <p className="text-gray-300">{description}</p>
        </div>
      )}

      <div className="p-4 border-t border-gray-800 flex justify-between text-sm">
        <span
          className="flex items-center gap-1 cursor-pointer text-[var(--primary-color)]"
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
          className="flex items-center gap-1 cursor-pointer text-[var(--primary-color)]"
          onClick={toggleComments}
        >
          <MessageSquare
            size={16}
            className={`${
              liked ? "text-[var(--primary-color)]" : "text-gray-400"
            }`}
          />
          {commentList.length}
        </span>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <textarea
            className="w-full p-2 rounded bg-black text-white border border-[var(--primary-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            rows="2"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCommentPost}
            className="mt-2 text-black border border-[var(--primary-color)] bg-[var(--primary-color)] px-4 py-1 rounded hover:bg-transparent hover:text-[var(--primary-color)] transition duration-200"
          >
            Post
          </button>
          {/* Render comment list */}
          <div className="mt-4 space-y-2">
            {commentList.map((comment, index) => (
              <div key={index} className="text-sm">
                <span className="font-semibold text-[var(--primary-color)]">
                  {comment.userName}:
                </span>{" "}
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
