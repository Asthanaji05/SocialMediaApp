import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { useAuth } from "../../contexts/AuthContext";

import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/UI/Loading";
import API from "../../utils/api.js";

const CreatePost = ({ onPostCreated = () => { } }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { primaryColor } = useTheme();

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      setPostData((prevData) => ({ ...prevData, userId: user._id }));
    }
  }, [user]);


  const [postData, setPostData] = useState({
    userId: "",
    description: "",
    file: "",
    fileType: "text",
  });
  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
          ? "video"
          : null;

      if (!fileType) {
        console.log("Unsupported file type selected.");
        return;
      }

      setPostData({ ...postData, file, fileType }); // Store the file and its type
    } else {
      console.log("No file selected.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postData.description) {
      console.log("Description is required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", postData.userId);
      formData.append("description", postData.description);

      // Only append file and fileType if a file is selected
      if (postData.file) {
        formData.append("file", postData.file);
        formData.append("fileType", postData.fileType);
      } else {
        formData.append("fileType", "text"); // Default to "text" if no file is uploaded
      }

      const res = await API.post("/posts/createPost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostCreated(res.data);
      setPostData({ userId: postData.userId, description: "", file: "", fileType: "text" });
      fileInputRef.current.value = null; // Clear file input
      navigate("/feed");
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
    }
  };
  if (!user || !user._id) return <Loading />; // Show a loader here
  return (
    <div className="bg-[var(--primary-color)] p-4 rounded-md shadow-lg mb-4 border border-black">
      <p className="mb-2 text-white text-2xl font-bold">
        What's happening? Share your thoughts below:
      </p>
      <input
        type="text"
        name="description"
        placeholder="Tell me your thoughts..."
        value={postData.description}
        onChange={handleChange}
        className="w-full p-2 bg-black border border-[var(--primary-color)] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white mb-4"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="w-full p-2 bg-black border border-[var(--primary-color)] rounded text-white focus:outline-none focus:ring-2 focus:ring-white mb-4"
      />
      {postData.file && (
        <img
          src={URL.createObjectURL(postData.file)}
          alt="Preview"
          className="w-full mb-4 rounded"
        />
      )}

      <button
        onClick={handleSubmit}
        className="bg-black text-[var(--primary-color)] px-4 py-2 rounded mt-2 hover:bg-[var(--primary-color)] hover:text-black hover:border-black border transition"
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;
