import { Link } from "react-router-dom";
import ThemeSwitcher from "../../pages/ThemeSwitcher";
const NavBar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">MyApp</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/feed" className="hover:underline">Feed</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/logout" className="hover:underline">Logout</Link>
        <Link to="/signup" className="hover:underline">Sign Up</Link>
      </div>
      <ThemeSwitcher />
    </nav>
  );
};
// The updated NavBar component code can replace the placeholder entirely.
export default NavBar;
