import { useEffect, useState } from "react";
import { Eye, Mail, Phone, Users } from "lucide-react";
import api from "../../services/api";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  orderCount: number;
}

function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get<Customer[]>("/Customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading customers...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>View and manage customers who shop at Megatronics.</p>
        </div>
      </div>

      <div className="card admin-table-card">
        <div className="table-header">
          <h2>Customer Directory</h2>
          <span>
            {customers.length}{" "}
            {customers.length === 1 ? "customer" : "customers"}
          </span>
        </div>

        {customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={24} />
            </div>

            <h3>No customers yet</h3>

            <p>
              Customers will appear here once they place their first order.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>
                        {customer.firstName} {customer.lastName}
                      </strong>
                    </td>

                    <td>
                      <div
                        className="customer-contact"
                      >
                        <Mail size={14} />
                        {customer.email}
                      </div>
                    </td>

                    <td>
                      <div
                        className="customer-contact"
                      >
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </td>

                    <td>
                      <span className="status-badge">
                        {customer.orderCount}
                      </span>
                    </td>

                    <td>
                      {new Date(customer.createdAt).toLocaleDateString(
                        "en-ZA"
                      )}
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

export default CustomersAdmin;