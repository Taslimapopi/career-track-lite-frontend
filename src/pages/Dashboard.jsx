import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { buttonStyles } from "../components/Button";

const STAT_CARDS = [
  { key: "total", label: "Total Applications" },
  { key: "Saved", label: "Saved" },
  { key: "Applied", label: "Applied" },
  { key: "Assessment", label: "Assessment" },
  { key: "Interview", label: "Interview" },
  { key: "Rejected", label: "Rejected" },
  { key: "Offer", label: "Offer" },
];

const Dashboard = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-background text-ink">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">
          Welcome, {user?.name}
        </h1>

        {loading && <p className="text-muted">Loading dashboard...</p>}
        {error && <p className="text-danger">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {STAT_CARDS.map((card, i) => (
                <div
                  key={card.key}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="bg-surface border border-border rounded-xl p-4 animate-fade-in-up
                             hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  <p className="text-xs font-medium text-muted">{card.label}</p>
                  <p className="font-display text-3xl font-semibold mt-1 text-primary">
                    {stats[card.key] ?? 0}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold">Recently Added</h2>
              <Link to="/applications/new" className={buttonStyles("primary")}>
                + Add Application
              </Link>
            </div>

            {stats.recentApplications.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted">
                <p>No applications yet.</p>
                <Link to="/applications/new" className="text-primary font-medium hover:underline">
                  Add your first application
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentApplications.map((app, i) => (
                  <div
                    key={app._id}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className="bg-surface border border-border rounded-lg p-4 flex justify-between items-center
                               animate-fade-in-up hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{app.jobTitle}</p>
                      <p className="text-sm text-muted">{app.companyName}</p>
                    </div>
                    <span className="text-xs text-muted">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;