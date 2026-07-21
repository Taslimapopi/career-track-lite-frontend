import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { buttonStyles } from "./Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-semibold hover:text-primary transition-colors">
          CareerTrack Lite
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/"
            className="text-sm text-muted hover:text-ink px-3 py-2 rounded-full hover:bg-background transition-colors hidden sm:block"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-muted hover:text-ink px-3 py-2 rounded-full hover:bg-background transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/applications"
            className="text-sm text-muted hover:text-ink px-3 py-2 rounded-full hover:bg-background transition-colors"
          >
            Applications
          </Link>

          <div className="w-px h-6 bg-border mx-1" />

          <ThemeToggle />
          <button onClick={handleLogout} className={buttonStyles("secondary")}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;