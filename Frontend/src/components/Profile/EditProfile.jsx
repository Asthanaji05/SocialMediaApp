import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, AlignLeft, Save, ArrowLeft, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "../../utils/api.js";
import Loading from "../UI/Loading";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phone: "",
    address: "",
    about: "",
    image: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(`/users/${userData._id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        // Update local storage user data too if needed
        const updatedUser = { ...JSON.parse(localStorage.getItem("user")), ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-4xl font-nerko tracking-wide">Settings</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Profile Section */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 space-y-8">
            <h2 className="text-xl font-nerko text-[var(--primary-color)] flex items-center gap-2">
              <User size={20} /> Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input
                  type="text"
                  name="userName"
                  value={userData.userName}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {/* Contact & Bio Section */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 space-y-8">
            <h2 className="text-xl font-nerko text-[var(--primary-color)] flex items-center gap-2">
              <AlignLeft size={20} /> About & Contact
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Bio / About</label>
              <textarea
                name="about"
                value={userData.about}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all resize-none"
                placeholder="Tell your circle about yourself..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                    placeholder="e.g. +1 234 567 890"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                    placeholder="e.g. Berlin, Germany"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="rounded-full px-8 py-6 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full px-10 py-6 bg-[var(--primary-color)] text-black font-bold hover:bg-[var(--primary-color)]/90 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

        </form>

        {/* Danger Zone */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-nerko text-red-500 mb-2">Danger Zone</h3>
              <p className="text-gray-500 text-sm">Deleting your account will remove all your creations and data from Moscownpur Circle permanently.</p>
            </div>
            <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-full px-6">
              Delete Account
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
