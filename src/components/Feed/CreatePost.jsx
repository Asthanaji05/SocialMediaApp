import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [postData, setPostData] = useState({
    userId: "",
    description: "",
    file: "",
  });

  useEffect(() => {
    if (user && user.id) {
      setPostData((prevData) => ({ ...prevData, userId: user.id }));
    }
  }, [user]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.description) return alert("Description is required!");
  
    console.log("User:", user);
    console.log("Post Data:", postData);
  
    try {
      const res = await axios.post("http://localhost:3000/posts/createPost", postData);
      onPostCreated(res.data);
      setPostData((prevData) => ({ ...prevData, description: "", file: "" }));
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <input
        type="text"
        name="description"
        placeholder="What's on your mind?"
        value={postData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Post
      </button>
    </div>
  );
};

export default CreatePost;
