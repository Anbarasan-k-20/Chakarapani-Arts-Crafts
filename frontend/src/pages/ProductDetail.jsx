import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//for icons
import { LuAmpersand } from "react-icons/lu";
import { FaRupeeSign } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
const ProductDetail = () => {
  const { id } = useParams(); // dynamic product id from URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  console.log(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product details" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-md-7">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-5">
          <div className="section-1">
            <h2>{product.title}</h2>
            <p className="text-muted">{product.category}</p>
            <div className="d-flex gap-2 align-items-center">
              <h3 className="fw-bold my-3">
                <span>
                  <FaRupeeSign />
                </span>
                {product.price}
              </h3>{" "}
              <span><FaMinus/></span>
              <h3 className="fw-bold my-3">
                <span>
                  <FaRupeeSign />
                </span>
                {product.price}
              </h3>
              <span>
                <LuAmpersand />
                <span> Free Shipping</span>
              </span>
            </div>
            <p>{product.description}</p>
            <h4>{product.description}</h4>
            <button className="btn btn-dark-outline me-3">Add to Cart</button>
            <button className="btn-in px-4 py-2">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
