import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ListTodo, User, LogOut, TrendingUp, Rocket } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Rocket size={24} color="#fbbf24" />
          InternTracker
        </h2>
      </div>
      <div className="sidebar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={24} />
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <ListTodo size={24} />
          <span className="nav-text">Applications</span>
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <TrendingUp size={24} />
          <span className="nav-text">Insights</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <User size={24} />
          <span className="nav-text">Profile</span>
        </NavLink>
      </div>
      <div className="sidebar-footer">
        <button 
          className="nav-item" 
          onClick={handleLogout} 
          style={{ cursor: "pointer", background: "none", border: "none", width: "100%", textAlign: "left", fontFamily: "inherit" }}
        >
          <LogOut size={24} />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </nav>
  );
}
