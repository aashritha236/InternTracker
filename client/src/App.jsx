import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    company: "",
    role: "",
    platform: "",
    status: "Applied",
    notes: "",
  });

  // FETCH DATA
  const fetchData = async () => {
    const res = await axios.get(`${API}/internships`);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD INTERNSHIP
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/internships`, form);
    setForm({
      company: "",
      role: "",
      platform: "",
      status: "Applied",
      notes: "",
    });
    fetchData();
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await axios.put(`${API}/internships/${id}`, { status });
    fetchData();
  };

  // DELETE
  const deleteItem = async (id) => {
    await axios.delete(`${API}/internships/${id}`);
    fetchData();
  };

  return (
    <div className="app">
      <h1>InternTracker</h1>

      <form onSubmit={handleSubmit} className="form">
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

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
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

        <button>Add Internship</button>
      </form>

      {/* STATS */}
      <div className="stats">
        <p>Total: {data.length}</p>
        <p>Offers: {data.filter(i => i.status === "Offer").length}</p>
        <p>Rejected: {data.filter(i => i.status === "Rejected").length}</p>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Applied")}>Applied</button>
        <button onClick={() => setFilter("Interview")}>Interview</button>
        <button onClick={() => setFilter("Rejected")}>Rejected</button>
        <button onClick={() => setFilter("Offer")}>Offer</button>
      </div>

      {/* LIST */}
      <div className="list">
        {data
          .filter((item) => filter === "All" || item.status === filter)
          .map((item) => (
            <div key={item._id} className="card">
              <h3>{item.company}</h3>
              <p>{item.role}</p>
              <p>{item.platform}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: item.status === "Offer" ? "lime" : "#60a5fa",
                  }}
                >
                  {item.status}
                </span>
              </p>

              <select
                value={item.status}
                onChange={(e) =>
                  updateStatus(item._id, e.target.value)
                }
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>

              <button onClick={() => deleteItem(item._id)}>
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;