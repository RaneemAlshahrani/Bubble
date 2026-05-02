// frontend/src/components/CustomerServiceLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CustomerServiceSidebar from "./CustomerServiceSidebar";
import { useTheme } from "../context/ThemeContext";

function CustomerServiceLayout() {
  const { themeData } = useTheme();
  
  return (
    <div className={`${themeData.name}-page`} style={{
      minHeight: "100vh",
      background: themeData.background,
      position: "relative",
      overflowX: "hidden",
    }}>
      <Navbar />
      <div style={{
        paddingTop: "90px",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingBottom: "30px",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "18px",
        }}>
          <CustomerServiceSidebar activePage={window.location.pathname.split('/')[2] || "tickets"} />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CustomerServiceLayout;