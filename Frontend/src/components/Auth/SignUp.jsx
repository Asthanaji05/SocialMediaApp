import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Sparkles, ChevronLeft, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import { Button } from "@/components/ui/button.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Ciphers do not match. Re-verify your keys.");
      return;
    }

    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const response = await API.post("/users/", {
        firstName,
        lastName,
        email: formData.email,
        userName: formData.userName,
        password: formData.password,
      });

      alert("Creative Frequency Initialized! Sign in to enter the orbit.");
      navigate("/login");
    } catch (error) {
      console.error("Initialization failure", error);
      alert(error.response?.data?.message || "Signal interference. Please try initializing again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#050505] overflow-hidden py-12 px-4 font-sans">
      {/* --- NARRATIVE BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Back navigation */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest font-bungee">Neural Entry</span>
        </Link>

        {/* --- MAIN GLASS CARD --- */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <div className="relative text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 -rotate-3">
              <ShieldCheck className="text-black w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight font-bungee uppercase leading-none">
              Initialize Account
            </h1>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">
              Join the high-frequency network of creators in <span className="text-primary/80">Moscownpur Circles</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Sparkles className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="userName"
                  required
                  placeholder="Unique Handle"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Registry Email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Neural Cipher"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Verify Cipher"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 text-black font-black text-base py-7 rounded-2xl shadow-[0_10px_30px_rgba(var(--primary-rgb),0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group uppercase tracking-widest font-bungee"
            >
              {loading ? "Initializing..." : "Register Frequency"}
              {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already linked?{" "}
            <Link to="/login" className="text-primary hover:underline decoration-primary/30 underline-offset-4 font-bold">
              Neural Restore
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          Decentralized Narrative Network • Privacy Secured • v1.4.2
        </p>
      </div>
    </div>
  );
};

export default SignUp;

