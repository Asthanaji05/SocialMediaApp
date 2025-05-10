import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";

const GoogleSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || "");
      setGoogleId(location.state.googleId || "");
    }
  }, [location.state]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API.defaults.baseURL}/users/google-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId,
          email,
          password,
          userName,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("token", data.token);
      setUser({ ...data.user, token: data.token });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-8 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold text-center">Complete Your Signup</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 border rounded bg-gray-100"
          />
          <input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Register
          </button>
        </form>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default GoogleSignup;
