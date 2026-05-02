// frontend/src/pages/InventoryManagement.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function InventoryManagement() {
  const { themeData } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/inventory");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, newStock) => {
    await fetch(`http://localhost:5000/api/admin/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
    fetchProducts();
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading inventory...</div>;

  return (
    <div style={{
      background: themeData.cardBg,
      borderRadius: "28px",
      padding: "24px",
    }}>
      <h1 style={{ margin: "0 0 24px", color: themeData.textColor }}>Inventory Management</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {products.map(product => (
          <div key={product._id} style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center",
          }}>
            <img src={product.image} alt={product.name} style={{ width: "100px", height: "100px", objectFit: "contain" }} />
            <h3 style={{ margin: "12px 0 6px", color: themeData.textColor }}>{product.name}</h3>
            <p style={{ color: product.stock <= 5 ? "#ff4d6d" : "#39a86f", fontWeight: "bold" }}>
              {product.stock <= 5 ? "⚠️ Low Stock" : "✓ In Stock"}
            </p>
            <input
              type="number"
              value={product.stock}
              onChange={(e) => updateStock(product._id, parseInt(e.target.value))}
              style={{
                width: "80px",
                padding: "8px",
                textAlign: "center",
                borderRadius: "8px",
                border: "1px solid #ccc",
                margin: "10px 0",
              }}
            />
            <p style={{ color: themeData.textLight }}>Current: {product.stock} units</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryManagement;