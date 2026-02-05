import api from "../api/axiosInstance.js";
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

const ProductSidebar = () => {
  // 🔹 Holds all products (single source of truth)
  const [products, setProducts] = useState([]);

  // 🔹 Holds dropdown selected value (acts as search text)
  const [selectedValue, setSelectedValue] = useState("");

  // 🔹 Fetch products ONCE
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

  // 🔹 Normalize search value
  const q = selectedValue.toLowerCase().trim();

  // 🔹 Filter logic (title || category || description)
  const filteredProducts = products.filter((product) => {
    if (!q) return true;

    return (
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q)
    );
  });

  // 🔹 UI decision flag
  const isSearching = q.length > 0;

  return (
    <aside className="col-md-3">
      {/* ================= CATEGORY SEARCH ================= */}
      <div className="mb-5">
        <h5 className="fw-bold mb-3">Search Products</h5>

        <select
          className="form-select"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">Search by title</option>

          {/* Dropdown options based on product titles */}
          {products.map((product) => (
            <option key={product.id} value={product.title}>
              {product.title}
            </option>
          ))}
        </select>
      </div>

      {/* ================= SEARCH RESULT MODE ================= */}
      {isSearching && (
        <div className="section-1 ms-4">
          <h4 className="fw-bold mb-4">Search Results</h4>

          {filteredProducts.length === 0 && (
            <p className="text-muted">No products found</p>
          )}

          {filteredProducts.map((item) => (
            <div key={item.id} className="d-flex gap-3 mb-3">
              <img
                src={item.image}
                alt={item.title}
                className="img-fluid"
                style={{ width: "100px", objectFit: "cover" }}
              />

              <div>
                <p className="mb-1 text-dark">{item.title}</p>
                <p className="mb-0 small">
                  <FaRupeeSign /> {item.price}
                </p>
                <button className="btn btn-outline-dark btn-sm mt-2">
                  <FaCartShopping />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= DEFAULT MODE ================= */}
      {!isSearching && (
        <>
          {/* Recently Viewed */}
          <div className="section-1 ms-4">
            <h4 className="fw-bold mb-4 p-3">Recently Viewed Products</h4>
            {products.slice(5, 10).map((item) => (
              <div key={item.id} className="d-flex gap-3 mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid"
                  style={{ width: "100px", objectFit: "cover" }}
                />

                <div>
                  <p className="mb-1 text-dark">{item.title}</p>
                  <p className="mb-0 small">
                    <FaRupeeSign /> {item.price}
                  </p>
                  <button className="btn btn-outline-dark btn-sm mt-2">
                    <FaCartShopping />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Top Rated */}
          <div className="section-1 ms-4">
            <h3 className="fw-bold mb-4 py-4">Top Rated Products</h3>
            {products.slice(0, 5).map((item) => (
              <div key={item.id} className="d-flex gap-3 mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid"
                  style={{ width: "100px", objectFit: "cover" }}
                />

                <div>
                  <p className="mb-1 text-dark">{item.title}</p>
                  <p className="mb-0 small">
                    <FaRupeeSign /> {item.price}
                  </p>
                  <button className="btn btn-outline-dark btn-sm mt-2">
                    <FaCartShopping />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default ProductSidebar;
