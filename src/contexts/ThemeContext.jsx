import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const defaultColor = "green";
const colorMap = {
  red: "#ef4444", // Tailwind red-500
  green: "#22c55e", // Tailwind green-500
  blue: "#3b82f6", // Tailwind blue-500
  yellow: "#eab308", // Tailwind yellow-500
  purple: "#a855f7", // Tailwind purple-500
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