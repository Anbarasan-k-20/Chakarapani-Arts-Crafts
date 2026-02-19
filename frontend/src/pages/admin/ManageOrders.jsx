import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FaEye } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);

      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, orderStatus: newStatus } : order,
        ),
      );
      alert("Order status updated");
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4 section-1">Manage Orders</h2>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <small className="text-muted">
                    #{order._id.substring(20)}
                  </small>
                </td>
                <td>
                  <div>{order.user?.name || "Unknown"}</div>
                  <small className="text-muted">{order.user?.email}</small>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <select
                    className={`form-select form-select-sm border-0 fw-bold ${
                      order.orderStatus === "Delivered"
                        ? "text-success bg-success-subtle"
                        : order.orderStatus === "Dispatched"
                          ? "text-warning bg-warning-subtle"
                          : order.orderStatus === "Cancelled"
                            ? "text-danger bg-danger-subtle"
                            : "text-primary bg-primary-subtle"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  {/* Placeholder for future detailed view */}
                  <button className="btn btn-sm btn-outline-secondary" disabled>
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
