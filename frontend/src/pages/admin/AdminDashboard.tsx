import { useEffect, useState } from "react";
import api from "../../services/api";

interface DashboardData {
  products: number;
  categories: number;
  orders: number;
  sales: number;
}

function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>({
    products: 0,
    categories: 0,
    orders: 0,
    sales: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get<DashboardData>("/Dashboard");

      setDashboard(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
        color: "#111",
      }}
    >
      <h1>Megatronics Admin Dashboard</h1>

      <p>
        Overview of your Megatronics store.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
          }}
        >
          <h3>Products</h3>
          <h2>{dashboard.products}</h2>
          <p>Total products</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
          }}
        >
          <h3>Categories</h3>
          <h2>{dashboard.categories}</h2>
          <p>Total categories</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
          }}
        >
          <h3>Orders</h3>
          <h2>{dashboard.orders}</h2>
          <p>Total orders</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
          }}
        >
          <h3>Sales</h3>
          <h2>R {dashboard.sales.toFixed(2)}</h2>
          <p>Total sales</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;