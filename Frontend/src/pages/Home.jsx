import { useEffect } from "react";
import { PlusCircle, Flame } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { primaryColor } = useTheme();
  console.log("Primary color in Home:", primaryColor); // Debugging log

  useEffect(() => {
    document.title = "About Us | MaitriLok";
  }, []);

  return (
<div className="min-h-screen bg-black text-white px-6 py-10">

      {/* Hero Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-[var(--primary-color)] mb-4">A World of True Connections</h2>
        <p className="text-gray-300 max-w-2xl">
          Welcome to MaitriLok – a soulful social platform rooted in Maitri (friendship), where connections aren't just made, they're cherished.
        </p>
        <Link to="/login">
        <button className="mt-6 px-6 py-3 rounded-full bg-[var(--primary-color)] text-black font-semibold hover:bg-opacity-80">
          Join Now
        </button>
        </Link>
      </section>

      {/* About Us */}
      <section className="mb-16">
        <h3 className="text-2xl font-semibold text-[var(--primary-color)] mb-2">Our Mission</h3>
        <p className="text-gray-400 max-w-3xl">
          At MaitriLok, our mission is to bring back the essence of real connections. In a world full of distractions, we aim to build a community based on trust, expression, and cultural harmony.
        </p>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h3 className="text-2xl font-semibold text-[var(--primary-color)] mb-4">Why MaitriLok?</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>✨ Safe & soulful digital environment</li>
          <li>📜 Rooted in Bharatiya values and friendship</li>
          <li>💬 Real-time, meaningful conversations</li>
          <li>🎨 Customizable themes with neon vibes</li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="mb-16 text-center">
        <h3 className="text-2xl font-semibold text-[var(--primary-color)] mb-4">Ready to be a part of MaitriLok?</h3>
        <Link to="/signup">
        <button className="px-8 py-3 rounded-full bg-[var(--primary-color)] text-black font-semibold hover:bg-opacity-80">
          Create Your Account
        </button>
        </Link>
      </section>
    </div>
);
};
export default Home;