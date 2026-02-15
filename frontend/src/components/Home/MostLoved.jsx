import { useNavigate } from "react-router-dom";
import HappyClients from "./HappyClients";

import { FaCartShopping } from "react-icons/fa6";
import ProductGrid from "../Productgrid";
const MostLoved = ({ product }) => {
  const Navigate = useNavigate();
  return (
    <>
      <div className="container my-5 py-5">
        <h3 className="section-1 fw-bold text-center my-3">Most Loved Products</h3>
        <hr className="section-divider mx-auto" />
        <ProductGrid products={product} start={8} limit={4} />
      </div>
      <HappyClients />
    </>
  );
};

export default MostLoved;
