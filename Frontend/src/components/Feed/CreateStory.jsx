import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api.js";

const CreateStory = ({ onStoryCreated }) => {
  const { user } = useAuth();
  const [storyData, setStoryData] = useState({
    userId: user?.id || "", // Authenticated User ID
    file: "",
  });

  const handleChange = (e) => {
    setStoryData({ ...storyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyData.file) return alert("Story file is required!");

    try {
      const res = await API.post("/posts/createStory", storyData);
      onStoryCreated(res.data);
      setStoryData({ file: "" });
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <input
        type="text"
        name="file"
        placeholder="Story Image URL"
        value={storyData.file}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Add Story
      </button>
    </div>
  );
};

export default CreateStory;
