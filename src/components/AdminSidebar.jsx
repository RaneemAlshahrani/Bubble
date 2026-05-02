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
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(6px, 2vw, 10px) clamp(10px, 3vw, 22px)",
          margin: "clamp(6px, 2vw, 16px) auto",
          maxWidth: "1000px",
          width: "90%",
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "clamp(16px, 4vw, 30px)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        <img
          src={logo}
          alt="Logo"
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
              padding: "clamp(5px, 1.5vw, 10px) clamp(10px, 3vw, 20px)",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: "#3b3b3b",
              fontSize: isMobile ? "12px" : "15px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "12px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            overflowX: "auto",
            zIndex: 99,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                whiteSpace: "nowrap",
                padding: "6px 10px",
                borderRadius: "10px",
                background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                color: "#2e3d4c",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "14px",
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default AdminSidebar;