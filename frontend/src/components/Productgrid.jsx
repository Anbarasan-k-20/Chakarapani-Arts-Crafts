import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../redux/cartSlice";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

const ProductGrid = ({ products = [], limit = 8 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user); // ✅ Fix: Hook at top level
  const cartLoading = useSelector((state) => state.cart.loading);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ===========================================================
  // MODAL STATE (for size selection)
  // ===========================================================
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // ✅ Helper to show snackbar
  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ✅ Close snackbar
  // "reason === 'clickaway'" means user clicked somewhere else.
  // We ignore that - only close on timeout or explicit close button.
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToCart = (e, product) => {
    console.log(e, product);

    e.stopPropagation(); // ✅ Prevent card click from firing navigate()

    if (!isLoggedIn) {
      showNotification("Please login to add items to cart", "error");
      setTimeout(() => navigate("/login"), 1500); // Wait for user to see message
      return;
    }

    if (product.sizes && product.sizes.length > 0) {
      // Open size selection modal
      setSelectedProduct(product);
      setSelectedSize(product.sizes[0]); // Pre-select first size
      setShowModal(true);
    } else {
      showNotification("This product has no available sizes", "error");
    }
  };

  // ===========================================================
  // CONFIRM ADD TO CART
  //
  // This runs when user clicks "Add to Cart" inside the modal.
  // We dispatch the async thunk which calls POST /api/cart/add
  // .unwrap() converts the thunk result into a promise so we
  // can use async/await + try/catch on it.
  // ===========================================================
  const confirmAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;

    try {
      await dispatch(
        addToCartBackend({
          productId: selectedProduct.id, // Normalized id from backend
          selectedSize: {
            dimension: selectedSize.dimension,
            originalPrice: selectedSize.originalPrice,
            salePrice: selectedSize.salePrice,
          },
          qty: 1,
        }),
      ).unwrap(); // ✅ .unwrap() throws error if rejected - lets us catch it

      setShowModal(false);

      // ✅ Show success notification with product name
      showNotification(`"${selectedProduct.title}" added to cart!`, "success");

      // ✅ Navigate to cart after short delay so user sees notification
      setTimeout(() => {
        navigate("/cart");
      }, 1800);
    } catch (error) {
      // ✅ Show error notification
      showNotification(error || "Failed to add to cart", "error");
    }
  };

  return (
    <>
      {/* ===== PRODUCT GRID ===== */}
      <div className="row g-4 my-3">
        {products.slice(0, limit).map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-3">
            <div
              className="card h-100 product-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Sale Badge */}
              <span className="badge bg-light text-dark position-absolute px-2 py-2 sale-but">
                Sale
              </span>

              {/* Product Image */}
              <img
                src={product.image}
                className="card-img-top"
                alt={product.title}
                onError={(e) => (e.target.src = "/fallback.png")}
              />

              {/* Card Body */}
              <div className="card-body">
                <h6 className="card-title text-truncate">{product.title}</h6>

                {/* ✅ CHANGED: Show sizes-based pricing */}
                {product.sizes && product.sizes.length > 0 ? (
                  <div className="d-flex gap-2 align-items-center">
                    <p className="fw-bold text-muted text-decoration-line-through mb-1 small">
                      <FaRupeeSign />
                      {product.sizes[
                        product.sizes.length - 1
                      ].originalPrice.toLocaleString("en-IN")}
                    </p>
                    <p className="fw-bold text-success mb-1">
                      <FaRupeeSign />
                      {product.sizes[
                        product.sizes.length - 1
                      ].salePrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                ) : (
                  <p className="fw-bold mb-1">
                    <FaRupeeSign /> {product.price?.toLocaleString("en-IN")}
                  </p>
                )}

                {/* Sizes available count */}
                {/* {product.sizes?.length > 1 && (
                  <small className="text-muted">
                    {product.sizes.length} sizes
                  </small>
                )} */}

                {/* ✅ Show sizes as text */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-2 d-flex">
                    <p className="section-1 fw-bold me-2">Available Sizes:</p>
                    {product.sizes.map((size, ind) => (
                      <span key={ind} className="me-2 mt-1 text-muted small">
                        {size.dimension}
                      </span>
                    ))}
                  </div>
                )}

                {/* ✅ Add to Cart Button */}
                {!isLoggedIn || user?.role !== "admin" ? (
                  <button
                    className="btn btn-outline-secondary mt-2 d-flex align-items-center gap-1"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={cartLoading} // Disable while loading
                  >
                    <FaCartShopping />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================================================
        SIZE SELECTION MODAL
        - Bootstrap modal uses show class + display:block to appear
        - backdrop overlay = the dark bg behind modal
        - We use React state (showModal) to control it - not Bootstrap JS
        - This is the "React way" of modals - no jQuery needed
      =================================================== */}
      {showModal && selectedProduct && (
        <>
          {/* Dark backdrop overlay */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)} // Click backdrop to close
          />

          {/* Modal itself */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 shadow-lg border-0">
                {/* Modal Header */}
                <div className="modal-header border-0 pb-0">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div>
                      <h6 className="modal-title mb-0 fw-bold">
                        {selectedProduct.title}
                      </h6>
                      <small className="text-muted">
                        {selectedProduct.category}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                {/* Modal Body - Size Buttons */}
                <div className="modal-body py-3">
                  <p className="fw-semibold mb-3">Select Frame Size:</p>
                  <div className="d-flex flex-column gap-2">
                    {selectedProduct.sizes.map((size, index) => (
                      <button
                        key={index}
                        type="button"
                        // ✅ TEACHING: Dynamic className - selected = dark, others = outline
                        className={`btn d-flex justify-content-between align-items-center px-4 py-3 rounded-3 ${selectedSize?.dimension === size.dimension
                          ? "btn-dark" // Selected: filled black
                          : "btn-outline-secondary" // Not selected: outline
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <span className="fw-semibold">{size.dimension}</span>
                        <div className="text-end">
                          <span
                            className={`text-decoration-line-through me-2 small ${selectedSize?.dimension === size.dimension
                              ? "text-white-50"
                              : "text-muted"
                              }`}
                          >
                            ₹{size.originalPrice.toLocaleString("en-IN")}
                          </span>
                          <span
                            className={`fw-bold ${selectedSize?.dimension === size.dimension
                              ? "text-white"
                              : "text-success"
                              }`}
                          >
                            ₹{size.salePrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Savings display */}
                  {selectedSize && (
                    <div className="mt-3 p-2 bg-success bg-opacity-10 rounded-3 text-center">
                      <small className="text-success fw-semibold">
                        🎉 You save ₹
                        {(
                          selectedSize.originalPrice - selectedSize.salePrice
                        ).toLocaleString("en-IN")}
                        !
                      </small>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark px-4 d-flex align-items-center gap-2"
                    onClick={confirmAddToCart}
                    disabled={!selectedSize || cartLoading}
                  >
                    {cartLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaCartShopping />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===================================================
        MUI SNACKBAR NOTIFICATION
        TEACHING:
        - anchorOrigin: where the popup appears (bottom-center)
        - autoHideDuration: milliseconds before auto-close (3000 = 3s)
        - onClose: what happens when it closes (our handleSnackbarClose)
        - Alert inside Snackbar = styled notification box
        - severity: success=green, error=red, warning=orange, info=blue
        - action prop: adds a button INSIDE the notification
        
        WHY onClose on both Snackbar AND Alert?
        - Snackbar onClose → handles timeout + backdrop click
        - Alert onClose → handles the X close button
      =================================================== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px" }}
          // ✅ "Go to Cart" action button inside the notification
          action={
            snackbar.severity === "success" ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setSnackbar((prev) => ({ ...prev, open: false }));
                  navigate("/cart");
                }}
                sx={{ fontWeight: "bold", textDecoration: "underline" }}
              >
                VIEW CART
              </Button>
            ) : null
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductGrid;
