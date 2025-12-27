import React, { useEffect, useState } from "react";
import Post from "../components/Feed/Post";
import CreatePost from "../components/Feed/CreatePost";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";
import Loading from "../components/UI/Loading";
import { Link } from "react-router-dom";
import { Flame, Compass, Bookmark, TrendingUp, Users, BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import socket from "../utils/socket";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  // --- Real-time Listeners ---
  useEffect(() => {
    socket.on("newPost", (newPost) => {
      // Add the new post to the top of the feed if it's not already there
      setPosts((prev) => {
        if (prev.find(p => p._id === newPost._id)) return prev;
        return [newPost, ...prev];
      });
    });

    socket.on("updatePost", (updatedPost) => {
      setPosts((prev) => prev.map(p => p._id === updatedPost._id ? { ...p, ...updatedPost } : p));
    });

    socket.on("trendingUpdate", (newTrending) => {
      setTrending(newTrending);
    });

    return () => {
      socket.off("newPost");
      socket.off("updatePost");
      socket.off("trendingUpdate");
    };
  }, []);

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
        const [postsRes, trendingRes] = await Promise.all([
          API.get("/posts/fetchAllPosts"),
          API.get("/posts/trending")
        ]);

        setPosts(postsRes.data);
        setTrending(trendingRes.data);

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
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg truncate">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-500 truncate">@{user.userName}</p>
              </div>
              <Link to="/settings" className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-500 hover:text-white">
                <Settings size={18} />
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="space-y-2">
              <NavLink icon={Compass} label="Explore" to="/feed" active />
              <NavLink icon={Flame} label="Popular" to="/feed" />
              <NavLink icon={Bookmark} label="Bookmarks" to="/profile?tab=saved" />
              <NavLink icon={Users} label="My Circles" to="/circles" />
              <div className="pt-4 mt-4 border-t border-white/5">
                <NavLink icon={BookOpen} label="Lexicon" to="/lexicon" />
              </div>
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
              {trending.map((item) => (
                <TrendingItem
                  key={item._id}
                  topic={`#${item._id}`}
                  count={`${item.count} posts`}
                />
              ))}
              {trending.length === 0 && (
                <p className="text-sm text-gray-500 italic">Exploring for new signals...</p>
              )}
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
const NavLink = ({ icon: Icon, label, active, to = "#" }) => (
  <Link to={to} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

const TrendingItem = ({ topic, count }) => (
  <div className="group cursor-pointer flex items-center justify-between hover:bg-white/[0.02] p-2 -mx-2 rounded-xl transition-all duration-300">
    <div className="flex-1 min-w-0">
      <p className="font-bold text-gray-200 group-hover:text-[var(--primary-color)] transition-colors truncate">{topic}</p>
      <p className="text-xs text-gray-500">{count}</p>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[var(--primary-color)]">
      <Flame size={14} className="animate-pulse" />
      <span className="text-[10px] font-bold uppercase tracking-tighter">Sparking</span>
    </div>
  </div>
);

export default Feed;
