import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../redux/orderSlice";
import {
  FaRupeeSign,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Alert, CircularProgress } from "@mui/material";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get auth and cart data
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order,
  );

  const cartLoading = useSelector((state) => state.cart.loading); // ✅ Get cart loading state

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }

    // ✅ Redirect if cart is empty (only if NOT loading)
    if (!cartLoading && cartItems.length === 0) {
      alert("Your cart is empty");
      navigate("/cart");
      return;
    }
  }, [isLoggedIn, cartItems.length, cartLoading, navigate]);

  // ✅ SHIPPING ADDRESS FORM STATE
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    // Pre-fill with user name
    email: user?.email || "",
    // Pre-fill with user email
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // ✅ PAYMENT METHOD STATE
  const [paymentMethod, setPaymentMethod] = useState("cod");
  // Default: Cash on Delivery

  // ✅ SPECIAL INSTRUCTIONS STATE
  const [specialInstructions, setSpecialInstructions] = useState("");
  // Delivery notes

  // ✅ FORM VALIDATION ERRORS
  const [errors, setErrors] = useState({});

  // ✅ PRICING CALCULATIONS
  const subtotal = cartTotal;
  // Sum of all items
  const shippingCost = 0;
  // Free shipping in India
  const tax = Math.round(subtotal * 0.18);
  // 18% GST
  const totalAmount = subtotal + shippingCost + tax;

  // ✅ Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    // Phone validation - only digits
    if (name === "phone" && value !== "") {
      if (!/^\d{10}$/.test(value) && value.length >= 10) {
        return;
        // Don't update if invalid
      }
    }

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ✅ Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // ✅ Validate full name
    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // ✅ Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingAddress.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(shippingAddress.email)) {
      newErrors.email = "Invalid email format";
    }

    // ✅ Validate phone
    if (!shippingAddress.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // ✅ Validate address
    if (!shippingAddress.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    // ✅ Validate city
    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    // ✅ Validate state
    if (!shippingAddress.state.trim()) {
      newErrors.state = "State is required";
    }

    // ✅ Validate postal code
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle order submission
  const handlePlaceOrder = async () => {
    // ✅ Validate form
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    // ✅ Prepare order data
    const orderData = {
      shippingAddress,
      paymentMethod,
      specialInstructions,
    };

    try {
      // ✅ Dispatch Redux action to create order
      await dispatch(createOrder(orderData)).unwrap();

      // ✅ Order created successfully
      alert("✅ Order placed successfully!");

      // ✅ Redirect to orders page
      navigate("/orders");
    } catch (error) {
      // Error handled by Redux
      console.error("Order creation failed:", error);
    }
  };

  if (!isLoggedIn || cartItems.length === 0) {
    return null;
    // Will redirect, don't render anything
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* ✅ LEFT SECTION - ORDER SUMMARY */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 mb-4">
            {/* CART ITEMS SUMMARY */}
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Order Summary</h5>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
                >
                  <div className="d-flex gap-3 flex-grow-1">
                    <img
                      src={item.productDetails?.image}
                      alt={item.productDetails?.title}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div>
                      <p className="fw-semibold mb-1">
                        {item.productDetails?.title}
                      </p>
                      {item.selectedSize && (
                        <p className="text-muted small mb-1">
                          Size: {item.selectedSize.dimension}
                        </p>
                      )}
                      <p className="text-muted small">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold mb-0">
                      <FaRupeeSign />
                      {(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ SHIPPING ADDRESS FORM */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <FaMapMarkerAlt className="me-2" />
                Shipping Address
              </h5>

              <form>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""
                      }`}
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    disabled={orderLoading}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                    value={shippingAddress.email}
                    onChange={handleAddressChange}
                    disabled={orderLoading}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Phone Number *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">+91</span>
                    <input
                      type="text"
                      name="phone"
                      className={`form-control ${errors.phone ? "is-invalid" : ""
                        }`}
                      placeholder="10-digit number"
                      maxLength={10}
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      disabled={orderLoading}
                    />
                  </div>
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                {/* Address Line 1 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    className={`form-control ${errors.addressLine1 ? "is-invalid" : ""
                      }`}
                    placeholder="Street address, building, etc."
                    value={shippingAddress.addressLine1}
                    onChange={handleAddressChange}
                    disabled={orderLoading}
                  />
                  {errors.addressLine1 && (
                    <div className="invalid-feedback">
                      {errors.addressLine1}
                    </div>
                  )}
                </div>

                {/* Address Line 2 (Optional) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    className="form-control"
                    placeholder="Apartment, suite, etc."
                    value={shippingAddress.addressLine2}
                    onChange={handleAddressChange}
                    disabled={orderLoading}
                  />
                </div>

                {/* City & State Row */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">City *</label>
                    <input
                      type="text"
                      name="city"
                      className={`form-control ${errors.city ? "is-invalid" : ""
                        }`}
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      disabled={orderLoading}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">State *</label>
                    <input
                      type="text"
                      name="state"
                      className={`form-control ${errors.state ? "is-invalid" : ""
                        }`}
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      disabled={orderLoading}
                    />
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )}
                  </div>
                </div>

                {/* Postal Code */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    className={`form-control ${errors.postalCode ? "is-invalid" : ""
                      }`}
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    disabled={orderLoading}
                  />
                  {errors.postalCode && (
                    <div className="invalid-feedback">{errors.postalCode}</div>
                  )}
                </div>

                {/* Country (Read-only) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shippingAddress.country}
                    disabled
                  // India only for now
                  />
                </div>
              </form>
            </div>
          </div>

          {/* ✅ PAYMENT METHOD */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Payment Method</h5>

              <div className="d-flex flex-column gap-3">
                {/* COD - Cash on Delivery */}
                <div className="form-check p-3 border rounded-3 cursor-pointer">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={orderLoading}
                  />
                  <label className="form-check-label w-100" htmlFor="cod">
                    <strong>Cash on Delivery (COD)</strong>
                    <p className="text-muted small mb-0">
                      Pay when you receive your order
                    </p>
                  </label>
                </div>

                {/* Credit/Debit Card */}
                <div className="form-check p-3 border rounded-3 cursor-pointer opacity-50">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="card"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                  // Coming soon
                  />
                  <label className="form-check-label w-100" htmlFor="card">
                    <strong>Credit/Debit Card</strong>
                    <p className="text-muted small mb-0">Coming soon...</p>
                  </label>
                </div>

                {/* UPI */}
                <div className="form-check p-3 border rounded-3 cursor-pointer opacity-50">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="upi"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                  // Coming soon
                  />
                  <label className="form-check-label w-100" htmlFor="upi">
                    <strong>UPI</strong>
                    <p className="text-muted small mb-0">Coming soon...</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ SPECIAL INSTRUCTIONS */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Delivery Instructions (Optional)</h5>
              <textarea
                className="form-control"
                rows={3}
                placeholder="e.g., Leave with neighbor if not home, ring bell twice, etc."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                disabled={orderLoading}
              />
            </div>
          </div>

          {/* ✅ ERROR MESSAGE */}
          {orderError && (
            <Alert severity="error" className="mb-4">
              {orderError}
            </Alert>
          )}
        </div>

        {/* ✅ RIGHT SECTION - ORDER SUMMARY SIDEBAR */}
        <div className="col-lg-5">
          <div
            className="card shadow-sm border-0 sticky-top"
            style={{ top: "20px" }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              {/* Subtotal */}
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span>Subtotal</span>
                <span className="fw-semibold">
                  <FaRupeeSign />
                  {subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Shipping */}
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span>Shipping</span>
                <span className="text-success fw-semibold">Free</span>
              </div>

              {/* Tax (GST) */}
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span>Tax (18% GST)</span>
                <span className="fw-semibold">
                  <FaRupeeSign />
                  {tax.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Total */}
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total Amount</span>
                <span className="fw-bold fs-5 text-success">
                  <FaRupeeSign />
                  {totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Place Order Button */}
              <button
                className="btn btn-dark w-100 py-3 fw-bold"
                onClick={handlePlaceOrder}
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <>
                    <CircularProgress size={20} className="me-2" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FaRupeeSign className="me-2" />
                    Place Order - ₹{totalAmount.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              {/* Continue Shopping Link */}
              <button
                className="btn btn-link w-100 mt-2"
                onClick={() => navigate("/cart")}
                disabled={orderLoading}
              >
                Back to Cart
              </button>

              {/* Security Info */}
              <div className="mt-4 p-3 bg-light rounded-3 text-center">
                <p className="text-muted small mb-0">
                  <i className="fas fa-lock me-1"></i>
                  Your information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
