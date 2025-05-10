import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js"
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return setResults([]);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }
    
      try {
        const res = await fetch(`${API.defaults.baseURL}/users/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (res.ok) {
          const data = await res.json();
          setResults(data); // Ensure the response is an array of users
        } else {
          console.error("Search API error:", await res.json());
          setResults([]);
        }
      } catch (err) {
        console.error("Search error", err);
        setResults([]);
      }
    };

    const delay = setTimeout(() => {
      fetchResults();
    }, 300); // Adjust debounce timing

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (userId) => {
    setQuery("");
    setResults([]);
    navigate(`/profile/${userId}`); // Use userId for navigation
  };

  return (
    <div className="relative border border-gray-300 rounded-md w-full max-w-sm">
      <input
        type="text"
        value={query}
        placeholder="Search users..."
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-2 rounded-md text-white border-none bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] w-full"
      />
      {results.length > 0 && (
        <ul className="absolute bg-white text-black mt-1 rounded shadow w-full z-50">
          {results.map((user) => (
            <li
              key={user._id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(user._id)} // Use _id for navigation
            >
              {user.userName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;