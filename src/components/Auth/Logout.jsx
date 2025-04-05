import React from "react";
import { useAuth } from "../../contexts/AuthContext";
const Logout = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      // await fetch("http://localhost:3000/auth/logout", {
      //   method: "GET",
      //   credentials: "include", // Include credentials for session-based logout
      // });

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
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
