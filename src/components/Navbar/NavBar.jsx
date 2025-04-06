import { Link } from "react-router-dom";
import { useEffect } from "react";
import ThemeSwitcher from "../../pages/ThemeSwitcher";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

const NavBar = () => {
  const { primaryColor } = useTheme();
  const { user } = useAuth();
  return (
    <nav className="bg-black text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold text-[var(--primary-color)]">MaitriLok</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/feed" className="hover:underline">Feed</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        {!user && (
    <>
      <Link to="/login" className="hover:underline">Login</Link>
      <Link to="/signup" className="hover:underline">Sign Up</Link>
    </>
  )}

  {user && (
    <><Link to="/chat" className="hover:underline">Chat</Link>
    <Link to="/logout" className="hover:underline">Logout</Link></>
  )}
      </div>
      <ThemeSwitcher />
    </nav>
  );
};
// The updated NavBar component code can replace the placeholder entirely.
export default NavBar;
