import { useEffect, useState } from "react";
import axios from "axios";
import { Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function InsightsPage() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const headers = { "user-email": localStorage.getItem("userEmail") };
    const res = await axios.get(`${API}/internships`, { headers });
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalApplications = data.length;
  const offerCount = data.filter((i) => i.status === "Offer").length;
  const interviewCount = data.filter((i) => i.status === "Interview").length;
  const rejectedCount = data.filter((i) => i.status === "Rejected").length;

  const interviewsAndOffers = interviewCount + offerCount;

  const successRate = totalApplications > 0
    ? Math.round((interviewsAndOffers / totalApplications) * 100)
    : 0;

  const rejectionRate = totalApplications > 0
    ? Math.round((rejectedCount / totalApplications) * 100)
    : 0;

  let insightMessage = "";
  let Icon = Lightbulb;
  let color = "#60a5fa";

  if (totalApplications === 0) {
    insightMessage = "Start tracking your applications to see insights!";
  } else if (successRate < 20) {
    insightMessage = "Consider refining your resume or applying to more tailored roles. Try focusing on quality over quantity.";
    Icon = AlertTriangle;
    color = "#f87171";
  } else if (successRate <= 50) {
    insightMessage = "You're getting traction! Keep preparing for interviews and optimizing your approach.";
    Icon = TrendingUp;
    color = "#fbbf24";
  } else {
    insightMessage = "Excellent success rate! You have a strong profile. Keep up the great work!";
    Icon = TrendingUp;
    color = "#4ade80";
  }

  return (
    <div className="app">
      <h1 style={{ textAlign: "left", marginBottom: "40px", fontSize: "36px" }}>Insights</h1>
      
      <div className="card" style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "30px" }}>
        <div style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "16px" }}>
          <Icon size={48} color={color} />
        </div>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "24px", color: "#f8fafc" }}>Application Strategy</h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.5", margin: 0 }}>
            {insightMessage}
          </p>
        </div>
      </div>

      <div className="dashboard" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="dashboard-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
          <h4>Conversion Rate</h4>
          <h2 style={{ color: "#a78bfa" }}>{successRate}%</h2>
          <p style={{ margin: "12px 0 0 0", color: "#64748b", fontSize: "14px" }}>Interviews and offers out of total applications.</p>
        </div>
        <div className="dashboard-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
          <h4>Rejection Rate</h4>
          <h2 style={{ color: "#f87171" }}>{rejectionRate}%</h2>
          <p style={{ margin: "12px 0 0 0", color: "#64748b", fontSize: "14px" }}>Rejected applications out of total applications.</p>
        </div>
      </div>
    </div>
  );
}
