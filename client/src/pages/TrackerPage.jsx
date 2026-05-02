import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function TrackerPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    company: "",
    role: "",
    platform: "",
    status: "Applied",
    notes: "",
  });

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const headers = { "user-email": localStorage.getItem("userEmail") };
      await axios.post(`${API}/internships`, form, { headers });
      setForm({
        company: "",
        role: "",
        platform: "",
        status: "Applied",
        notes: "",
      });
      fetchData();
      showToast("Application added successfully!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    const headers = { "user-email": localStorage.getItem("userEmail") };
    await axios.put(`${API}/internships/${id}`, { status }, { headers });
    fetchData();
    showToast("Status updated!");
  };

  const deleteItem = async (id) => {
    const headers = { "user-email": localStorage.getItem("userEmail") };
    await axios.delete(`${API}/internships/${id}`, { headers });
    fetchData();
    showToast("Application deleted!");
  };

  if (loading) {
    return (
      <div className="app">
        <h1 style={{ textAlign: "left", fontSize: "36px", margin: 0, marginBottom: "30px" }}>Applications</h1>
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {message && <div className="toast">{message}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ textAlign: "left", fontSize: "36px", margin: 0 }}>Applications</h1>
      </div>

      <div className="form-container" style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "#f8fafc" }}>Track New Application</h2>
        <form onSubmit={handleSubmit} className="form" style={{ margin: 0, maxWidth: "100%" }}>
        <div className="row">
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <input
            name="platform"
            placeholder="Platform"
            value={form.platform}
            onChange={handleChange}
            required
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>
        </div>

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit" className="add-btn" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Internship"}
        </button>
      </form>
      </div>

      <div className="filters">
        <button className="filter-btn" onClick={() => setFilter("All")}>All</button>
        <button className="filter-btn" onClick={() => setFilter("Applied")}>Applied</button>
        <button className="filter-btn" onClick={() => setFilter("Interview")}>Interview</button>
        <button className="filter-btn" onClick={() => setFilter("Rejected")}>Rejected</button>
        <button className="filter-btn" onClick={() => setFilter("Offer")}>Offer</button>
      </div>

      <div className="list">
        {data.filter((item) => filter === "All" || item.status === filter).length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>No applications found. Start tracking!</p>
          </div>
        ) : (
          data.filter((item) => filter === "All" || item.status === filter).map((item) => (
            <div key={item._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ margin: 0 }}>{item.company}</h3>
                <span
                  style={{
                    backgroundColor: item.status === "Offer" ? "rgba(74, 222, 128, 0.2)" : item.status === "Rejected" ? "rgba(248, 113, 113, 0.2)" : item.status === "Interview" ? "rgba(167, 139, 250, 0.2)" : "rgba(96, 165, 250, 0.2)",
                    color: item.status === "Offer" ? "#4ade80" : item.status === "Rejected" ? "#f87171" : item.status === "Interview" ? "#a78bfa" : "#60a5fa",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                >
                  {item.status}
                </span>
              </div>
              <p style={{ margin: "0 0 16px 0", color: "#94a3b8", fontSize: "14px" }}>{item.role} • {item.platform}</p>

              <select
                value={item.status}
                onChange={(e) => updateStatus(item._id, e.target.value)}
                style={{ marginBottom: "0" }}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>

              <button className="delete-btn" onClick={() => deleteItem(item._id)}>
                Delete Application
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
