import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Settings, MapPin, Trash2 } from "lucide-react";
import Loading from "../UI/Loading";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import API from "../../utils/api";
const UserProfile = () => {
  const { user, setUser,logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

useEffect(() => {
  const fetchSavedPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/users/${user._id}/saved-posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedPosts(res.data);
    } catch (err) {
      // console.error("Error fetching saved posts:", err);
    }
  };

  if (user?._id) fetchSavedPosts();
}, [user]);


  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(
          `/users/top-posts/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTopPosts(res.data);
      } catch (err) {
        // console.error("Error fetching top posts:", err);
      }
    };

    if (user?._id) fetchTopPosts();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get(
            "/users/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          // console.error("Error fetching user:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const res = await API.get(
          `/users/${user._id}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
          }
        );
        setFollowingUsers(res.data);
      } catch (err) {
        // console.error("Error fetching following users:", err);
      }
    };

    if (user?._id) fetchFollowingUsers();
  }, [user]);
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    try {
      const { logout } = useAuth();
      const userId = user?._id;
      await API.delete(`/users/${userId}`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.clear();
      logout();
      navigate("/signup"); // or home/login
    } catch (error) {
      // console.error("Delete error:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6 py-10">
        <Link
          to="/login"
          className="underline text-[var(--primary-color)] hover:text-[var(--primary-color)]"
        >
          <button className="mt-6 px-6 py-3 rounded-full bg-[var(--primary-color)] text-black font-semibold hover:bg-opacity-80">
            Login Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-6 py-1">
      <div className="max-w-4xl mx-auto pt-20 px-1">
        <div className="bg-black text-white rounded-xl shadow-sm p-1 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-5">
              <img
                src={user.image || "https://picsum.photos/200/300"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {/* Username */}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-white">@{user.userName || "username"}</p>
                <div className="flex items-center mt-2 text-sm text-gray-200">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.address || "Location not set"}</span>
                  {/* <LinkIcon className="h-4 w-4 ml-4 mr-1" />
                  <a href="#" className="text-indigo-600">
                    {user.website || "website.com"}
                  </a> */}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
            <Link to="/edit-profile">
              <button className="w-36 flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-white hover:bg-gray-50 hover:text-[var(--primary-color)] bg-[var(--primary-color)]">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </Link>
            <button
              onClick={handleDeleteAccount}
              className="w-36 flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-red-600 hover:bg-gray-50  bg-black"
            >
              <Trash2 className="h-4 w-4 mr-2"/>Delete Profile
            </button>
            </div>
            
          </div>

          <div className="mt-6">
            <p className="text-gray-200">{user.about || "No bio available"}</p>
          </div>

          <div className="mt-6 flex space-x-6">
            <div>
              <span className="font-bold text-gray-200">
                {user.posts?.length || 0}
              </span>
              <span className="ml-1 text-gray-300">Posts</span>
            </div>
            <div>
              <span className="font-bold text-gray-200">
                {user.followers?.length || 0}
              </span>
              <span className="ml-1 text-gray-300">Followers</span>
            </div>
            <div>
              <span className="font-bold text-gray-200">
                {user.following?.length || 0}
              </span>
              <span className="ml-1 text-gray-300">Following</span>
            </div>
          </div>
        </div>

        {/* Following Users List */}
        <div className="bg-black text-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Following</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {followingUsers.map((followedUser) => (
              <div
                key={followedUser._id}
                className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg"
              >
                <img
                  src={followedUser.image || "https://picsum.photos/200"}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {followedUser.firstName} {followedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-400">
                    @{followedUser.userName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts Section */}
        <div className="bg-black text-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Top Posts</h2>
          {topPosts.length === 0 ? (
            <p className="text-gray-400">No top posts found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {topPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <p className="font-semibold">
                    {post.description?.slice(0, 100) || "No description"}...
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Likes: {post.likes?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Posts Section */}
<div className="bg-black text-white rounded-xl shadow-sm p-6 mb-6">
  <h2 className="text-xl font-semibold mb-4">Saved Posts</h2>
  {savedPosts.length === 0 ? (
    <p className="text-gray-400">No saved posts yet.</p>
  ) : (
    <div className="grid grid-cols-1 gap-4">
      {savedPosts.map((post) => (
        <div
          key={post._id}
          className="bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <p className="font-semibold">
            {post.description?.slice(0, 100) || "No description"}...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Likes: {post.likes?.length || 0}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default UserProfile;
