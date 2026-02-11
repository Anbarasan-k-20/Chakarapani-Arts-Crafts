import { useEffect, useState } from "react";
import ProductSidebar from "../components/ProductSidebar";
import api from "../api/axiosInstance.js";
import { FaCartShopping } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../redux/cartSlice";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Auth & Cart state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartLoading = useSelector((state) => state.cart.loading);

  // Search params
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Products state
  const [products, setProducts] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Modal state for size selection
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Show snackbar notification
  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();

    return (
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q)
    );
  });

  // Pagination calculations
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Handle Add to Cart button click
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent card click navigation

    if (!isLoggedIn) {
      showNotification("Please login to add items to cart", "error");
      setTimeout(() => navigate("/login"), 1500);
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

  // Confirm add to cart after size selection
  const confirmAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;

    try {
      await dispatch(
        addToCartBackend({
          productId: selectedProduct.id,
          selectedSize: {
            dimension: selectedSize.dimension,
            originalPrice: selectedSize.originalPrice,
            salePrice: selectedSize.salePrice,
          },
          qty: 1,
        }),
      ).unwrap();

      setShowModal(false);
      showNotification(`"${selectedProduct.title}" added to cart!`, "success");

      setTimeout(() => {
        navigate("/cart");
      }, 1800);
    } catch (error) {
      showNotification(error || "Failed to add to cart", "error");
    }
  };

  return (
    <>
      <div className="container row mt-5 py-5 m-auto">
        {/* MAIN CONTENT */}
        <div className="col-lg-9 mt-4 section-1">
          <h1 className="pb-3">All Products</h1>
          <hr />

          {/* NO PRODUCTS FOUND MESSAGE */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <FaCartShopping size={64} className="text-muted" />
              </div>
              <h3 className="text-muted mb-3">No Products Found</h3>
              <p className="text-secondary">
                We couldn't find any products matching your search.
              </p>
              {searchQuery && (
                <p className="text-muted">
                  Try searching with different keywords or{" "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => navigate("/products")}
                  >
                    browse all products
                  </button>
                </p>
              )}
            </div>
          ) : (
            <>
              {/* PRODUCTS GRID */}
              <div className="row g-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="col-12 col-md-4">
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
                        <h6 className="card-title text-truncate">
                          {product.title}
                        </h6>

                        {/* Pricing based on sizes */}
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
                            <FaRupeeSign />{" "}
                            {product.price?.toLocaleString("en-IN")}
                          </p>
                        )}

                        {/* Sizes available count */}
                        {product.sizes?.length > 1 && (
                          <small className="text-muted">
                            {product.sizes.length} sizes
                          </small>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          className="btn btn-outline-secondary mt-2 d-flex align-items-center gap-1"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={cartLoading}
                        >
                          <FaCartShopping />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                <button
                  className="btn btn-outline-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Prev
                </button>

                <span className="fw-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="btn btn-outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* LEFT SIDEBAR */}
        <ProductSidebar products={products} />
      </div>

      {/* SIZE SELECTION MODAL */}
      {showModal && selectedProduct && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          />

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

                {/* Modal Body */}
                <div className="modal-body py-3">
                  <p className="fw-semibold mb-3">Select Frame Size:</p>
                  <div className="d-flex flex-column gap-2">
                    {selectedProduct.sizes.map((size, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`btn d-flex justify-content-between align-items-center px-4 py-3 rounded-3 ${
                          selectedSize?.dimension === size.dimension
                            ? "btn-dark"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <span className="fw-semibold">{size.dimension}</span>
                        <div className="text-end">
                          <span
                            className={`text-decoration-line-through me-2 small ${
                              selectedSize?.dimension === size.dimension
                                ? "text-white-50"
                                : "text-muted"
                            }`}
                          >
                            ₹{size.originalPrice.toLocaleString("en-IN")}
                          </span>
                          <span
                            className={`fw-bold ${
                              selectedSize?.dimension === size.dimension
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

      {/* SNACKBAR NOTIFICATION */}
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

export default AllProducts;
