import React from "react";
import HappyClients from "./HappyClients";

const MostLoved = ({ product }) => {
  return (
    <>
      <div className="m-5 p-5">
        <h3 className="section-1 fw-bold text-center">Most Loved Products</h3>
        <hr className="section-divider mx-auto" />
        <div className="row g-4">
          {product.slice(0, 4).map((product) => (
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
      <HappyClients />
    </>
  );
};

export default MostLoved;
