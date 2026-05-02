// frontend/src/components/AdminSidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/bubble-logo.png";
import { useTheme } from "../context/ThemeContext";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { themeData } = useTheme();
  
  const activePage = location.pathname.split('/')[2] || "dashboard";

  const menuItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "🛍️" },
    { name: "Inventory", path: "/admin/inventory", icon: "📦" },
    { name: "Orders", path: "/admin/orders", icon: "📋" },
    { name: "Reviews", path: "/admin/reviews", icon: "⭐" },
    { name: "Promotions", path: "/admin/promotions", icon: "🏷️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      height: "100%",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "24px",
        padding: "20px",
        textAlign: "center",
        marginBottom: "10px",
      }}>
        <img src={logo} alt="Bubble Logo" style={{ width: "100px", objectFit: "contain" }} />
      </div>

      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: activePage === item.path.split('/')[2] ? themeData.primary : "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "16px",
            padding: "14px 16px",
            fontFamily: "Josefin Sans, sans-serif",
            fontSize: "15px",
            color: activePage === item.path.split('/')[2] ? "white" : themeData.textColor,
            fontWeight: activePage === item.path.split('/')[2] ? "600" : "400",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          {item.name}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "16px",
          padding: "14px 16px",
          fontFamily: "Josefin Sans, sans-serif",
          fontSize: "15px",
          color: themeData.textColor,
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        <span style={{ fontSize: "20px" }}>🚪</span>
        Logout
      </button>
    </div>
  );
}

export default AdminSidebar;