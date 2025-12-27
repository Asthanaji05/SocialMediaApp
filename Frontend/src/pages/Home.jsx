import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Heart, Globe, MessageCircle, Shield } from "lucide-react";

const Home = () => {
  const { primaryColor } = useTheme();

  useEffect(() => {
    document.title = "Welcome Home | MaitriLok";
  }, []);

  // Helper to apply dynamic primary color styles
  const primaryStyle = { color: 'var(--primary-color)' };
  const bgPrimaryStyle = { backgroundColor: 'var(--primary-color)' };
  const borderPrimaryStyle = { borderColor: 'var(--primary-color)' };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--primary-color)] selection:text-black">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden">
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-20 blur-[100px] rounded-full pointer-events-none"
          style={bgPrimaryStyle}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="px-4 py-1 text-sm border-white/20 text-gray-300 backdrop-blur-sm">
            <span className="mr-2">✨</span> Welcome to the Future of Connection
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            A World of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--primary-color)] to-white animate-pulse">
              True Connections
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            MaitriLok is a soulful social universe rooted in <span className="font-semibold text-[var(--primary-color)]">Maitri</span> (friendship).
            Connect without noise, share without fear, and bond without limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/login">
              <Button
                size="lg"
                className="rounded-full px-8 text-black font-bold text-md transition-transform hover:scale-105"
                style={bgPrimaryStyle}
              >
                Get Started
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-white/20 text-white bg-black hover:bg-transparent transition-colors duration-300"
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
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Separator className="my-8 bg-white/10 max-w-6xl mx-auto" />

      {/* Mission Section */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8" style={primaryStyle} />
              Our Mission
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              In a digital age of fleeting interactions, <strong className="text-white">MaitriLok</strong> stands for permanence.
              Our mission is to bring back the essence of real connections—building a sanctuary where trust, expression,
              and cultural harmony thrive.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5 w-1/3">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Real Users</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5 w-1/3">
                <span className="text-2xl font-bold text-white">0%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Ads</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/5 w-1/3">
                <span className="text-2xl font-bold text-white">∞</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Love</span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4 translate-y-8">
              <div className="h-40 w-full rounded-2xl bg-gradient-to-b from-[var(--primary-color)]/20 to-transparent border border-white/10" />
              <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/10" />
            </div>
            <div className="space-y-4">
              <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/10" />
              <div className="h-40 w-full rounded-2xl bg-gradient-to-t from-[var(--primary-color)]/20 to-transparent border border-white/10" />
            </div>
          </div>

        </div>
      </section>

      {/* Why MaitriLok Grid */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MaitriLok?</h2>
            <p className="text-gray-400">Designed for those who crave authenticity.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Safe & Soulful", desc: "A troll-free environment where your peace of mind comes first." },
              { icon: Globe, title: "Bharatiya Values", desc: "Deeply rooted in the cultural ethos of respect and harmony." },
              { icon: MessageCircle, title: "Real Conversations", desc: "No algorithms manipulating your feed. Just real talk." },
              { icon: Flame, title: "Neon Vibes", desc: "Fully customizable themes to match your unique aura." }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-black/50 border-white/10 hover:border-[var(--primary-color)] transition-colors duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-gray-300 group-hover:text-[var(--primary-color)] transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Join the Tribe?</h2>
        <Link to="/signup">
          <Button
            size="lg"
            className="rounded-full px-12 py-6 text-lg font-bold text-black hover:opacity-90 transition-opacity"
            style={bgPrimaryStyle}
          >
            Start Your Journey Now
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default Home;