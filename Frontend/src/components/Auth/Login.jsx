import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Sparkles, ChevronLeft, Radio } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button.jsx";
import { supabase, isSupabaseConfigured } from "../../utils/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLegacyLogin, setShowLegacyLogin] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API.defaults.baseURL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid authentication frequency.");

      localStorage.setItem("token", data.token);
      setUser({ ...data.user, token: data.token });
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");
    try {
      const idToken = credentialResponse.credential;
      const res = await fetch(`${API.defaults.baseURL}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        if (res.status === 302 && data.redirect === "/auth/google/signup") {
          return navigate("/google-signup", {
            state: { email: data.email, googleId: data.googleId },
          });
        }
        throw new Error(data.message || "Neural link failed.");
      }

      localStorage.setItem("token", data.token);
      setUser({ ...data.user, token: data.token });
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSupabaseLogin = async () => {
    setError("");
    if (!isSupabaseConfigured) {
      setError("Moscownpur ID configuration missing. Please update your environment variables.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });

      if (sbError) throw sbError;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Check for Supabase session on mount (after redirect)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const res = await API.post("/users/supabase-login", { session });
          localStorage.setItem("token", res.data.token);
          setUser({ ...res.data.user, token: res.data.token });
          // Sign out of supabase locally to keep sessions separate if needed
          await supabase.auth.signOut();
          navigate("/feed");
        } catch (err) {
          console.error("SSO Sync Error:", err);
          setError("SSO Synchronization failed. Identity frequency mismatch.");
        }
      }
    };
    checkSession();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#050505] overflow-hidden px-4 font-sans">
      {/* --- NARRATIVE BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Back navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest font-bungee">Central Hub</span>
        </Link>

        {/* --- MAIN GLASS CARD --- */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <div className="relative text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-3">
              <Sparkles className="text-black w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight font-bungee uppercase">
              Restore Link
            </h1>
            <p className="text-gray-400 font-medium">
              Initialize your creative frequency at <span className="text-primary/80">Moscownpur Circles</span>
            </p>
          </div>

          {/* Moscownpur ID - Primary Login */}
          {isSupabaseConfigured && (
            <div className="mb-6">
              <Button
                type="button"
                onClick={handleSupabaseLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black text-base py-7 rounded-2xl shadow-[0_10px_30px_rgba(234,88,12,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest font-bungee disabled:opacity-50"
              >
                <div className="relative">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                  <div className="absolute inset-0 bg-white rounded-full blur-md opacity-20 animate-ping"></div>
                </div>
                {loading ? "Connecting..." : "Moscownpur ID"}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                One identity across all Moscownpur platforms
              </p>
            </div>
          )}

          {/* Divider */}
          {isSupabaseConfigured && (
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <button
                type="button"
                onClick={() => setShowLegacyLogin(!showLegacyLogin)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showLegacyLogin ? "Hide" : "Show"} Legacy Login
              </button>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>
          )}

          {/* Email/Password - Legacy Login (Collapsible) */}
          {(!isSupabaseConfigured || showLegacyLogin) && (
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Registry Email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Cipher Key"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:opacity-90 text-black font-black text-base py-7 rounded-2xl shadow-[0_10px_30px_rgba(var(--primary-rgb),0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group uppercase tracking-widest font-bungee"
              >
                {loading ? "Decrypting..." : "Activate Frequency"}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          )}

          {/* Google OAuth - Legacy (Only show if Supabase not configured) */}
          {!isSupabaseConfigured && (
            <>
              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-white/5"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Cross-Platform</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>

              {/* Google Auth */}
              <div className="flex flex-col items-center gap-6">
                <div className="w-full flex justify-center transform transition-transform hover:scale-[1.01]">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setError("Frequency misaligned. Try again.")}
                    theme="dark"
                    shape="pill"
                    width="100%"
                  />
                </div>
              </div>
            </>
          )}

          <p className="text-sm text-gray-500 mt-8 text-center">
            New to the orbit?{" "}
            <Link to="/signup" className="text-primary hover:underline decoration-primary/30 underline-offset-4 font-bold">
              Initialize Account
            </Link>
          </p>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          Encrypted Social Layer • Narrative Operating System v1.4
        </p>
      </div>
    </div>
  );
};

export default Login;
