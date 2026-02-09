import { FaCartShopping } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// cart redux

import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../redux/cartSlice";

const ProductGrid = ({ products = [], limit = 8 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const navigate = useNavigate();

  return (
    <div className="row g-4 my-3">
      {products.slice(0, limit).map((product) => (
        <div key={product.id} className="col-12 col-sm-6 col-md-3">
          <div
            className="card h-100 product-card"
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
              onError={(e) => (e.target.src = "/fallback.png")}
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

                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }

                  dispatch(addToCartBackend(product));
                }}
              >
                <FaCartShopping />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
