import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-bold">CareerTrack Lite</h1>
        <div className="flex gap-3">
          {user ? (
            <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4 max-w-2xl">
          Track every job application in one place
        </h2>
        <p className="text-gray-600 max-w-xl mb-8">
          Stop losing track of where you applied. Log companies, statuses, and
          deadlines, and see your job search progress at a glance.
        </p>
        <Link
          to={user ? "/dashboard" : "/register"}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          {user ? "Open Dashboard" : "Start Tracking — It's Free"}
        </Link>

        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl">
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-1">Track Everything</h3>
            <p className="text-sm text-gray-600">
              Company, role, source, status, and notes for every application.
            </p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-1">See Your Progress</h3>
            <p className="text-sm text-gray-600">
              Dashboard stats show applied, interviewing, and offers at a glance.
            </p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-1">Search & Filter</h3>
            <p className="text-sm text-gray-600">
              Quickly find any application by company, title, or status.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;