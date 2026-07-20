import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
    <h1 className="text-6xl font-bold text-gray-300">404</h1>
    <p className="text-xl font-medium mt-4">Page not found</p>
    <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
    <Link to="/" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">
      Back to Home
    </Link>
  </div>
);

export default NotFound;