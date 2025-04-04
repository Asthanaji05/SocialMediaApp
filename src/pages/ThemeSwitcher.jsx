import { useTheme } from "../contexts/ThemeContext";

const colors = ["red", "green", "blue", "yellow", "purple"];
const colorMap = {
  red: "red-500",
  green: "green-500",
  blue: "blue-500",
  yellow: "yellow-500",
  purple: "purple-500",
};

const ThemeSwitcher = () => {
  const { primaryColor, setPrimaryColor } = useTheme();

  return (
    <div className="flex gap-3 p-4">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => {
            console.log("Changing color to:", color);
            setPrimaryColor(color);
          }}
          className={`w-6 h-6 rounded-full border-2 bg-${colorMap[color]} ${
            primaryColor === color ? "border-white" : "border-transparent"
          }`}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
