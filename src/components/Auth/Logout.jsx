import React from "react";

const Logout = () => {
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      // await fetch("http://localhost:3000/auth/logout", {
      //   method: "GET",
      //   credentials: "include", // Include credentials for session-based logout
      // });

      // Remove the token from local storage
      localStorage.removeItem("token");

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
