import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const PIPELINE = ["Saved", "Applied", "Interview", "Offer"];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-ink">
      <nav className="flex justify-between items-center px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display text-xl font-semibold">CareerTrack Lite</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              to="/dashboard"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-2">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-16 pb-20 text-center">
          <p className="font-body text-sm tracking-widest uppercase text-muted mb-4">
            Job search, organized
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight max-w-3xl mx-auto">
            Every application,{" "}
            <span className="text-primary">one clear pipeline</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto mt-6 text-lg">
            Stop losing track of where you applied. Log every company, follow
            each stage, and see exactly how close you are to an offer.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-block mt-8 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-medium text-lg hover:opacity-90 transition-opacity"
          >
            {user ? "Open Dashboard" : "Start tracking — it's free"}
          </Link>

          {/* Signature: real pipeline, not decoration — this is the actual status flow every application moves through */}
          <div className="mt-20 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {PIPELINE.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2 md:gap-4">
                <div className="bg-surface border border-border rounded-xl px-5 py-4 text-left min-w-[120px]">
                  <span className="text-xs text-muted font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-base font-medium mt-1">{stage}</p>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span className="text-accent text-xl">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 pb-24">
          {[
            {
              title: "Track everything",
              desc: "Company, role, source, status, and notes for every application in one place.",
            },
            {
              title: "See your momentum",
              desc: "Dashboard stats show what's applied, interviewing, or turned into an offer.",
            },
            {
              title: "Find anything fast",
              desc: "Search or filter by company, title, or status in seconds.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h3 className="font-display font-medium text-lg mb-2">{card.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Landing;