import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/register`, { name, email, password });
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form className="form" onSubmit={handleRegister} style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Create Account</h2>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ marginBottom: "20px" }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ marginBottom: "20px" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ marginBottom: "24px" }}
        />
        {error && <p style={{ color: "#ef4444", marginTop: 0, marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>{error}</p>}
        <button type="submit" className="add-btn">Sign Up</button>
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Already have an account? <Link to="/login" style={{ color: "#fbbf24" }}>Log In</Link>
        </p>
      </form>
    </div>
  );
}
