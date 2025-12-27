import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, MapPin, Trash2, Grid, Bookmark, Users, Heart, Calendar } from "lucide-react";
import Loading from "../UI/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import API from "../../utils/api";
import { Button } from "@/components/ui/button";

const UserProfile = () => {
  const { user, setUser, logout } = useAuth();
  const { primaryColor } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user?._id) return;

      try {
        const [savedRes, topRes, followingRes] = await Promise.all([
          API.get(`/users/${user._id}/saved-posts`, { headers: { Authorization: `Bearer ${token}` } }),
          API.get(`/users/top-posts/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }),
          API.get(`/users/${user._id}/following`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setSavedPosts(savedRes.data || []);
        setTopPosts(topRes.data || []);
        setFollowingUsers(followingRes.data || []);
      } catch (err) {
        // console.error(err);
      }
    };

    if (user?._id) fetchAllData();
  }, [user]);

  // Fetch updated user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } });
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);


  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your existence from Moscownpur?")) return;
    try {
      await API.delete(`/users/${user?._id}`);
      localStorage.clear();
      logout();
      navigate("/signup");
    } catch (error) { }
  };

  if (loading) return <Loading />;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-nerko text-3xl">Please Login</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[var(--primary-color)] selection:text-black pb-20">

      {/* --- PROFILE HEADER --- */}
      <div className="relative mb-20">
        {/* Banner / Cover Gradient */}
        <div
          className="h-48 w-full bg-gradient-to-b from-[var(--primary-color)]/20 to-black relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Profile Card Info - Floating */}
        <div className="absolute top-28 left-0 right-0 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end md:items-center gap-6">

            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--primary-color)] to-white rounded-full opacity-70 blur group-hover:opacity-100 transition duration-500"></div>
              <img
                src={user.image || "https://picsum.photos/200/300"}
                alt="Profile"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-black"
              />
            </div>

            {/* Text Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-4xl md:text-5xl font-nerko text-white leading-none">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400 font-borel text-lg">@{user.userName || "creator"}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.address || "Nowhere"}</span>
                <span>•</span>
                <span>Joined {new Date().getFullYear()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <Link to="/edit-profile">
                <Button variant="outline" className="rounded-full border-white/20 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] bg-black/50 backdrop-blur-md">
                  <Settings className="w-4 h-4 mr-2" /> Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="rounded-full text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* --- BIO & STATS --- */}
      <div className="max-w-4xl mx-auto px-6 mt-32 mb-12">
        {/* Bio */}
        <div className="mb-8 max-w-2xl">
          <p className="text-xl text-gray-300 font-borel leading-relaxed">
            "{user.about || "Just another creator traversing the Moscownpur universe."}"
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 md:gap-16 border-y border-white/10 py-6">
          <div className="text-center md:text-left">
            <span className="block text-3xl font-nerko text-white">{user.posts?.length || 0}</span>
            <span className="text-sm text-gray-500 uppercase tracking-widest">Creations</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl font-nerko text-white">{user.followers?.length || 0}</span>
            <span className="text-sm text-gray-500 uppercase tracking-widest">Trusting</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl font-nerko text-white">{user.following?.length || 0}</span>
            <span className="text-sm text-gray-500 uppercase tracking-widest">Trusted</span>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex gap-8 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-3 text-lg font-nerko tracking-wide transition-all relative ${activeTab === "posts" ? "text-[var(--primary-color)]" : "text-gray-500 hover:text-gray-300"}`}
          >
            Top Creations
            {activeTab === "posts" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary-color)] shadow-[0_0_10px_var(--primary-color)]"></span>}
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 text-lg font-nerko tracking-wide transition-all relative ${activeTab === "saved" ? "text-[var(--primary-color)]" : "text-gray-500 hover:text-gray-300"}`}
          >
            Saved
            {activeTab === "saved" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary-color)] shadow-[0_0_10px_var(--primary-color)]"></span>}
          </button>
          <button
            onClick={() => setActiveTab("network")}
            className={`pb-3 text-lg font-nerko tracking-wide transition-all relative ${activeTab === "network" ? "text-[var(--primary-color)]" : "text-gray-500 hover:text-gray-300"}`}
          >
            Circle ({followingUsers.length})
            {activeTab === "network" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary-color)] shadow-[0_0_10px_var(--primary-color)]"></span>}
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[300px] animate-in fade-in duration-500">
          {activeTab === "posts" && (
            topPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {topPosts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Grid} label="No creations yet. Start building." />
            )
          )}

          {activeTab === "saved" && (
            savedPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {savedPosts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Bookmark} label="Nothing saved in your vault." />
            )
          )}

          {activeTab === "network" && (
            followingUsers.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {followingUsers.map(u => (
                  <div key={u._id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:border-[var(--primary-color)]/30 transition-colors group cursor-pointer">
                    <div className="relative">
                      <img src={u.image || "https://picsum.photos/200"} className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-[var(--primary-color)] transition-all" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-white truncate font-nerko text-lg">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500 truncate font-mono">@{u.userName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Users} label="Your circle is empty." />
            )
          )}
        </div>
      </div>

    </div>
  );
};

// --- HELPER COMPONENTS ---

const PostCard = ({ post }) => (
  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-[var(--primary-color)]/50 transition-all group hover:bg-white/[0.02]">
    <p className="font-medium text-gray-200 line-clamp-3 mb-6 font-sans leading-relaxed text-lg">
      {post.description || "Untitled Thought"}
    </p>
    <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-4">
      <span className="flex items-center gap-2 group-hover:text-[var(--primary-color)] transition-colors">
        <Heart className="w-4 h-4" /> {post.likes?.length || 0} Appreciations
      </span>
      <span className="flex items-center gap-2">
        <Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-600 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
    <Icon className="w-12 h-12 mb-4 opacity-30 text-white" />
    <p className="font-borel text-xl text-gray-500">{label}</p>
  </div>
);

export default UserProfile;
