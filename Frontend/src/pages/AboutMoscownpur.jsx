import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Heart, Users, Sparkles, ShieldCheck, Zap } from "lucide-react";

const AboutMoscownpur = () => {
    const { primaryColor } = useTheme();

    const definitions = [
        {
            term: "Circles",
            icon: Users,
            description: "Your hand-picked network of creators and collaborators. In Moscownpur, you don't just have followers; you build concentric circles of trust and creative synergy.",
            color: "var(--primary-color)"
        },
        {
            term: "Appreciations",
            icon: Heart,
            description: "The digital currency of respect. An Appreciation is more than a like—it's a signal that a creation provided value, sparked a thought, or resonated with your soul.",
            color: "#ec4899" // Pink-500
        },
        {
            term: "Creations",
            icon: Sparkles,
            description: "Everything you share—thoughts, imagery, or moving pictures—is a manifestation of your intent. We don't post; we create.",
            color: "#8b5cf6" // Violet-500
        },
        {
            term: "Trusting",
            icon: ShieldCheck,
            description: "The individuals who have placed their attention in your trajectory. They don't just 'follow' you; they trust your creative output.",
            color: "#10b981" // Emerald-500
        },
        {
            term: "Trusted",
            icon: Zap,
            description: "The creators you have chosen to orbit. By 'Trusting' someone, you integrate their signal into your personal Moscownpur experience.",
            color: "#f59e0b" // Amber-500
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 selection:bg-[var(--primary-color)] selection:text-black">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-6xl md:text-8xl font-nerko text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--primary-color)] to-white/30 mb-6 pb-2">
                        The Lexicon
                    </h1>
                    <p className="font-borel text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Moscownpur is not just a platform; it's a creative dimension. Understanding our language is the first step to mastering your orbit.
                    </p>
                </div>

                {/* Glossary Grid */}
                <div className="grid gap-8">
                    {definitions.map((item, index) => (
                        <div
                            key={item.term}
                            className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:translate-x-2"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className="absolute top-0 left-0 w-1 h-full opacity-40 transition-all duration-500 group-hover:w-2"
                                style={{ backgroundColor: item.color }}
                            ></div>

                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                                    style={{ backgroundColor: `${item.color}10`, color: item.color }}
                                >
                                    <item.icon size={32} />
                                </div>

                                <div>
                                    <h2
                                        className="text-3xl font-nerko mb-2 text-white group-hover:text-transparent bg-clip-text transition-all duration-500"
                                        style={{ backgroundImage: item.color.startsWith('var') ? `linear-gradient(to right, white, var(--primary-color))` : `linear-gradient(to right, white, ${item.color})` }}
                                    >
                                        {item.term}
                                    </h2>
                                    <p className="text-lg text-gray-500 font-sans leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Blur */}
                            <div
                                className="absolute -right-20 -bottom-20 w-40 h-40 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                                style={{ backgroundColor: item.color }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-24 text-center p-12 rounded-[3rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <h3 className="font-nerko text-4xl mb-4 text-white">Ready to begin?</h3>
                    <p className="font-borel text-gray-400 text-lg mb-8">Your circle awaits your first creation.</p>
                    <a
                        href="/feed"
                        className="inline-block px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Enter the Feed
                    </a>
                </div>

            </div>
        </div>
    );
};

export default AboutMoscownpur;
