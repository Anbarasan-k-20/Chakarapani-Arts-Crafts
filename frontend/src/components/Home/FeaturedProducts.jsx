import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HurryUp from "./HurryUp";

// Icons
import { FaRupeeSign } from "react-icons/fa";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // prevents state update on unmount

    const getProducts = async () => {
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        if (isMounted) setProducts(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load featured products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-center py-5">Loading products...</p>;
  }

  if (error) {
    return <p className="text-danger text-center py-5">{error}</p>;
  }

  return (
    <>
      <div className="section-1 container py-5">
        <h3 className="pb-3 fw-bold text-center">Our Featured Products</h3>
        <hr className="section-divider mx-auto" />
        <div className="row g-4 my-3">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-3">
              <div
                className="card h-100 product-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Badge */}
                <span
                  className="badge bg-light text-dark position-absolute px-2 py-2"
                  style={{ top: "15px", left: "15px", zIndex: 1 }}
                >
                  Sale
                </span>
                {/* Image */}
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = "/fallback.png";
                  }}
                />

                {/* Body */}
                <div className="card-body">
                  <h6 className="card-title text-truncate">{product.title}</h6>

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
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <HurryUp product={products} />
    </>
  );
};

export default FeaturedProducts;
