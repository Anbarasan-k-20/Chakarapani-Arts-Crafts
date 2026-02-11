import api from "../api/axiosInstance.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
// import "./ProductSidebar.css";

const ProductSidebar = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

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

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleProductClick = (id) => {
    setSearchText("");
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  return (
    <aside className="col-md-3">
      {/* ================= SEARCH ================= */}
      <div className="mb-4 position-relative">
        <h5 className="fw-bold mb-3">Search Products</h5>

        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && searchText && (
          <div className="search-dropdown bg-white shadow rounded mt-1 position-absolute w-100">
            {filteredProducts.length === 0 && (
              <div className="p-3 text-muted">No products found</div>
            )}

            {filteredProducts.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="d-flex gap-2 p-2 align-items-center border-bottom sidebar-item"
                onClick={() => handleProductClick(item.id)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="sidebar-img-sm"
                />
                <div>
                  <div className="small fw-semibold">{item.title}</div>
                  <div className="small text-muted">
                    <FaRupeeSign /> {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RECENTLY VIEWED ================= */}
      <div className="ms-2">
        <h5 className="fw-bold mb-3">Recently Viewed</h5>

        {products.slice(5, 10).map((item) => (
          <div
            key={item.id}
            className="d-flex gap-3 mb-3 sidebar-item"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img src={item.image} alt={item.title} className="sidebar-img-md" />
            <div>
              <p className="mb-1 small">{item.title}</p>
              <p className="mb-0 small text-muted">
                <FaRupeeSign /> {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= TOP RATED ================= */}
      <div className="ms-2 mt-4">
        <h5 className="fw-bold mb-3">Top Rated</h5>

        {products.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="d-flex gap-3 mb-3 sidebar-item"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img src={item.image} alt={item.title} className="sidebar-img-md" />
            <div>
              <p className="mb-1 small">{item.title}</p>
              <p className="mb-0 small text-muted">
                <FaRupeeSign /> {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ProductSidebar;
