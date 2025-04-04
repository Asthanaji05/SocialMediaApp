import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    // Mock suggestions - replace with actual API call
    if (value) {
      setSuggestions(['John Doe', 'Jane Smith', 'JavaScript Tips', 'React Development']);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      {suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                onClick={() => {
                  setQuery(suggestion);
                  setSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;