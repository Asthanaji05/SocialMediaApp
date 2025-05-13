import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import API from "../../utils/api.js";
import {
  ThumbsUp,
  MessageSquare,
  User,
  Trash2,
  Edit3,
  Bookmark,
  BookmarkCheck,
  Share2,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Post = ({
  _id,
  userName,
  userPic,
  description,
  file,
  fileType,
  likes,
  comments,
  userId,
  createdAt,
  shareToken,
}) => {
  const { primaryColor } = useTheme();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments || []);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [editedDescription, setEditedDescription] = useState(description);
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id || null;

  // Fetch saved status on component mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const res = await API.get(`/users/${currentUserId}/saved-posts`);
        const savedPosts = res.data.map((post) => post._id);
        setSaved(savedPosts.includes(_id));
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };

    if (currentUserId) {
      checkSavedStatus();
    }
  }, [currentUserId, _id]);

  const handleLike = async () => {
    try {
      const res = await API.post("/posts/like", {
        postId: _id,
        userId: currentUserId,
      });
      setLiked(true);
      setLikeCount(res.data.likes.length);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const res = await API.post("/posts/unlike", {
        postId: _id,
        userId: currentUserId,
      });
      setLiked(false);
      setLikeCount(res.data.likes.length);
    } catch (error) {
      console.error("Unlike error:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await API.delete("/posts/deletePost", {
        data: { postId: _id, userId: currentUserId },
      });
      alert("Post deleted");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEditPost = async () => {
    try {
      await API.put("/posts/editPost", {
        postId: _id,
        userId: currentUserId,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const toggleComments = () => setShowComments(!showComments);
  const handleCommentChange = (e) => setNewComment(e.target.value);
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    handleCommentPost();
  };

  const handleCommentPost = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const commentUserName = storedUser?.userName || "Anonymous";
      const res = await API.post("/posts/comment", {
        postId: _id,
        userId: currentUserId,
        userName: commentUserName,
        text: newComment,
      });
      setCommentList([
        ...commentList,
        {
          userId: currentUserId,
          userName: commentUserName,
          text: newComment,
          createdAt: new Date(),
        },
      ]);
      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleLikeToggle = () => {
    liked ? handleUnlike() : handleLike();
  };

  const handleSave = async () => {
    try {
      await API.post("/posts/save", {
        postId: _id,
        userId: currentUserId,
      });
      setSaved(true);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleUnsave = async () => {
    try {
      await API.post("/posts/unsave", {
        postId: _id,
        userId: currentUserId,
      });
      setSaved(false);
    } catch (error) {
      console.error("Unsave error:", error);
    }
  };

const handleSharePost = async () => {
  try {
    if (!shareToken) {
      alert("Share token is missing!");
      return;
    }

    console.log("Share Token:", shareToken);

    // Make the API call to get post information
    const res = await API.get(`posts/share/${shareToken}`);
    
    if (!res.data || !res.data.postId) {
      throw new Error("Post not found");
    }

    // Construct the share link
    const shareLink = `${window.location.origin}/share/${shareToken}`;
    console.log("Share Link:", shareLink);

    // Attempt to copy the share link to the clipboard
    await navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  } catch (error) {
    console.error("Share error:", error);

    // Display a more specific error message based on the failure
    if (error.response && error.response.data && error.response.data.error) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert("An error occurred while sharing the post.");
    }
  }
};



  return (
    <div className="grid grid-cols-3 bg-black text-white w-full max-w-2xl border border-[var(--primary-color)] rounded-3xl shadow-[var(--primary-color)] overflow-hidden">
      <div className="col-span-3 bg-[var(--primary-color)] text-black p-4 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center">
          {userPic ? (
            <img
              src={userPic}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover m-1"
            />
          ) : (
            <User className="w-9 h-9 text-black bg-white rounded-full mr-3" />
          )}
          <div className="flex flex-col">
            <h2
              className="font-semibold text-xl cursor-pointer"
              onClick={() => {
                if (userId && userId !== currentUserId)
                  navigate(`/profile/${userId}`);
              }}
            >
              {userName}
            </h2>
            <p className="text-xs text-gray-700">
              {new Date(createdAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div>
          <button
              className="cursor-pointer text-black"
              onClick={handleSharePost}
            >
              <Share2 size={16} />
            </button>
        </div>
        {currentUserId === userId && (
          <div className="flex space-x-2">
            <Edit3
              className="cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
            />
            <Trash2
              className="cursor-pointer text-black"
              onClick={handleDeletePost}
            />

            
          </div>
        )}
      </div>

      <div className="col-span-3 p-4 ml-11">
        {isEditing ? (
          <div>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 rounded bg-black text-white border border-[var(--primary-color)] mb-2"
            />
            <button
              onClick={handleEditPost}
              className="text-black border border-[var(--primary-color)] bg-[var(--primary-color)] px-4 py-1 rounded hover:bg-transparent hover:text-[var(--primary-color)] transition"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="break-words">{description}</p>
        )}

        {(fileType === "image" || fileType === "video") && file && (
          <div className="w-full my-2">
            {fileType === "image" ? (
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                <img
                  src={`${API.defaults.baseURL}${file}`}
                  alt="Blur Background"
                  className="absolute top-0 left-0 w-full h-full object-cover filter blur-lg scale-110 z-0"
                />
                <img
                  src={`${API.defaults.baseURL}${file}`}
                  alt="Post"
                  className="relative z-10 w-full h-full object-contain rounded-2xl"
                />
              </div>
            ) : (
              <video
                src={`${API.defaults.baseURL}${file}`}
                controls
                className="w-full object-cover max-h-96 rounded"
              />
            )}
          </div>
        )}

        <div className="py-3 border-t border-gray-800 flex text-sm space-x-6">
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

          <span
            className="flex items-center gap-1 cursor-pointer text-[var(--primary-color)]"
            onClick={saved ? handleUnsave : handleSave}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </span>
        </div>

        {showComments && (
          <div>
            <textarea
              className="w-full p-2 rounded bg-black text-white border border-[var(--primary-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              rows="2"
              placeholder="Write your comment..."
              value={newComment}
              onChange={handleCommentChange}
            />
            <button
              onClick={handleCommentPost}
              className="mt-2 text-black border border-[var(--primary-color)] bg-[var(--primary-color)] px-4 py-1 rounded hover:bg-transparent hover:text-[var(--primary-color)] transition duration-200"
            >
              Post
            </button>
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
    </div>
  );
};

export default Post;
