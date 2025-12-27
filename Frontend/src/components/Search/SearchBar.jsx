import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import { Search, User as UserIcon, X, Sparkles } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return setResults([]);
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API.defaults.baseURL}/users/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        setResults([]);
      }
    };

    const delay = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (userId) => {
    setQuery("");
    setResults([]);
    setIsFocused(false);
    navigate(`/profile/${userId}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full group">
      {/* --- Search Input Wrapper --- */}
      <div
        className={`
          relative flex items-center transition-all duration-500 rounded-full
          border border-white/10 bg-white/5 backdrop-blur-md
          ${isFocused ? "border-[var(--primary-color)] ring-4 ring-[var(--primary-color)]/10 bg-white/10" : "hover:border-white/20"}
        `}
      >
        <div className="pl-4 text-gray-400">
          <Search size={18} className={isFocused ? "text-[var(--primary-color)]" : ""} />
        </div>

        <input
          type="text"
          value={query}
          placeholder="Summon a creator..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none font-medium"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="pr-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* --- Animated Border Glow --- */}
        <div className={`absolute inset-0 rounded-full -z-10 bg-gradient-to-r from-[var(--primary-color)] to-white opacity-0 blur-md transition-opacity duration-500 ${isFocused ? "opacity-20" : ""}`}></div>
      </div>

      {/* --- Results Dropdown --- */}
      {isFocused && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] animate-in fade-in slide-in-from-top-2 duration-300">

          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Sparkles size={12} className="text-[var(--primary-color)]" />
                Signals Detected
              </div>
              {results.map((user) => (
                <div
                  key={user._id}
                  className="group/item flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5"
                  onClick={() => handleSelect(user._id)}
                >
                  <div className="relative">
                    {user.image ? (
                      <img src={user.image} alt={user.userName} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10 text-gray-400">
                        {user.userName?.[0]}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-200 truncate group-hover/item:text-white transition-colors">
                      {user.userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      <Search size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-gray-500">
              <UserIcon size={24} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs font-nerko tracking-wider">No signals found in this orbit</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;