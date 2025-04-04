import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GooglePasswordVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const googleId = queryParams.get("googleId");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, googleId }),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Password verification failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handlePasswordSubmit}>
        <h2>Enter Password to Link Google Account</h2>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Verify & Continue</button>
      </form>
    </div>
  );
};

export default GooglePasswordVerification;