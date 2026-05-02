import { useEffect, useState } from "react";
import axios from "axios";
import { User, Award, Briefcase, Save } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const [internships, setInternships] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    college: "",
    title: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchData = async () => {
    try {
      const headers = { "user-email": userEmail };
      const [internshipsRes, profileRes] = await Promise.all([
        axios.get(`${API}/internships`, { headers }),
        axios.get(`${API}/profile`, { headers })
      ]);
      
      setInternships(internshipsRes.data);
      
      if (profileRes.data) {
        setProfile({
          name: profileRes.data.name || "",
          phone: profileRes.data.phone || "",
          college: profileRes.data.college || "",
          title: profileRes.data.title || ""
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const headers = { "user-email": userEmail };
      await axios.put(`${API}/profile`, { ...profile, email: userEmail }, { headers });
      showToast("Profile saved successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  const totalApplications = internships.length;
  const offerCount = internships.filter((i) => i.status === "Offer").length;

  if (loading) {
    return (
      <div className="app">
        <h1 style={{ textAlign: "left", marginBottom: "40px", fontSize: "36px" }}>Profile</h1>
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {message && <div className="toast">{message}</div>}
      <h1 style={{ textAlign: "left", marginBottom: "40px", fontSize: "36px" }}>Profile</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "start" }}>
        
        {/* Profile Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "40px 24px" }}>
          <div style={{ 
            width: "120px", height: "120px", borderRadius: "50%", 
            backgroundColor: "#334155", display: "flex", justifyContent: "center", 
            alignItems: "center", marginBottom: "24px", border: "4px solid #1e293b",
            boxShadow: "0 0 0 2px #3b82f6"
          }}>
            <User size={64} color="#94a3b8" />
          </div>
          
          <h2 style={{ margin: "0 0 8px 0", fontSize: "28px", color: "#f8fafc" }}>{profile.name || userEmail}</h2>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "16px" }}>{profile.title || "Software Engineering Intern"}</p>
          <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "14px" }}>{userEmail}</p>
          
          <div style={{ display: "flex", gap: "24px", marginTop: "32px", width: "100%", maxWidth: "400px" }}>
            <div style={{ flex: 1, backgroundColor: "#0f172a", padding: "16px", borderRadius: "16px", border: "1px solid #334155" }}>
              <Briefcase size={24} color="#60a5fa" style={{ marginBottom: "8px" }} />
              <h3 style={{ margin: 0, fontSize: "24px", color: "#f8fafc" }}>{totalApplications}</h3>
              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Applications</p>
            </div>
            <div style={{ flex: 1, backgroundColor: "#0f172a", padding: "16px", borderRadius: "16px", border: "1px solid #334155" }}>
              <Award size={24} color="#4ade80" style={{ marginBottom: "8px" }} />
              <h3 style={{ margin: 0, fontSize: "24px", color: "#f8fafc" }}>{offerCount}</h3>
              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Offers</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: "24px", fontSize: "24px", color: "#f8fafc" }}>Edit Details</h2>
          <form onSubmit={saveProfile} style={{ margin: 0 }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8", fontSize: "14px" }}>Full Name</label>
            <input 
              name="name" 
              value={profile.name} 
              onChange={handleProfileChange} 
              placeholder="e.g. John Doe" 
            />

            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8", fontSize: "14px" }}>Job Title</label>
            <input 
              name="title" 
              value={profile.title} 
              onChange={handleProfileChange} 
              placeholder="e.g. Software Engineer" 
            />

            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8", fontSize: "14px" }}>College / University</label>
            <input 
              name="college" 
              value={profile.college} 
              onChange={handleProfileChange} 
              placeholder="e.g. MIT" 
            />

            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8", fontSize: "14px" }}>Phone Number</label>
            <input 
              name="phone" 
              value={profile.phone} 
              onChange={handleProfileChange} 
              placeholder="e.g. +1 234 567 890" 
            />

            <button 
              type="submit" 
              className="add-btn" 
              style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px" }}
              disabled={isSaving}
            >
              <Save size={20} />
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
