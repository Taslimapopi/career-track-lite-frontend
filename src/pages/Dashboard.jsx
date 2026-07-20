import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";

const STAT_CARDS = [
  { key: "total", label: "Total Applications", color: "bg-gray-100 text-gray-800" },
  { key: "Saved", label: "Saved", color: "bg-gray-200 text-gray-800" },
  { key: "Applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { key: "Assessment", label: "Assessment", color: "bg-yellow-100 text-yellow-800" },
  { key: "Interview", label: "Interview", color: "bg-purple-100 text-purple-800" },
  { key: "Rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { key: "Offer", label: "Offer", color: "bg-green-100 text-green-800" },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <div className="flex gap-3">
          <Link to="/applications" className="border px-4 py-2 rounded">
            My Applications
          </Link>
          <button onClick={logout} className="border px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading dashboard...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((card) => (
              <div key={card.key} className={`rounded-lg p-4 ${card.color}`}>
                <p className="text-sm font-medium opacity-80">{card.label}</p>
                <p className="text-3xl font-bold mt-1">{stats[card.key] ?? 0}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-3">Recently Added</h2>
          {stats.recentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No applications yet.</p>
              <Link to="/applications/new" className="text-blue-600 underline">
                Add your first application
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{app.jobTitle}</p>
                    <p className="text-sm text-gray-600">{app.companyName}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;