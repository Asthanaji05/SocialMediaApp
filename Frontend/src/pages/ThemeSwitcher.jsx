import { useTheme } from "../contexts/ThemeContext";
import { Popover , PopoverPanel, PopoverButton} from "@headlessui/react";
import { Palette } from "lucide-react";

const colors = ["red", "green", "blue", "yellow", "purple"];
const colorMap = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
};
const extraColorMap = {
  slate: "bg-slate-500",
  gray: "bg-gray-500",
  zinc: "bg-zinc-500",
  neutral: "bg-neutral-500",
  stone: "bg-stone-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  lime: "bg-lime-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
};

const extraColors = [
  "slate", "gray", "zinc", "neutral", "stone",
  "orange", "amber", "lime", "emerald", "teal",
  "cyan", "sky", "indigo", "violet", "fuchsia",
  "pink", "rose"
];

const ThemeSwitcher = () => {
  const { primaryColor, setPrimaryColor } = useTheme();

  return (
    <div className="flex gap-3 p-4 items-center">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setPrimaryColor(color)}
          className={`w-6 h-6 rounded-full border-2 ${colorMap[color]} ${
            primaryColor === color ? "border-white" : "border-transparent"
          }`}
        />
      ))}

<Popover className="relative">
  <PopoverButton className="w-6 h-6 flex items-center justify-center rounded-full bg-white border shadow">
    <Palette className="w-4 h-4 text-black" />
  </PopoverButton>

  <PopoverPanel className="absolute right-full mr-2 z-10 mt-2 grid grid-cols-6 gap-1 bg-white p-2 rounded-lg shadow-lg w-2xl">

    {extraColors.map((c) => (
      <button
        key={c}
        onClick={() => setPrimaryColor(c)}
        className={`w-6 h-6 rounded-full ${extraColorMap[c]} border-2 ${
          primaryColor === c ? "border-black" : "border-transparent"
        }`}
        
      />
    ))}
  </PopoverPanel>
</Popover>


    </div>
  );
};

export default ThemeSwitcher;
