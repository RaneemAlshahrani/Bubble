import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { getAuthToken } from "../utils/auth";
import { formatSAR } from "../utils/currency";
import { useTheme } from "../context/ThemeContext";

function AdminDashboard() {
  const { themeData } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [salesFilter, setSalesFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ responsive listener (IMPORTANT FIX)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `http://localhost:5000/api/admin/dashboard?salesFilter=${salesFilter}`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [salesFilter]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
  }

  const {
    totalSales = 0,
    totalOrders = 0,
    totalCustomers = 0,
    totalProducts = 0,
    recentOrders = [],
    topProducts = [],
    salesChartData = [],
  } = dashboardData || {};

  return (
    <div style={{ display: "grid", gap: "16px", padding: isMobile ? "10px" : "0" }}>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "12px",
      }}>
        <StatCard title="Total Sales" value={formatSAR(totalSales)} color={themeData.primary} />
        <StatCard title="Orders" value={totalOrders} color={themeData.primaryLight} />
        <StatCard title="Customers" value={totalCustomers} color={themeData.primary} />
        <StatCard title="Products" value={totalProducts} color={themeData.primaryLight} />
      </div>

      {/* Chart */}
      <div style={{
        background: themeData.cardBg,
        border: `1px solid ${themeData.borderColor}`,
        borderRadius: "16px",
        padding: isMobile ? "12px" : "20px",
      }}>
        <h2 style={{ fontSize: isMobile ? "16px" : "20px" }}>Sales Overview</h2>

        <div style={{ width: "100%", height: isMobile ? "220px" : "300px" }}>
          <ResponsiveContainer>
            <LineChart data={salesChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatSAR(v)} />
              <Line type="monotone" dataKey="sales" stroke={themeData.primary} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders + Products */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "12px",
      }}>
        
        {/* Orders */}
        <div style={cardStyle(themeData, isMobile)}>
          <h2>Recent Orders</h2>
          {recentOrders.slice(0, 5).map((o) => (
            <div key={o._id} style={orderRow}>
              <span>#{o._id?.slice(-6)}</span>
              <span>{formatSAR(o.totalPrice)}</span>
            </div>
          ))}
        </div>

        {/* Products */}
        <div style={cardStyle(themeData, isMobile)}>
          <h2>Top Products</h2>
          {topProducts.slice(0, 5).map((p, i) => (
            <div key={i} style={orderRow}>
              <span>{p.name}</span>
              <span>Sold: {p.quantity}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }) => (
  <div style={{
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    background: "rgba(255,255,255,0.1)",
  }}>
    <p>{title}</p>
    <h3 style={{ color }}>{value}</h3>
  </div>
);

const cardStyle = (theme, isMobile) => ({
  background: theme.cardBg,
  border: `1px solid ${theme.borderColor}`,
  borderRadius: "16px",
  padding: isMobile ? "12px" : "20px",
});

const orderRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
};

export default AdminDashboard;