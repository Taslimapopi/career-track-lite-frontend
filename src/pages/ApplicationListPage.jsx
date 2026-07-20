import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApplications, deleteApplication } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["All", "Saved", "Applied", "Assessment", "Interview", "Rejected", "Offer"];

const statusColors = {
  Saved: "bg-gray-200 text-gray-800",
  Applied: "bg-blue-100 text-blue-800",
  Assessment: "bg-yellow-100 text-yellow-800",
  Interview: "bg-purple-100 text-purple-800",
  Rejected: "bg-red-100 text-red-800",
  Offer: "bg-green-100 text-green-800",
};

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // fetchData-কে useCallback দিয়ে wrap করছি যাতে useEffect dependency ঠিকমতো কাজ করে,
  // অকারণে re-create না হয়ে বারবার re-render না ঘটায়
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort };
      if (search) params.search = search;
      if (status !== "All") params.status = status;

      const res = await getApplications(params);
      setApplications(res.data);
    } catch (err) {
      setError("Could not load applications");
    } finally {
      setLoading(false);
    }
  }, [search, status, sort]);

  useEffect(() => {
    // search করার সময় প্রতিটা keystroke-এ API call না করে ৪০০ms wait করছি (debounce)
    // এতে backend-এ অকারণে অনেক request যাবে না
    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    setDeletingId(id);
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <div className="flex gap-3">
          <Link to="/dashboard" className="border px-4 py-2 rounded">Dashboard</Link>
          <Link to="/applications/new" className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Application
          </Link>
          <button onClick={logout} className="border px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {/* Search, filter, sort controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by company or job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1 min-w-[200px]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded p-2"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No applications found.</p>
          <Link to="/applications/new" className="text-blue-600 underline">
            Add your first application
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{app.jobTitle}</h3>
                <p className="text-sm text-gray-600">{app.companyName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/applications/${app._id}/edit`)}
                  className="text-blue-600 text-sm border px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  disabled={deletingId === app._id}
                  className="text-red-600 text-sm border px-3 py-1 rounded disabled:opacity-50"
                >
                  {deletingId === app._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;