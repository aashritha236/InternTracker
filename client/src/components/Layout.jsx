import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const isAuthenticated = !!localStorage.getItem("userEmail");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout" style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
