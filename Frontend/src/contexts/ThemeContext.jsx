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
    document.documentElement.style.setProperty("--primary-color", mappedColor);

    // Convert hex to RGB for alpha transparency support
    const r = parseInt(mappedColor.slice(1, 3), 16);
    const g = parseInt(mappedColor.slice(3, 5), 16);
    const b = parseInt(mappedColor.slice(5, 7), 16);
    document.documentElement.style.setProperty("--primary-rgb", `${r}, ${g}, ${b}`);

    localStorage.setItem("primaryColor", primaryColor || defaultColor);
  }, [primaryColor]);


  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);