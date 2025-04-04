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
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pt-20 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-5">
            <img
              src={user.image || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500">@{user.userName || "username"}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
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
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
          </Link>

        </div>

        <div className="mt-6">
          <p className="text-gray-700">{user.about || "No bio available"}</p>
        </div>

        <div className="mt-6 flex space-x-6">
          <div>
            <span className="font-bold text-gray-900">{user.posts?.length || 0}</span>
            <span className="ml-1 text-gray-500">Posts</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">{user.followers?.length || 0}</span>
            <span className="ml-1 text-gray-500">Followers</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">{user.following?.length || 0}</span>
            <span className="ml-1 text-gray-500">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;