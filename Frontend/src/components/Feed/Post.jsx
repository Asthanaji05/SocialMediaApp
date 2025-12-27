import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import { useAuth } from "../../contexts/AuthContext";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2, PenLine, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id;

  // -- State --
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState(comments || []);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  // -- Effects --
  useEffect(() => {
    // Check if liked by current user
    if (likes && likes.includes(currentUserId)) {
      setLiked(true);
    }
  }, [likes, currentUserId]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!currentUserId) return;
      try {
        const res = await API.get(`/users/${currentUserId}/saved-posts`);
        const savedIds = res.data.map(p => p._id);
        setSaved(savedIds.includes(_id));
      } catch (err) { }
    };
    checkSavedStatus();
  }, [currentUserId, _id]);

  // -- Handlers --
  const handleLikeToggle = async () => {
    try {
      if (liked) {
        const res = await API.post("/posts/unlike", { postId: _id, userId: currentUserId });
        setLiked(false);
        setLikeCount(res.data.likes.length);
      } else {
        const res = await API.post("/posts/like", { postId: _id, userId: currentUserId });
        setLiked(true);
        setLikeCount(res.data.likes.length);
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveToggle = async () => {
    try {
      if (saved) {
        await API.post("/posts/unsave", { postId: _id, userId: currentUserId });
        setSaved(false);
      } else {
        await API.post("/posts/save", { postId: _id, userId: currentUserId });
        setSaved(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const commentUserName = storedUser?.userName || "Creator";

      const res = await API.post("/posts/comment", {
        postId: _id,
        userId: currentUserId,
        userName: commentUserName,
        text: newComment,
      });

      setCommentList([...commentList, {
        userId: currentUserId,
        userName: commentUserName,
        text: newComment,
        createdAt: new Date()
      }]);
      setNewComment("");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this thought from existence?")) return;
    try {
      await API.delete("/posts/deletePost", { data: { postId: _id, userId: currentUserId } });
      // Ideally trigger a refresh in parent, but for now just alert
      // In a real app we'd use a callback or global state
      alert("Deleted");
    } catch (err) { console.error(err); }
  }

  const handleEdit = async () => {
    try {
      await API.put("/posts/editPost", { postId: _id, userId: currentUserId, description: editedDescription });
      setIsEditing(false);
    } catch (err) { console.error(err); }
  }

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/share/${shareToken}`;
    await navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard! Share it with your circle.");
  }


  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--primary-color)]/30 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)] transition-all duration-300">

      {/* --- Header --- */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div
            className="cursor-pointer"
            onClick={() => navigate(userId === currentUserId ? '/profile' : `/profile/${userId}`)}
          >
            {userPic ? (
              <img src={userPic} alt={userName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">{userName?.[0]}</div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3
                className="font-bold text-white hover:underline cursor-pointer text-base"
                onClick={() => navigate(userId === currentUserId ? '/profile' : `/profile/${userId}`)}
              >
                {userName}
              </h3>
              <span className="text-xs text-gray-500">• {new Date(createdAt).toLocaleDateString()}</span>
            </div>
            {/* <p className="text-xs text-gray-500">@{userName?.toLowerCase().replace(/\s/g, '')}</p> */}
          </div>
        </div>

        {/* Options Dropdown */}
        {currentUserId === userId && (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-500 hover:text-white outline-none">
              <MoreHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border border-white/10 text-white">
              <DropdownMenuItem onClick={() => setIsEditing(true)} className="hover:bg-white/10 cursor-pointer">
                <PenLine className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-500 hover:bg-white/10 cursor-pointer">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* --- Content --- */}
      <div className="px-4 pb-2">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedDescription}
              onChange={e => setEditedDescription(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg p-2 text-white"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleEdit} className="bg-[var(--primary-color)] text-black hover:bg-[var(--primary-color)]/80">Save</Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-sans">
            {description}
          </p>
        )}
      </div>

      {/* Media */}
      {file && (
        <div className="mt-3 w-full">
          {fileType === 'image' ? (
            <img src={`${API.defaults.baseURL}${file}`} alt="Post" className="w-full object-cover max-h-[500px]" />
          ) : (
            <video src={`${API.defaults.baseURL}${file}`} controls className="w-full max-h-[500px]" />
          )}
        </div>
      )}

      {/* --- Actions --- */}
      <div className="p-4 pt-3 flex justify-between items-center text-gray-500">
        <div className="flex gap-6">

          {/* Like / Appreciation */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 transition-colors ${liked ? "text-[var(--primary-color)]" : "hover:text-[var(--primary-color)]"}`}
          >
            <Heart size={20} className={liked ? "fill-[var(--primary-color)]" : ""} />
            <span className="text-sm font-medium">{likeCount || "0"}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-[var(--primary-color)] transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{commentList.length || ""}</span>
          </button>

          {/* Share */}
          <button onClick={handleShare} className="hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleSaveToggle}
          className={`transition-colors ${saved ? "text-[var(--primary-color)]" : "hover:text-[var(--primary-color)]"}`}
        >
          <Bookmark size={20} className={saved ? "fill-[var(--primary-color)]" : ""} />
        </button>
      </div>

      {/* --- Comments Section --- */}
      {showComments && (
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">

          {/* Comment Input */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Add to the discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-transparent border-b border-white/20 focus:border-[var(--primary-color)] outline-none text-white py-2 text-sm transition-colors"
            />
            <button onClick={handleCommentSubmit} className="text-[var(--primary-color)] opacity-80 hover:opacity-100 disabled:opacity-30" disabled={!newComment.trim()}>
              <Send size={18} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {commentList.map((c, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {c.userName?.[0]}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    <span className="text-white font-semibold mr-2">{c.userName}</span>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">{c.text}</p>
                </div>
              </div>
            ))}
            {commentList.length === 0 && <p className="text-xs text-center text-gray-600 italic">No comments yet. Start the conversation.</p>}
          </div>
        </div>
      )}

    </div>
  );
};

Post.propTypes = {
  // Add prop types if you want strict checking, skipping for brevity in this refactor
};

export default Post;
