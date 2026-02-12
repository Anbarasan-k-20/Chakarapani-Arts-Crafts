import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders, cancelOrder } from "../redux/orderSlice";
import { FaRupeeSign, FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { CircularProgress, Alert } from "@mui/material";

const OrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get auth state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  // ✅ Get orders state
  const { orders, loading, error } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  // For displaying order details modal

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      alert("Please login to view orders");
      navigate("/login");
      return;
    }

    // ✅ Fetch user's orders on component mount
    dispatch(fetchUserOrders());
  }, [isLoggedIn, navigate, dispatch]);

  // ✅ Handle cancel order
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmCancel) return;

    try {
      await dispatch(
        cancelOrder({
          orderId,
          reason: "Cancelled by user",
        }),
      ).unwrap();

      alert("✅ Order cancelled successfully");

      // ✅ Refresh orders list
      dispatch(fetchUserOrders());
    } catch (err) {
      alert(`❌ Failed to cancel: ${err}`);
    }
  };

  // ✅ Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-warning", text: "Pending", icon: FaBox },
      confirmed: { bg: "bg-info", text: "Confirmed", icon: FaCheckCircle },
      processing: { bg: "bg-primary", text: "Processing", icon: FaBox },
      shipped: { bg: "bg-info", text: "Shipped", icon: FaTruck },
      delivered: { bg: "bg-success", text: "Delivered", icon: FaCheckCircle },
      cancelled: { bg: "bg-danger", text: "Cancelled", icon: FaBox },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return config;
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12">
          <h1 className="fw-bold mb-2">My Orders</h1>
          <p className="text-muted">
            Welcome, <strong>{user?.name}</strong>
          </p>
        </div>
      </div>

      {/* ✅ ERROR MESSAGE */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* ✅ LOADING STATE */}
      {loading && (
        <div className="text-center py-5">
          <CircularProgress />
          <p className="mt-3">Loading your orders...</p>
        </div>
      )}

      {/* ✅ NO ORDERS */}
      {!loading && orders.length === 0 && (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <FaBox size={64} className="mb-3 text-muted" />
            <h4>No Orders Yet</h4>
            <p className="text-muted">You haven't placed any orders yet.</p>
            <button
              className="btn btn-dark mt-3"
              onClick={() => navigate("/allproduct")}
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}

      {/* ✅ ORDERS LIST */}
      {!loading && orders.length > 0 && (
        <div className="row g-4">
          {orders.map((order) => {
            const statusConfig = getStatusBadge(order.orderStatus);

            return (
              <div key={order._id} className="col-12">
                <div className="card shadow-sm border-0 hover">
                  {/* ORDER HEADER */}
                  <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        <strong>Order #{order.orderNumber}</strong>
                      </h6>
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </small>
                    </div>
                    <div>
                      <span
                        className={`badge ${statusConfig.bg} px-3 py-2 fs-6`}
                      >
                        {statusConfig.text}
                      </span>
                    </div>
                  </div>

                  {/* ORDER BODY */}
                  <div className="card-body">
                    {/* ITEMS */}
                    <div className="mb-4 pb-4 border-bottom">
                      <h6 className="fw-bold mb-3">Items</h6>
                      <div className="row">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="col-md-6 mb-3">
                            <div className="d-flex gap-2">
                              <img
                                src={item.productDetails?.image}
                                alt={item.productDetails?.title}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                              <div>
                                <p className="fw-semibold small mb-1">
                                  {item.productDetails?.title}
                                </p>
                                {item.selectedSize && (
                                  <p className="text-muted small mb-1">
                                    Size: {item.selectedSize.dimension}
                                  </p>
                                )}
                                <p className="text-muted small">
                                  Qty: {item.qty} × ₹
                                  {item.price.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PRICING SUMMARY */}
                    <div className="row mb-4 pb-4 border-bottom">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Delivery Address</h6>
                        <p className="small mb-2">
                          <strong>{order.shippingAddress.fullName}</strong>
                        </p>
                        <p className="text-muted small">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && (
                            <>
                              <br />
                              {order.shippingAddress.addressLine2}
                            </>
                          )}
                          <br />
                          {order.shippingAddress.city},
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-3">Order Total</h6>
                        <div className="small">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Subtotal:</span>
                            <span>
                              ₹{order.subtotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <span>Shipping:</span>
                            <span className="text-success">Free</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                            <span>Tax (18%):</span>
                            <span>₹{order.tax.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span className="text-success fs-5">
                              ₹{order.totalAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Payment Status</h6>
                        <p className="small">
                          <span
                            className={`badge ${
                              order.paymentStatus === "completed"
                                ? "bg-success"
                                : "bg-warning"
                            }`}
                          >
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Payment Method</h6>
                        <p className="text-muted small">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : order.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="card-footer bg-white border-top d-flex gap-2 justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>

                    {/* Cancel button only for pending/confirmed orders */}
                    {["pending", "confirmed"].includes(order.orderStatus) && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ ORDER DETAILS MODAL */}
      {selectedOrder && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setSelectedOrder(null)}
          />
          <div
            className="modal fade show d-block"
            style={{ zIndex: 1055 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Order #{selectedOrder.orderNumber}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedOrder(null)}
                  />
                </div>
                <div className="modal-body">
                  {/* Timeline of order status */}
                  <h6 className="fw-bold mb-3">Order Timeline</h6>
                  <div>
                    {selectedOrder.orderHistory?.map((history, idx) => (
                      <div key={idx} className="mb-3 d-flex gap-3">
                        <div className="text-center" style={{ width: "60px" }}>
                          <div
                            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <FaCheckCircle />
                          </div>
                        </div>
                        <div>
                          <p className="fw-bold mb-1">
                            {history.status.toUpperCase()}
                          </p>
                          <p className="text-muted small mb-1">
                            {new Date(history.timestamp).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                          {history.note && (
                            <p className="small text-secondary">
                              {history.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
