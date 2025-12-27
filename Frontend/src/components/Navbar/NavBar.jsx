import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "../../pages/ThemeSwitcher";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Logout from "../Auth/Logout";
import SearchBar from "../Search/SearchBar"; // 👈 Import at top


const NavBar = () => {
  const { primaryColor } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="text-2xl font-extrabold bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, var(--primary-color),var(--primary-color))`,
        }}
      >
        Moscownpur Circles
      </Link>

      <div className="hidden md:flex gap-6 items-center">
        <Link
          to="/"
          className={`hover:text-[var(--primary-color)] transition ${isActive("/") ? "text-[var(--primary-color)] font-semibold" : ""
            }`}
        >
          Home
        </Link>
        <Link
          to="/feed"
          className={`hover:text-[var(--primary-color)] transition ${isActive("/feed") ? "text-[var(--primary-color)] font-semibold" : ""
            }`}
        >
          Feed
        </Link>


        {!user ? (
          <>
            <Link
              to="/login"
              className={`hover:text-[var(--primary-color)] transition ${isActive("/login") ? "text-[var(--primary-color)] font-semibold" : ""
                }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`hover:text-[var(--primary-color)] transition ${isActive("/signup") ? "text-[var(--primary-color)] font-semibold" : ""
                }`}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/chat"
              className={`hover:text-[var(--primary-color)] transition ${isActive("/chat") ? "text-[var(--primary-color)] font-semibold" : ""
                }`}
            >
              Chat
            </Link>
            <Link
              to="/profile"
              className={`hover:text-[var(--primary-color)] transition ${isActive("/profile") ? "text-[var(--primary-color)] font-semibold" : ""
                }`}
            >
              Profile
            </Link>
            <Link
              to="/my-network"
              className={`hover:text-[var(--primary-color)] transition ${isActive("/my-network") ? "text-[var(--primary-color)] font-semibold" : ""
                }`}
            >
              My Network
            </Link>
            <SearchBar />
            <Logout />
          </>
        )}
      </div>

      <div className="md:hidden">
        <button className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="hidden md:block ml-4">
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;
