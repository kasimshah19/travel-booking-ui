import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";
import { useThemeStore, useAuthStore } from "../store/useStore";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-teal dark:bg-slate-950 text-sand px-6 py-4 flex items-center justify-between shadow-md transition-colors duration-300">
      <Link to="/" className="text-2xl font-display font-semibold">
        Wanderlist
      </Link>
      <nav className="hidden md:flex gap-8 text-sm items-center">
        <Link to="/" onClick={() => window.scrollTo({ top: document.getElementById('destinations')?.offsetTop || 0, behavior: 'smooth' })} className="hover:text-coral transition-colors">
          Destinations
        </Link>
        <Link to="/deals" className="hover:text-coral transition-colors">
          Deals
        </Link>
        <Link to="/contact" className="hover:text-coral transition-colors">
          Support
        </Link>
        {user && (
          <Link to="/my-bookings" className="hover:text-coral transition-colors font-medium">
            My Bookings
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-teal-light dark:hover:bg-slate-800 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <button
            onClick={() => {
              logout();
              toast.success("Logged out successfully!");
            }}
            className="bg-coral hover:bg-coral-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Log out
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-coral hover:bg-coral-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
