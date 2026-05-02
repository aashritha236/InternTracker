import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const headers = { "user-email": localStorage.getItem("userEmail") };
      const res = await axios.get(`${API}/internships`, { headers });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <h1 style={{ textAlign: "left", marginBottom: "40px", fontSize: "36px" }}>Welcome back! 👋</h1>
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="app">
        <h1 style={{ textAlign: "left", marginBottom: "40px", fontSize: "36px" }}>Welcome back! 👋</h1>
        <div className="card" style={{ textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ color: "#fbbf24", marginBottom: "16px", fontSize: "24px" }}>No applications yet!</h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "400px" }}>Start tracking your internships on the Applications tab to see your analytics and insights here.</p>
        </div>
      </div>
    );
  }

  const totalApplications = data.length;
  const appliedCount = data.filter((i) => i.status === "Applied").length;
  const interviewCount = data.filter((i) => i.status === "Interview").length;
  const offerCount = data.filter((i) => i.status === "Offer").length;
  const rejectedCount = data.filter((i) => i.status === "Rejected").length;

  const interviewsAndOffers = interviewCount + offerCount;

  const successRate = totalApplications > 0
    ? Math.round((interviewsAndOffers / totalApplications) * 100)
    : 0;

  const rejectionRate = totalApplications > 0
    ? Math.round((rejectedCount / totalApplications) * 100)
    : 0;

  const statusData = [
    { name: "Applied", value: appliedCount, color: "#60a5fa" },
    { name: "Interview", value: interviewCount, color: "#a78bfa" },
    { name: "Offer", value: offerCount, color: "#4ade80" },
    { name: "Rejected", value: rejectedCount, color: "#f87171" },
  ].filter(item => item.value > 0);

  const barData = [
    { name: "Applied", count: appliedCount },
    { name: "Interview", count: interviewCount },
    { name: "Offer", count: offerCount },
    { name: "Rejected", count: rejectedCount },
  ];

  return (
    <div className="app">
      <h1 style={{ textAlign: "left", marginBottom: "40px", fontSize: "36px" }}>Welcome back! 👋</h1>
      
      <div className="dashboard">
        <div className="dashboard-card">
          <h4>Total</h4>
          <h2>{totalApplications}</h2>
        </div>
        <div className="dashboard-card">
          <h4>Applied</h4>
          <h2 style={{ color: "#60a5fa" }}>{appliedCount}</h2>
        </div>
        <div className="dashboard-card">
          <h4>Interview</h4>
          <h2 style={{ color: "#a78bfa" }}>{interviewCount}</h2>
        </div>
        <div className="dashboard-card">
          <h4>Offer</h4>
          <h2 style={{ color: "#4ade80" }}>{offerCount}</h2>
        </div>
        <div className="dashboard-card">
          <h4>Rejected</h4>
          <h2 style={{ color: "#f87171" }}>{rejectedCount}</h2>
        </div>
        <div className="dashboard-card">
          <h4>Success Rate</h4>
          <h2 style={{ color: "#fbbf24" }}>{successRate}%</h2>
        </div>
        <div className="dashboard-card">
          <h4>Rejection Rate</h4>
          <h2 style={{ color: "#f87171" }}>{rejectionRate}%</h2>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card" style={{ height: "350px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: "10px" }}>Status Distribution</h3>
          <div style={{ flexGrow: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }} 
                  itemStyle={{ color: "#f8fafc" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ height: "350px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: "10px" }}>Applications by Status</h3>
          <div style={{ flexGrow: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Recent Applications</h2>
        <div className="list">
          {data.slice(0, 3).map((item) => (
            <div key={item._id} className="card">
              <h3>{item.company}</h3>
              <p>{item.role} • {item.platform}</p>
              <p style={{ marginTop: "16px" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: item.status === "Offer" ? "#4ade80" : item.status === "Rejected" ? "#f87171" : item.status === "Interview" ? "#a78bfa" : "#60a5fa",
                    fontWeight: "600"
                  }}
                >
                  {item.status}
                </span>
              </p>
            </div>
          ))}
          {data.length === 0 && <p style={{ color: "#94a3b8" }}>No applications tracked yet.</p>}
        </div>
      </div>
    </div>
  );
}
