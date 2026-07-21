import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApplications, deleteApplication } from "../api/applicationApi";
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";
import { buttonStyles } from "../components/Button";

const STATUSES = ["All", "Saved", "Applied", "Assessment", "Interview", "Rejected", "Offer"];

const statusStyles = {
  Saved: "bg-border/50 text-muted",
  Applied: "bg-primary/10 text-primary",
  Assessment: "bg-accent/15 text-accent-foreground",
  Interview: "bg-primary/20 text-primary",
  Rejected: "bg-danger/10 text-danger",
  Offer: "bg-accent text-accent-foreground",
};

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort };
      if (search) params.search = search;
      if (status !== "All") params.status = status;
      const res = await getApplications(params);
      setApplications(res.data);
    } catch {
      setError("Could not load applications");
    } finally {
      setLoading(false);
    }
  }, [search, status, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async () => {
    setDeletingId(confirmId);
    try {
      await deleteApplication(confirmId);
      setApplications((prev) => prev.filter((app) => app._id !== confirmId));
    } catch {
      alert("Failed to delete application");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-semibold">My Applications</h1>
          <Link to="/applications/new" className={buttonStyles("primary")}>
            + Add Application
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border bg-surface rounded-lg p-2.5 text-sm flex-1 min-w-[200px]
                       focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-border bg-surface rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-border bg-surface rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {error && <p className="text-danger mb-4">{error}</p>}

        {loading ? (
          <p className="text-muted">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted">
            <p>No applications found.</p>
            <Link to="/applications/new" className="text-primary font-medium hover:underline">
              Add your first application
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, i) => (
              <div
                key={app._id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="border border-border bg-surface rounded-lg p-4 flex justify-between items-center
                           animate-fade-in-up hover:border-primary/40 hover:shadow-sm transition-all duration-200"
              >
                <div>
                  <h3 className="font-medium">{app.jobTitle}</h3>
                  <p className="text-sm text-muted">{app.companyName}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[app.status]}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/applications/${app._id}/edit`)}
                    className={buttonStyles("secondary", "text-xs px-3 py-1.5")}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmId(app._id)}
                    disabled={deletingId === app._id}
                    className={buttonStyles("danger", "text-xs px-3 py-1.5")}
                  >
                    {deletingId === app._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Delete this application?"
        description="This action can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
};

export default ApplicationsList;