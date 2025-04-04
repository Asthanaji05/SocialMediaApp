import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import UserProfile from "./components/Profile/UserProfile";
import EditProfile from "./components/Profile/EditProfile";
import NavBar from "./components/Navbar/NavBar";
import SignUp from "./components/Auth/SignUp";
import GooglePasswordVerification from "./components/Auth/GooglePasswordVerification";
import Feed from "./pages/Feed";
import Story from "./components/Feed/Story";
import Post from "./components/Feed/Post";
import { ThemeProvider } from "./contexts/ThemeContext";
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <NavBar /> {/* Global NavBar */}
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/post" element={<Post />} />
            <Route path="/feed/story" element={<Story />} />
            <Route path="/google-password-verification" element={<GooglePasswordVerification />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>

  );
}

export default App;
