import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HurryUp from "./HurryUp";

// Icons
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";

import { FaCartShopping } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
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
                  className="badge bg-light text-dark position-absolute px-2 py-2 sale-but"
                  // style={{ top: "15px", left: "15px", zIndex: 1 }}
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

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-dark btn-sm mt-2 py-2 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Added "${product.title}" to cart`);
                      }}
                    >
                      <span>
                        <FaCartShopping />
                      </span>
                    </button>
                    {/* <button
                      className="btn btn-outline-danger btn-sm mt-2 py-2 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Added "${product.title}" to cart`);
                      }}
                    >
                      <span>
                        <FontAwesomeIcon icon={faHeart} />
                      </span>
                    </button> */}
                  </div>
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
