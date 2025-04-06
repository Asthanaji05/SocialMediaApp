import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, MapPin, Link as LinkIcon } from "lucide-react";
import Loading from "../UI/Loading";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";

import { useParams } from "react-router-dom";

const OtherUserProfile = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [otherUser, setOtherUser] = useState(null); // yeh lo

  const { primaryColor } = useTheme();
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const yourToken = localStorage.getItem("token"); // Get the JWT token from localStorage
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${yourToken}`, // token from context or localStorage
            },
          }
        );

        setOtherUser(response.data); // Set the other user's data
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user");
      }
      setLoading(false);
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);
  const { user } = useAuth(); // Get the current user's data from context
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (otherUser?.followers?.includes(user._id)) {
      setIsFollowing(true);
    }
  }, [otherUser, user]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `http://localhost:3000/users/${endpoint}/${otherUser._id}`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className=" min-h-screen flex items-center justify-center bg-black text-white px-6 py-10">
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
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-6 py-10">
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <div className="bg-black text-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-5">
              <img
                src={otherUser.image || "https://picsum.photos/200/300"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {otherUser.firstName} {otherUser.lastName}
                </h1>
                <p className="text-white">
                  @{otherUser.userName || "username"}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-200">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{otherUser.address || "Location not set"}</span>
                  <LinkIcon className="h-4 w-4 ml-4 mr-1" />
                  <a href="#" className="text-indigo-600">
                    {otherUser.website || "website.com"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-200">
              {otherUser.about || "No bio available"}
            </p>
          </div>
          {user._id !== otherUser._id && (
            <button
              onClick={handleFollowToggle}
              className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-black rounded-md hover:bg-opacity-80"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          <div className="mt-6 flex space-x-6">
            <div>
              <span className="font-bold text-gray-200">
                {otherUser.posts?.length || 0}
              </span>
              <span className="ml-1 text-gray-300">Posts</span>
            </div>
            <div>
              <span className="font-bold text-gray-200">
                {otherUser.followers?.length || 0}
              </span>
              <span className="ml-1 text-gray-300">Followers</span>
            </div>
            <div>
              <span className="font-bold text-gray-200">
                {otherUser.following?.length || 0}
              </span>
              <span className="ml-1 text-gray-300">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
