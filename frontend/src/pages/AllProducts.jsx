import { useEffect, useState } from "react";
import ProductSidebar from "../components/ProductSidebar";
import axios from "axios";

import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const AllProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getProducts();
  }, []);
  return (
    <>
      <div className="container row mt-5 py-5 m-auto">
        <div className="col-lg-9 mt-4 section-1">
          <h1 className="pb-3">All Products</h1>
          <hr />

          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-12 col-md-6">
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
                      Add to Cart
                    </button>
                  </div>
                </div>
                {/* <div className="card h-100 product-card position-relative">
                  <span
                    className="badge text-dark bg-light px-2 py-2 position-absolute sale-but"
                    // style={{ top: "15px", left: "15px", zIndex: 1 }}
                  >
                    Sale!
                  </span>

                  <img
                    src={product.image}
                    className="card-img-top p-3"
                    alt={product.title}
                    style={{ height: "250px", objectFit: "contain" }}
                  />

                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate">
                      {product.title}
                    </h6>

                    <div className="d-flex gap-3 mb-3">
                      <p className="fw-bold text-secondary text-decoration-line-through mb-0">
                        ₹{product.price}
                      </p>
                      <p className="fw-bold mb-0">₹{product.price}</p>
                    </div>

                    <button className="btn btn-outline-dark btn-sm mt-">
                      View Product
                    </button>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* LEFT SIDEBAR */}
        <ProductSidebar products={products} />
      </div>
    </>
  );
};

export default AllProducts;
