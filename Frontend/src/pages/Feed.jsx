import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Feed/Post";
import Story from "../components/Feed/Story";
import CreatePost from "../components/Feed/CreatePost";
import CreateStory from "../components/Feed/CreateStory";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import UserProfile from "../components/Profile/UserProfile"
import API from "../utils/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const {user, setUser} = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts/fetchAllPosts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchStories = async () => {
      try {
        const res = await API.get("/posts/fetchAllStories");
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
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // Function to update stories after creation
  const addNewStory = (newStory) => {
    setStories([newStory, ...stories]);
  };

  return (
<>
<div className="min-h-max p-4 bg-black">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        {/* Show Create Story & Create Post Only if Logged In */}
        {user && (
          <>
            {/* <CreateStory onStoryCreated={addNewStory} /> */}
            <CreatePost onPostCreated={addNewPost} />
          </>
        )}

        {/* Stories Section */}
        {/* <div className="flex space-x-4 overflow-x-auto p-2">
          {stories.map((story, index) => (
            <Story key={index} {...story} />
          ))}
        </div> */}

        {/* Posts Section */}
        <div className="space-y-6 mt-4">
          {posts.map((post, index) => (
            <Post
            key={index}
            _id={post._id} 
            userId={post.userId}
            fileType={post.fileType}
            file={post.file}
            description={post.description}
            likes={post.likes}
            comments={post.comments}
            createdAt={post.createdAt}
            userName={post.userName}
            userPic={post.userPic}
          />
          
          ))}
        </div>
      </div>
    </div>
</>
  );
};

export default Feed;
