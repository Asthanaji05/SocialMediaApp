import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import Loading from "../components/ui/Loading";
import API from "../utils/api";
import { Users, Heart, Calendar, ArrowRight } from "lucide-react";

const MyNetwork = () => {
  const { user } = useAuth();
  const { primaryColor } = useTheme();

  const [followingUsers, setFollowingUsers] = useState([]);
  const [topPostsMap, setTopPostsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) {
      // Fetch user profile if not available (to ensure we have _id)
      const checkUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const res = await API.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } });
            // The Context should handle update, but we need to wait
          } catch (e) { }
        }
      }
      checkUser();
    }

    const fetchNetworkData = async () => {
      if (!user?._id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/users/${user._id}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowingUsers(res.data);

        const postPromises = res.data.map((u) =>
          API.get(`/users/top-posts/${u._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const allPosts = await Promise.all(postPromises);
        const postMap = {};
        res.data.forEach((u, i) => {
          postMap[u._id] = allPosts[i].data;
        });
        setTopPostsMap(postMap);
      } catch (err) {
        console.error("Error fetching Circles data:", err);
        setError("Failed to load Circles data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchNetworkData();
  }, [user]);

  if (loading) return <Loading />;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-white px-6 py-10"><p className="text-red-500">{error}</p></div>;
  if (!user) return <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-10"><p className="text-gray-400 mb-6 text-xl font-borel">Join the circle to see your circles.</p><Link to="/login"><button className="px-8 py-3 rounded-full bg-[var(--primary-color)] text-black font-bold hover:scale-105 transition-transform">Login Now</button></Link></div>;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
          <Users className="text-[var(--primary-color)] w-8 h-8" />
          <h1 className="text-4xl font-nerko tracking-wide">My Circles</h1>
        </div>

        <div className="space-y-12">
          {followingUsers.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 font-borel text-xl">Your circle is waiting to be built.</p>
              <Link to="/feed" className="inline-block mt-4 text-[var(--primary-color)] hover:underline">Explore the Feed</Link>
            </div>
          ) : (
            followingUsers.map((followedUser) => (
              <div key={followedUser._id} className="relative group">
                {/* User Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {followedUser.image ? (
                      <img src={followedUser.image} className="w-14 h-14 rounded-full object-cover border-2 border-white/10" alt="profile" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold border-2 border-white/10">
                        {followedUser.firstName?.[0]}
                      </div>
                    )}
                    <div>
                      <Link to={`/profile/${followedUser._id}`} className="text-2xl font-nerko text-white hover:text-[var(--primary-color)] transition-colors">
                        {followedUser.firstName} {followedUser.lastName}
                      </Link>
                      <p className="text-sm text-gray-500">@{followedUser.userName}</p>
                    </div>
                  </div>
                  <Link to={`/profile/${followedUser._id}`} className="text-gray-500 hover:text-white transition-colors">
                    <ArrowRight size={20} />
                  </Link>
                </div>

                {/* Top Creations Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topPostsMap[followedUser._id]?.slice(0, 2).map((post) => (
                    <div key={post._id} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-xl hover:border-white/20 transition-all">
                      <p className="text-gray-300 line-clamp-3 text-sm leading-relaxed mb-4">{post.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1"><Heart size={10} /> {post.likes?.length || 0}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {(!topPostsMap[followedUser._id] || topPostsMap[followedUser._id].length === 0) && (
                    <div className="col-span-full py-6 text-center text-xs text-gray-600 border border-dashed border-white/5 rounded-xl italic">
                      This creator hasn't published any thoughts yet.
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;