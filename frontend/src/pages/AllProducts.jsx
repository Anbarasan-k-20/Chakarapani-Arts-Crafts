import { useEffect, useState } from "react";
import ProductSidebar from "../components/ProductSidebar";
import api from "../api/axiosInstance.js";
import { FaCartShopping } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();

  //for search params
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // 🔹 All products from API
  const [products, setProducts] = useState([]);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Business rule: products per page
  const PRODUCTS_PER_PAGE = 6;

  // 🔹 Fetch products (single source of truth)
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

  // for filter products
  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();

    return (
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q)
    );
  });

  // 🔹 Pagination calculations (industry standard)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  // 🔹 Slice only what UI needs
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  return (
    <>
      <div className="container row mt-5 py-5 m-auto">
        {/* MAIN CONTENT */}
        <div className="col-lg-9 mt-4 section-1">
          <h1 className="pb-3">All Products</h1>
          <hr />

          {/* PRODUCTS GRID */}
          <div className="row g-4">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-4">
                <div
                  className="card product-card p-3"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* Badge */}
                  <span className="badge bg-light text-dark position-absolute px-2 py-2 sale-but">
                    Sale
                  </span>

                  {/* Image */}
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                  />

                  {/* Body */}
                  <div className="card-body">
                    <h6 className="card-title text-truncate">
                      {product.title}
                    </h6>

                    <div className="d-flex gap-3 align-items-center">
                      <p className="fw-bold text-muted text-decoration-line-through mb-1">
                        <FaRupeeSign /> {product.price}
                      </p>
                      <p className="fw-bold mb-1">
                        <FaRupeeSign /> {product.price}
                      </p>
                    </div>

                    <button
                      className="btn btn-outline-dark btn-sm mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Added "${product.title}" to cart`);
                      }}
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
        </div>

        {/* LEFT SIDEBAR */}
        <ProductSidebar products={products} />
      </div>
    </>
  );
};

export default AllProducts;
