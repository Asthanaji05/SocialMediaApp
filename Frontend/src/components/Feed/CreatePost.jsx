import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/UI/Loading";
import API from "../../utils/api.js";
import { Image, Video, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreatePost = ({ onPostCreated = () => { } }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { primaryColor } = useTheme();
  const { user } = useAuth();

  // -- State --
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("text"); // 'text', 'image', 'video'
  const [isFocused, setIsFocused] = useState(false);

  // -- Handlers --
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const type = selectedFile.type.startsWith("image") ? "image" : selectedFile.type.startsWith("video") ? "video" : null;
      if (type) {
        setFile(selectedFile);
        setFileType(type);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileType("text");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSubmit = async () => {
    if (!description.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("description", description);

      if (file) {
        formData.append("file", file);
        formData.append("fileType", fileType);
      } else {
        formData.append("fileType", "text");
      }

      const res = await API.post("/posts/createPost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostCreated(res.data.post);
      // Reset
      setDescription("");
      setFile(null);
      setFileType("text");
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (!user || !user._id) return <Loading />;

  return (
    <div
      className={`
            bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 mb-6 transition-all duration-300
            ${isFocused ? "border-[var(--primary-color)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]" : "hover:border-white/20"}
        `}
    >
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="shrink-0">
          {user.image ? (
            <img
              src={user.image}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/10">{user.firstName?.[0]}</div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What's brewing in your universe?"
            className="w-full bg-transparent text-white placeholder-gray-500 text-lg resize-none focus:outline-none min-h-[60px] font-sans"
            rows={isFocused || description ? 3 : 1}
          />

          {/* File Preview */}
          {file && (
            <div className="relative mt-2 rounded-xl overflow-hidden max-h-64 border border-white/10 group">
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>
              {fileType === 'image' ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={URL.createObjectURL(file)} controls className="w-full h-full" />
              )}
            </div>
          )}

          {/* Toolbar */}
          <div className={`flex items-center justify-between mt-3 pt-3 border-t border-white/5 ${!isFocused && !description && !file ? "hidden" : "flex"}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[var(--primary-color)] p-2 rounded-full hover:bg-[var(--primary-color)]/10 transition-colors"
                title="Add Media"
              >
                <Image size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!description.trim() && !file}
              className="rounded-full px-6 bg-[var(--primary-color)] text-black hover:bg-[var(--primary-color)]/90 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post <Send size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
