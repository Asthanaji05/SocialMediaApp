import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
const EditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phone: "",
    address: "",
    about: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API.defaults.baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.defaults.baseURL}/users/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        navigate("/profile");
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Edit Profile</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {["firstName", "lastName", "userName", "phone", "address", "about"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field}
              value={userData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ))}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
