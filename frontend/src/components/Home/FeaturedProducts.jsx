import { useEffect, useState } from "react";
// import axios from "axios";
import HurryUp from "./HurryUp";
import api from "../../api/axiosInstance";
// import { useNavigate } from "react-router-dom";


// FA Icons
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";
// import { FaCartShopping } from "react-icons/fa6";
// import { FaRupeeSign } from "react-icons/fa";

import ProductGrid from "../Productgrid";


const FeaturedProducts = ({section3Ref}) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products");
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
      <div  ref={section3Ref} className="section-1 container py-5 my-5">
        <h3 className="pb-3 fw-bold text-center">Our Featured Products</h3>
        <hr className="section-divider mx-auto" />
        <ProductGrid products={products} limit={8} />
      </div>

      <HurryUp product={products} />
    </>
  );
};

export default FeaturedProducts;
