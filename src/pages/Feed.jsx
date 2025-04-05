import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Feed/Post";
import Story from "../components/Feed/Story";
import CreatePost from "../components/Feed/CreatePost";
import CreateStory from "../components/Feed/CreateStory";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/posts/fetchAllPosts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchStories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/posts/fetchAllStories");
        setStories(res.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchPosts();
    fetchStories();
  }, [setPosts, setStories]);

  // Function to update posts after creation
  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Function to update stories after creation
  const addNewStory = (newStory) => {
    setStories([newStory, ...stories]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        {/* Show Create Story & Create Post Only if Logged In */}
        {user && (
          <>
            <CreateStory onStoryCreated={addNewStory} />
            <CreatePost onPostCreated={addNewPost} />
          </>
        )}

        {/* Stories Section */}
        <div className="flex space-x-4 overflow-x-auto p-2">
          {stories.map((story, index) => (
            <Story key={index} {...story} />
          ))}
        </div>

        {/* Posts Section */}
        <div className="space-y-6 mt-4">
          {posts.map((post, index) => (
            <Post key={index} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
