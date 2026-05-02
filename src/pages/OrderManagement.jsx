// frontend/src/pages/OrderManagement.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatSAR } from "../utils/currency";

function OrderManagement() {
  const { themeData } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading orders...</div>;

  return (
    <div style={{
      background: themeData.cardBg,
      borderRadius: "28px",
      padding: "24px",
    }}>
      <h1 style={{ margin: "0 0 24px", color: themeData.textColor }}>Order Management</h1>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "12px", textAlign: "left", color: themeData.textColor }}>Order ID</th>
              <th style={{ padding: "12px", textAlign: "left", color: themeData.textColor }}>Customer</th>
              <th style={{ padding: "12px", textAlign: "left", color: themeData.textColor }}>Total</th>
              <th style={{ padding: "12px", textAlign: "left", color: themeData.textColor }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", color: themeData.textColor }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <td style={{ padding: "12px", color: themeData.textLight }}>#{order._id?.slice(-8)}</td>
                <td style={{ padding: "12px", color: themeData.textLight }}>{order.customer?.fullName || "Guest"}</td>
                <td style={{ padding: "12px", color: themeData.primary, fontWeight: "bold" }}>{formatSAR(order.totalPrice)}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: order.status === "Delivered" ? "#d7f2d4" : order.status === "Shipped" ? "#d8e7ff" : "#ffd7c9",
                    color: order.status === "Delivered" ? "#3d9b44" : order.status === "Shipped" ? "#3d6fd1" : "#d96a3a",
                  }}>
                    {order.status || "Processing"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={order.status || "Processing"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{
                      padding: "6px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;