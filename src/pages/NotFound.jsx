import { Link } from "react-router-dom";
import { buttonStyles } from "../components/Button";

const NotFound = () => (
  <div className="min-h-screen bg-background text-ink flex flex-col items-center justify-center text-center px-6">
    <p className="font-display text-7xl font-semibold text-primary/30">404</p>
    <p className="text-xl font-medium mt-4">Page not found</p>
    <p className="text-muted mt-2">The page you're looking for doesn't exist.</p>
    <Link to="/" className={buttonStyles("primary", "mt-6")}>
      Back to Home
    </Link>
  </div>
);

export default NotFound;