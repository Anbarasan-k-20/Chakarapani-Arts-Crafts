// import axios from "axios";
// import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";

const ProductSidebar = ({ products }) => {
  // console.log(products);

  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   const getProducts = async () => {
  //     try {
  //       const res = await axios.get("https://fakestoreapi.com/products");
  //       setProducts(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getProducts();
  // }, []);

  return (
    <aside className="col-md-3">
      {/* Categories */}
      <div className="mb-5">
        <h5 className="fw-bold mb-3">Categories</h5>
        <select className="form-select">
          <option>Search</option>
          {products.map((cat) => (
            <option key={cat.id}>{cat.title}</option>
          ))}
        </select>
      </div>

      {/* Recently Viewed */}
      <div className="section-1 ms-4">
        <h4 className="fw-bold mb-4 p-3">Recently Viewed Products</h4>
        {products.slice(0, 5).map((item, index) => (
          <div key={index} className="d-flex gap-3 mb-3">
            <img
              src={item.image}
              alt={item.title}
              className="img-fluid"
              style={{ width: "100px", objectFit: "cover" }}
            />

            <div>
              <p className="mb-1 text-dark">{item.title}</p>
              <p className="mb-0 small">
                <FaRupeeSign /> {item.price} – <FaRupeeSign /> {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="section-1 ms-4">
        <h3 className="fw-bold mb-4 py-4">Top rated products</h3>
        {products.slice(0, 5).map((item, index) => (
          <div key={index} className="d-flex gap-3 mb-3">
            <img
              src={item.image}
              alt={item.title}
              className="img-fluid"
              style={{ width: "100px", objectFit: "cover" }}
            />

            <div>
              <p className="mb-1 text-dark">{item.title}</p>
              <p className="mb-0 small">
                <FaRupeeSign /> {item.price} – <FaRupeeSign /> {item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ProductSidebar;
