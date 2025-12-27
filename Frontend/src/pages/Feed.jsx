import React, { useEffect, useState } from "react";
import Post from "../components/Feed/Post";
import CreatePost from "../components/Feed/CreatePost";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";
import Loading from "../components/UI/Loading";
import { Link } from "react-router-dom";
import { Flame, Compass, Bookmark, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validating User Session
        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await API.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } });
          setUser(userRes.data);
        }

        // Fetching Content
        const postsRes = await API.get("/posts/fetchAllPosts");
        setPosts(postsRes.data);

      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const addNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (!user) return <Loading />

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* --- LEFT SIDEBAR (Navigation) --- */}
        <div className="hidden lg:block col-span-1 sticky top-24 h-fit">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            {/* Mini Profile */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/5">
              {user.image ? (
                <img src={user.image} className="w-12 h-12 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white font-bold">{user.firstName?.[0]}</div>
              )}
              <div>
                <h3 className="font-bold text-white text-lg">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-500">@{user.userName}</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-2">
              <NavLink icon={Compass} label="Explore" active />
              <NavLink icon={Flame} label="Popular" />
              <NavLink icon={Bookmark} label="Bookmarks" />
              <NavLink icon={Users} label="My Circles" />
            </nav>
          </div>
        </div>

        {/* --- CENTER FEED --- */}
        <div className="col-span-1 lg:col-span-2 max-w-2xl mx-auto w-full">
          <CreatePost onPostCreated={addNewPost} />

          <div className="space-y-6">
            {posts.map((post) => (
              <Post
                key={post._id}
                {...post}
              />
            ))}
            {posts.length === 0 && !loading && (
              <div className="text-center py-20 text-gray-500">
                <p className="font-nerko text-2xl mb-2">It's quiet here...</p>
                <p>Be the first to spark a conversation.</p>
              </div>
            )}
            {loading && <Loading />}
          </div>
        </div>

        {/* --- RIGHT SIDEBAR (Trending) --- */}
        <div className="hidden lg:block col-span-1 sticky top-24 h-fit">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-[var(--primary-color)]" size={20} />
              <h3 className="font-bold font-nerko text-xl">Trending in Moscownpur</h3>
            </div>

            <div className="space-y-6">
              <TrendingItem topic="Worldbuilding" count="2.4k posts" />
              <TrendingItem topic="#MoscownpurCircles" count="1.8k posts" />
              <TrendingItem topic="AI Storytelling" count="900 posts" />
              <TrendingItem topic="Character Design" count="850 posts" />
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-xs text-gray-600">
              © 2024 Moscownpur Circles. <br /> All rights reserved.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-components for Sidebar
const NavLink = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const TrendingItem = ({ topic, count }) => (
  <div className="group cursor-pointer">
    <p className="font-bold text-gray-200 group-hover:text-[var(--primary-color)] transition-colors">{topic}</p>
    <p className="text-xs text-gray-500">{count}</p>
  </div>
);

export default Feed;
