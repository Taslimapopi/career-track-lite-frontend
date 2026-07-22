import { useState } from "react";
import Navbar from "../components/Navbar";
import { buttonStyles } from "../components/Button";
import { analyzeJobMatch } from "../api/aiApi";

const DEFAULT_SKILLS = `MERN Stack (MongoDB, Express, React, Node.js), JavaScript, React Router, Tailwind CSS, Zod, React Hook Form, JWT authentication, REST API design, Git/GitHub, responsive UI development, Economics degree (First Class Honours)`;

const inputClass =
  "w-full border border-border bg-surface rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const JobMatchAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [mySkills, setMySkills] = useState(DEFAULT_SKILLS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Paste a job description first");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeJobMatch({ jobDescription, mySkills });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed, try again");
    } finally {
      setLoading(false);
    }
  };

  const recommendationStyle = {
    Apply: "bg-accent text-accent-foreground",
    "Apply with prep": "bg-primary/15 text-primary",
    Skip: "bg-danger/10 text-danger",
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-semibold mb-1">AI Job Match Analyzer</h1>
        <p className="text-muted text-sm mb-6">
          Paste a job description to see how well it matches your skills.
        </p>

        <div className="space-y-4 bg-surface border border-border rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste the full job description here..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Skills</label>
            <textarea
              value={mySkills}
              onChange={(e) => setMySkills(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          {error && <p className="text-danger text-sm bg-danger/10 p-2.5 rounded-lg">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={buttonStyles("primary", "w-full")}
          >
            {loading ? "Analyzing..." : "Analyze Match"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-surface border border-border rounded-xl p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-3xl font-semibold text-primary">
                {result.matchPercentage}%
              </span>
              <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${recommendationStyle[result.recommendation]}`}>
                {result.recommendation}
              </span>
            </div>

            <p className="text-sm text-muted mb-5">{result.reasoning}</p>

            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-border">
                  <td className="py-2 pr-4 font-medium align-top w-1/3">Required Skills</td>
                  <td className="py-2 text-muted">{result.requiredSkills?.join(", ")}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-4 font-medium align-top">You Have</td>
                  <td className="py-2 text-primary">{result.matchedSkills?.join(", ") || "—"}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-4 font-medium align-top">Gap</td>
                  <td className="py-2 text-danger">{result.missingSkills?.join(", ") || "None"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchAnalyzer;