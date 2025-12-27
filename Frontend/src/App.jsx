import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import UserProfile from "./components/Profile/UserProfile";
import EditProfile from "./components/Profile/EditProfile";
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Navbar/Footer";
import SignUp from "./components/Auth/SignUp";
import OtherUserProfile from "./components/Profile/OtherUserProfile";
import Feed from "./pages/Feed";
import Story from "./components/Feed/Story";
import Post from "./components/Feed/Post";
import ChatPage from "./pages/ChatPage.jsx";
import MyNetwork from "./pages/MyNetwork";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./contexts/ThemeContext";
import GoogleSignup from "./components/Auth/GoogleSignUp.jsx";
import PostDetails from "./components/Feed/PostDetails";
import AboutMoscownpur from "./pages/AboutMoscownpur";

function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <Router>
            <NavBar /> {/* Global NavBar */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile/:userId" element={<OtherUserProfile />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<EditProfile />} />
              <Route path="/google-signup" element={<GoogleSignup />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/feed/post" element={<Post />} />
              <Route path="/feed/story" element={<Story />} />
              <Route path="/share/:token" element={<PostDetails />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/circles" element={<MyNetwork />} />
              <Route path="/circles/:userId" element={<OtherUserProfile />} />
              <Route path="/lexicon" element={<AboutMoscownpur />} />

            </Routes>
            <Footer />
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>

    </ThemeProvider>

  );
}

export default App;
