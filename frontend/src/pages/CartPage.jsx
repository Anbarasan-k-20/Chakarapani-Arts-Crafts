import { useEffect } from "react";
import { FaRupeeSign, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  increaseQtyBackend,
  decreaseQtyBackend,
  removeFromCartBackend,
} from "../redux/cartSlice";
import ProductSidebar from "../components/ProductSidebar";

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    items: cartItems,
    totalAmount,
    loading,
    error,
  } = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // ✅ Fetch cart from backend on component mount
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  // ✅ Handle increase quantity
  const handleIncrease = (itemId) => {
    dispatch(increaseQtyBackend(itemId));
  };

  // ✅ Handle decrease quantity
  const handleDecrease = (itemId) => {
    dispatch(decreaseQtyBackend(itemId));
  };

  // ✅ Handle remove item
  const handleRemove = (itemId) => {
    dispatch(removeFromCartBackend(itemId));
  };

  if (loading) {
    return (
      <div className="container mt-5 py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container row mt-5 py-5 m-auto">
      <div className="col-lg-9 mt-4 section-1">
        <h2 className="mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Your cart is empty</p>
            <a href="/products" className="btn btn-dark mt-3">
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="d-flex align-items-center border rounded p-3 mb-3"
              >
                <img
                  src={item.productDetails?.image || item.image}
                  alt={item.productDetails?.title || item.title}
                  style={{ width: 90, height: 90, objectFit: "contain" }}
                />

                <div className="ms-3 flex-grow-1">
                  <h6>{item.productDetails?.title || "Product"}</h6>

                  {/* ✅ Show selected size */}
                  {item.selectedSize && (
                    <p className="text-muted small mb-1">
                      Size: <strong>{item.selectedSize.dimension}</strong>
                    </p>
                  )}

                  {/* ✅ Show price */}
                  <div className="d-flex gap-2 align-items-center">
                    {item.selectedSize?.originalPrice && (
                      <p className="text-muted text-decoration-line-through mb-0 small">
                        <FaRupeeSign />{" "}
                        {item.selectedSize.originalPrice.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    )}
                    <p className="fw-bold mb-0">
                      <FaRupeeSign /> {item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* ✅ Quantity controls */}
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => handleDecrease(item._id)}
                      disabled={item.qty <= 1}
                    >
                      −
                    </button>

                    <span className="mx-2">{item.qty}</span>

                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => handleIncrease(item._id)}
                    >
                      +
                    </button>
                  </div>

                  {/* ✅ Subtotal */}
                  <p className="mt-2 mb-0 small text-muted">
                    Subtotal:{" "}
                    <strong>
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </strong>
                  </p>
                </div>

                {/* ✅ Remove button */}
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRemove(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {/* ✅ Cart total */}
            <div className="text-end mt-4">
              <h5>
                Total: <FaRupeeSign /> {totalAmount.toLocaleString("en-IN")}
              </h5>
              <button className="btn btn-dark mt-2">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
      <ProductSidebar />
    </div>
  );
};

export default CartPage;
