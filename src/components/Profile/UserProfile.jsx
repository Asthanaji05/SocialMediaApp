import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Settings, MapPin, Link as LinkIcon } from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from localStorage
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set the user data
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className=" min-h-screen flex items-center justify-center bg-black text-white px-6 py-10">
        <Link to="/login" className="underline text-[var(--primary-color)] hover:text-[var(--primary-color)]">
        <button className="mt-6 px-6 py-3 rounded-full bg-[var(--primary-color)] text-black font-semibold hover:bg-opacity-80">
          Login Now
        </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-20 px-4">
      <div className="bg-black text-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-5">
            <img
              src={user.image || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white">@{user.userName || "username"}</p>
              <div className="flex items-center mt-2 text-sm text-gray-200">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{user.address || "Location not set"}</span>
                <LinkIcon className="h-4 w-4 ml-4 mr-1" />
                <a href="#" className="text-indigo-600">
                  {user.website || "website.com"}
                </a>
              </div>
            </div>
          </div>
          <Link to="/edit-profile">
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-white hover:bg-gray-50 hover:text-[var(--primary-color)] bg-[var(--primary-color)]">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
          </Link>

        </div>

        <div className="mt-6">
          <p className="text-gray-200">{user.about || "No bio available"}</p>
        </div>

        <div className="mt-6 flex space-x-6">
          <div>
            <span className="font-bold text-gray-200">{user.posts?.length || 0}</span>
            <span className="ml-1 text-gray-300">Posts</span>
          </div>
          <div>
            <span className="font-bold text-gray-200">{user.followers?.length || 0}</span>
            <span className="ml-1 text-gray-300">Followers</span>
          </div>
          <div>
            <span className="font-bold text-gray-200">{user.following?.length || 0}</span>
            <span className="ml-1 text-gray-300">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;