import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import { GoogleLogin } from "@react-oauth/google";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // 1) Email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const response = await fetch(`${API.defaults.baseURL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      setUser({ ...data.user, token: data.token });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  // 2) Google login via GoogleLogin component (preferred)
  const handleGoogleLogin = async (credentialResponse) => {
    setError(""); // Clear any previous errors
    try {
      const idToken = credentialResponse.credential;
      const decoded = parseJwt(idToken);
      if (!decoded) throw new Error("Invalid token");

      const email = decoded.email;
      const googleId = decoded.sub;

      const res = await fetch(`${API.defaults.baseURL}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      console.log("Google login response:", data);

      if (res.status !== 200) {
        if (res.status === 302 && data.redirect === "/auth/google/signup") {
          // Redirect to custom signup page with prefilled info if the user doesn't exist
          return navigate("/google-signup", {
            state: { email: data.email, googleId: data.googleId },
          });
        }
        throw new Error(data.message || "Google login failed");
      }

      // If user exists and Google login was successful, store the token and user info
      localStorage.setItem("token", data.token);
      console.log("Setting user and navigating...");
      setUser({ ...data.user, token: data.token });
      navigate("/profile");
      console.log("Navigation called");

      // Redirect to the profile page
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Email/Password Form */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="appearance-none rounded-none block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative mt-2">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className="appearance-none rounded-none block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <ArrowRight className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
            </span>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">or</span>
          </div>
        </div>

        {/* Google Login Component */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
