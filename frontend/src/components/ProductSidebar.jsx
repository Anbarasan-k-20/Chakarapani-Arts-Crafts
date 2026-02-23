import api from "../api/axiosInstance.js";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";

const ProductSidebar = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);

        // Extract unique categories from comma-separated values
        const allCategories = new Set();
        res.data.forEach((product) => {
          if (product.category) {
            // Split by comma and trim whitespace
            const cats = product.category
              .split(",")
              .map((cat) => cat.trim())
              .filter((cat) => cat.length > 0);
            cats.forEach((cat) => allCategories.add(cat));
          }
        });

        setCategories(Array.from(allCategories).sort());

        // Get selected category from URL
        const searchQuery = searchParams.get("search") || "";
        setSelectedCategory(searchQuery);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [searchParams]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category) {
      navigate(`/allproducts?search=${encodeURIComponent(category)}`);
    } else {
      navigate("/allproducts");
    }
  };

  return (
    <aside className="col-md-3">
      {/* ================= CATEGORY FILTER DROPDOWN ================= */}
      <div className="mb-4">
        <h5 className="fw-bold mb-3">Filter by Category</h5>

        <select
          className="form-select form-select-lg"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.length === 0 ? (
            <option disabled>No categories available</option>
          ) : (
            categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))
          )}
        </select>
      </div>

      {/* ================= RECENTLY VIEWED ================= */}
      <div className="ms-2">
        <h5 className="fw-bold mb-3">Recently Viewed</h5>

        {products.slice(5, 10).map((item) => (
          <div
            key={item.id}
            className="d-flex gap-3 mb-3 sidebar-item"
            onClick={() => navigate(`/product/${item.id}`)}
            style={{ cursor: "pointer" }}
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
            style={{ cursor: "pointer" }}
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
