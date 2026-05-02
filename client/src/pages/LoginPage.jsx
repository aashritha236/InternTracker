import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("userEmail", res.data.email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form className="form" onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Welcome Back</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {error && <p style={{ color: "#ef4444", marginTop: 0, marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{error}</p>}
        <button type="submit" className="add-btn">Log In</button>
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Don't have an account? <Link to="/register" style={{ color: "#fbbf24" }}>Register</Link>
        </p>
      </form>
    </div>
  );
}
