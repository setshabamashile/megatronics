import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import api from "../../services/api";

interface Order {
  id: number;
  orderNumber: string;
  deliveryName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentStatus: number;
  status: number;
  createdAt: string;
}

function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get<Order[]>("/Orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status: number) => {
    const statuses = [
      "Pending",
      "Paid",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    return statuses[status] ?? "Unknown";
  };

  if (loading) {
    return <div className="page-loading">Loading orders...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders and payments.</p>
        </div>
      </div>

      <div className="card admin-table-card">
        <div className="table-header">
          <h2>All Orders</h2>
          <span>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>
              Customer orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                    </td>

                    <td>{order.deliveryName}</td>

                    <td>
                      R {order.total.toFixed(2)}
                    </td>

                    <td>
                      <span className="status-badge">
                        {order.paymentStatus === 1
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge">
                        {getStatus(order.status)}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-ZA")}
                    </td>

                    <td>
                      <button className="icon-button edit">
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersAdmin;