import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import Loading from "../components/UI/Loading";
import API from "../utils/api";

const MyNetwork = () => {
  const { user } = useAuth();
  const { primaryColor } = useTheme();

  const [followingUsers, setFollowingUsers] = useState([]);
  const [topPostsMap, setTopPostsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) {
      setLoading(false); // Stop loading if user is not available
      return;
    }

    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const res = await API.get(`/users/${user._id}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the request headers
            },
          }
        );
        setFollowingUsers(res.data);

        const postPromises = res.data.map((u) =>
          API.get(`/users/top-posts/${u._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const allPosts = await Promise.all(postPromises);
        const postMap = {};
        res.data.forEach((u, i) => {
          postMap[u._id] = allPosts[i].data;
        });
        setTopPostsMap(postMap);
      } catch (err) {
        console.error("Error fetching network data:", err);
        setError("Failed to load network data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6 py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6 py-10">
        <p className="text-gray-400">Please log in to view your network.</p>
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
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: `var(--primary-color)` }}
      >
        My Network
      </h1>
      <div className="space-y-8">
      {followingUsers.length === 0 && (
  <p className="text-gray-400">
    You're not following anyone yet. Start exploring!
  </p>
)}

        {followingUsers.map((followedUser) => (
          <div
            key={followedUser._id}
            className="bg-zinc-900 p-4 rounded-lg shadow"
          >
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={followedUser.image || "https://picsum.photos/200"}
                className="w-12 h-12 rounded-full object-cover"
                alt="profile"
              />
              <Link
                to={`/profile/${followedUser._id}`}
                className="text-lg font-semibold hover:underline"
                style={{ color: `var(--primary-color)` }}
              >
                {followedUser.firstName} {followedUser.lastName}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPostsMap[followedUser._id]?.map((post) => (
                <div
                  key={post._id}
                  className="bg-black border border-gray-700 p-3 rounded-md"
                >
                  <p className="text-white line-clamp-3">{post.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNetwork;