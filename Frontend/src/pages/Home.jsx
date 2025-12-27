import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MessageCircle, Fingerprint, ZapOff } from "lucide-react";
import MoscownpurLogo from "../components/UI/MoscownpurLogo";

const Home = () => {
  const { primaryColor } = useTheme();

  useEffect(() => {
    document.title = "The Human Layer | Moscownpur Circles";
  }, []);

  const bgPrimaryStyle = { backgroundColor: 'var(--primary-color)' };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--primary-color)] selection:text-black font-sans">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-15 blur-[120px] rounded-full pointer-events-none"
          style={bgPrimaryStyle}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">

          <div className="flex justify-center mb-6">
            <MoscownpurLogo className="w-32 h-32 text-[var(--primary-color)] animate-spin-slow" />
          </div>

          <h1 className="text-6xl md:text-9xl tracking-wide leading-none font-nerko">
            Moscownpur<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--primary-color)] to-white">
              Circles
            </span>
          </h1>

          <p className="text-2xl md:text-4xl text-gray-300 tracking-wide font-borel mt-8">
            The human layer of Moscownpur.
          </p>
        </div>
      </section>

      <Separator className="my-0 bg-white/5 max-w-xl mx-auto" />

      {/* The Manifesto - English */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-16">

          <p className="text-5xl md:text-7xl text-white/90 leading-tight font-corinthia">
            "Where users don't just consume,<br />
            <span style={{ color: 'var(--primary-color)' }}>they belong.</span>"
          </p>

          <div className="grid gap-8 md:grid-cols-3 text-left">
            <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--primary-color)] transition-colors duration-500 group">
              <MessageCircle className="w-8 h-8 text-gray-500 group-hover:text-[var(--primary-color)] mb-4 transition-colors" />
              <h3 className="text-2xl text-white font-nerko">Conversations</h3>
              <p className="text-gray-400 text-lg font-borel">Not loud, <br /><span className="text-white">but meaningful.</span></p>
            </div>

            <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--primary-color)] transition-colors duration-500 group">
              <Users className="w-8 h-8 text-gray-500 group-hover:text-[var(--primary-color)] mb-4 transition-colors" />
              <h3 className="text-2xl text-white font-nerko">Connections</h3>
              <p className="text-gray-400 text-lg font-borel">Not temporary, <br /><span className="text-white">but trusted.</span></p>
            </div>

            <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--primary-color)] transition-colors duration-500 group">
              <Fingerprint className="w-8 h-8 text-gray-500 group-hover:text-[var(--primary-color)] mb-4 transition-colors" />
              <h3 className="text-2xl text-white font-nerko">Identity</h3>
              <p className="text-gray-400 text-lg font-borel">Not performed, <br /><span className="text-white">but lived.</span></p>
            </div>
          </div>

        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl leading-tight font-nerko">
              Small, Intentional<br />
              <span style={{ color: 'var(--primary-color)' }}>Communities</span>
            </h2>
            <p className="text-gray-400 text-xl leading-relaxed font-borel">
              Circles are friends, thinkers, builders, and learners who create a safe, honest space within the broader world of Moscownpur.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3 text-gray-300">
                <ZapOff className="w-5 h-5 text-red-400" /> No algorithms pushing noise.
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <ZapOff className="w-5 h-5 text-red-400" /> No vanity metrics deciding worth.
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <span style={{ color: 'var(--primary-color)' }}>✓</span> Just people, conversations, and real presence.
              </li>
            </ul>
          </div>

          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden border border-white/10 bg-black/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-color)]/20 via-transparent to-transparent opacity-50" />
            <div className="text-center p-8">
              <p className="text-xl md:text-2xl font-serif italic text-white/80">
                "Moscownpur Circles exists to ensure that <br />as Moscownpur grows bigger, <br />
                <span className="text-white font-normal not-italic mt-2 block">its connections grow deeper.</span>"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-6xl md:text-8xl mb-8 tracking-wide font-nerko">Belong Here.</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg text-black font-bold transition-transform hover:scale-105"
              style={bgPrimaryStyle}
            >
              Enter Needs
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-7 text-lg border-white/20 text-white bg-black hover:bg-transparent transition-colors duration-300"
              style={{
                '--hover-color': 'var(--primary-color)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = 'white';
              }}
            >
              Join a Circle
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;