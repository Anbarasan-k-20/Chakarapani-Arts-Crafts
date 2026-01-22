import { useEffect, useState } from "react";
import axios from "axios";
import HurryUp from "./HurryUp";
// import Card from "react-bootstrap/Card";
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  // console.log(error);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const resProduct = await axios.get("https://fakestoreapi.com/products");
        // console.log(resProduct.data);
        setProducts(resProduct.data);
      } catch (err) {
        console.log(err);
        setError("Error Fetching Featured products " + err);
      }
    };
    getProducts();
  }, []);
  return (
    <>
      <div className="section-1 container py-5">
        {error && <p className="text-danger">{error.message}</p>}
        <h3 className="pb-3 fw-bold text-center">Our Featured Products</h3>
        <hr className="section-divider mx-auto" />
        <div className="row g-4 my-3">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className=" col-12 col-sm-6 col-md-3">
              <div className="section-1 card h-100 product-card">
                <div className="product-card position-relative">
                  <span
                    className="badge text-dark bg-light px-2 py-2 position-absolute custom-badge "
                    style={{ top: "15px", left: "15px", zIndex: 1 }}
                  >
                    sale !
                  </span>
                </div>
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.title}
                />
                <div className="card-body">
                  <h6 className="card-title text-truncate">{product.title}</h6>
                  <div className="d-flex gap-3">
                    <p className="fw-bold text-secondary text-decoration-line-through mb-1">
                      ₹{product.price}
                    </p>
                    <p className="fw-bold mb-1">- ₹{product.price}</p>
                  </div>
                  <button className="btn btn-outline-dark btn-sm">
                    View Product
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
