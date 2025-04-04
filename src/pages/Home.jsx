import { useEffect } from "react";
import { PlusCircle, Flame } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
  const { primaryColor } = useTheme();
  console.log("Primary color in Home:", primaryColor); // Debugging log

  useEffect(() => {
    document.title = "Home | RedSocial";
  }, []);

  return (
    <div className={`min-h-screen bg-black  p-4 text-${primaryColor}-500`}>
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold text-${primaryColor}-500`}>RedSocial🔥</h1>
        <button className={`bg-${primaryColor}-500 px-4 py-2 rounded-full hover:bg-${primaryColor}-600`}>
          New Post
        </button>
      </header>

      {/* Stories */}
      <section className="flex space-x-4 overflow-x-auto pb-3 mb-6 border-b border-primary-900">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full border-2 border-${primaryColor}-600 bg-gray-800`}></div>
            <p className="text-xs mt-1">User{i + 1}</p>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <PlusCircle className={`text-${primaryColor}-600 w-6 h-6`} />
          <p className="text-xs mt-1">Add</p>
        </div>
      </section>

      {/* Feed */}
      <main className="space-y-6">
        {[1, 2, 3].map((post) => (
          <div
            key={post}
            className={`bg-gray-900 rounded-2xl p-4 shadow-lg shadow-${primaryColor}-900`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-${primaryColor}-600`}></div>
              <p className="font-semibold">User{post}</p>
            </div>
            <p className="mb-3 text-sm text-gray-300">
              This is a demo post #{post} on RedSocial. 🔥
            </p>
            <div className="w-full h-48 bg-gray-800 rounded-xl mb-2"></div>
            <div className="flex justify-between text-sm text-primary-400">
              <span>❤️ 120</span>
              <span>💬 45</span>
              <span>🔁 12</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
