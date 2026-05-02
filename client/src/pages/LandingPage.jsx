import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1 style={{ fontSize: "64px", color: "#fbbf24", marginBottom: "16px" }}>InternTracker</h1>
      <p style={{ fontSize: "24px", color: "#94a3b8", marginBottom: "40px" }}>
        Organize your internship search and land your dream offer.
      </p>
      <Link to="/login">
        <button className="add-btn" style={{ maxWidth: "200px", padding: "16px 32px", fontSize: "18px" }}>
          Get Started
        </button>
      </Link>
    </div>
  );
}
