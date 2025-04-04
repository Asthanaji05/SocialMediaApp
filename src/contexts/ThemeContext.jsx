import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const defaultColor = "red";
// const colorMap = {
//   red: "255, 0, 0",
//   green: "0, 128, 0",
//   blue: "0, 0, 255",
//   yellow: "255, 255, 0",
//   purple: "128, 0, 128",
// };
const colorMap = {
  red: "red-500",
  green: "green-500",
  blue: "blue-500",
  yellow: "yellow-500",
  purple: "purple-500",
};


export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || defaultColor;
  });

  // useEffect(() => {
  //   const rgb = colorMap[primaryColor] || colorMap[defaultColor];
  //   console.log("Setting primary color:", primaryColor, rgb); // Debugging log
  //   document.documentElement.style.setProperty("--primary-color", rgb); // Set CSS variable
  //   localStorage.setItem("primaryColor", primaryColor); // Save to localStorage
  // }, [primaryColor]);


  useEffect(() => {
    console.log("Setting primary color:", primaryColor); // Debugging log
    localStorage.setItem("primaryColor", primaryColor || defaultColor); // Save mapped value
  }, [primaryColor]);
  
  

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


