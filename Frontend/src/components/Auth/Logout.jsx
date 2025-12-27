import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api.js";
const Logout = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      // Remove the token from local storage
      localStorage.removeItem("token");
      // Clear user state in context
      logout();

      // Clear user data from local storage
      localStorage.removeItem("user");
      // Clear any other relevant data from local storage if needed

      // Redirect to the home page after logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <span
      onClick={handleLogout}
      className="text-gray-400 font-medium cursor-pointer hover:text-[var(--primary-color)] transition-colors duration-200"
    >
      Logout
    </span>


  );
};

export default Logout;
