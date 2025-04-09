import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const defaultColor = "green";
const colorMap = {
  red: "#ef4444",      // Tailwind red-500
  green: "#22c55e",    // Tailwind green-500
  blue: "#3b82f6",     // Tailwind blue-500
  yellow: "#eab308",   // Tailwind yellow-500
  purple: "#a855f7",   // Tailwind purple-500
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  orange: "#f97316",
  amber: "#f59e0b",
  lime: "#84cc16",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
};


export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || defaultColor;
  });



  useEffect(() => {
    const mappedColor = colorMap[primaryColor] || colorMap[defaultColor];
    // console.log("Setting primary color:", primaryColor, mappedColor); // Debugging log
    document.documentElement.style.setProperty("--primary-color", mappedColor); // Set CSS variable
    localStorage.setItem("primaryColor", primaryColor || defaultColor); // Save to localStorage
  }, [primaryColor]);
  

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);