import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Users, Heart, Calendar } from "lucide-react";
import Loading from "../UI/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import API from "../../utils/api";
import { Button } from "@/components/ui/button";

const OtherUserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { primaryColor } = useTheme();

  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [topPosts, setTopPosts] = useState([]);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [userRes, postsRes] = await Promise.all([
          API.get(`/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          API.get(`/users/top-posts/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setOtherUser(userRes.data);
        setTopPosts(postsRes.data || []);

        // Check following status
        if (userRes.data.followers?.includes(currentUser?._id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, currentUser?._id]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await API.post(`/users/${endpoint}/${otherUser._id}`, { userId: currentUser._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(!isFollowing);
      // Optional: Update follower count locally
      setOtherUser(prev => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter(id => id !== currentUser._id)
          : [...prev.followers, currentUser._id]
      }));
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  if (loading) return <Loading />;
  if (!otherUser) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-nerko text-3xl">User not found</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[var(--primary-color)] selection:text-black pb-20">

      {/* --- PROFILE HEADER --- */}
      <div className="relative mb-20">
        {/* Banner / Cover Gradient */}
        <div className="h-48 w-full bg-gradient-to-b from-[var(--primary-color)]/20 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Profile Card Info - Floating */}
        <div className="absolute top-28 left-0 right-0 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end md:items-center gap-6">

            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--primary-color)] to-white rounded-full opacity-70 blur group-hover:opacity-100 transition duration-500"></div>
              {otherUser.image ? (
                <img
                  src={otherUser.image}
                  alt="Profile"
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-black"
                />
              ) : (
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black bg-white/10 flex items-center justify-center text-white text-6xl font-bold">
                  {otherUser.firstName?.[0]}
                </div>
              )}
            </div>

            {/* Text Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-4xl md:text-5xl font-nerko text-white leading-none">
                {otherUser.firstName} {otherUser.lastName}
              </h1>
              <p className="text-gray-400 font-borel text-lg">@{otherUser.userName || "creator"}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {otherUser.address || "Nowhere"}</span>
                <span>•</span>
                <span>Joined {new Date().getFullYear()}</span>
              </div>
            </div>

            {/* Actions (Follow) */}
            <div className="flex gap-3 mb-4">
              {currentUser?._id !== otherUser._id && (
                <Button
                  onClick={handleFollowToggle}
                  className={`rounded-full px-8 font-bold transition-all ${isFollowing ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/10 hover:text-red-500" : "bg-[var(--primary-color)] text-black hover:bg-[var(--primary-color)]/90"}`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- BIO & STATS --- */}
      <div className="max-w-4xl mx-auto px-6 mt-32 mb-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-xl text-gray-300 font-borel leading-relaxed">
            "{otherUser.about || "Just another creator traversing the Moscownpur universe."}"
          </p>
        </div>

        <div className="flex gap-8 md:gap-16 border-y border-white/10 py-6">
          <div className="text-center md:text-left">
            <span className="block text-3xl font-nerko text-white">{otherUser.posts?.length || 0}</span>
            <span className="text-sm text-gray-500 uppercase tracking-widest">Creations</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl font-nerko text-white">{otherUser.followers?.length || 0}</span>
            <span className="text-sm text-gray-500 uppercase tracking-widest">Trusting</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block text-3xl font-nerko text-white">{otherUser.following?.length || 0}</span>
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
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[300px]">
          {topPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {topPosts.map(post => (
                <OtherPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="font-borel text-xl">Quietly building in the shadows...</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

const OtherPostCard = ({ post }) => (
  <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 hover:border-[var(--primary-color)]/30 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)] transition-all duration-300 group">
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

export default OtherUserProfile;
