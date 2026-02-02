import { FaRupeeSign, FaTrash } from "react-icons/fa";
import ProductSidebar from "../components/ProductSidebar";

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      title: "Yanai Lakshmi Tanjore Painting",
      price: 1099,
      qty: 1,
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    },
    {
      id: 2,
      title: "Mens Casual T-Shirt",
      price: 499,
      qty: 2,
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    },
  ];

  return (
    <div className="container row mt-5 py-5 m-auto">
      <div className="col-lg-9 mt-4 section-1">
        <h2 className="mb-4">Shopping Cart</h2>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center border rounded p-3 mb-3"
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "90px", height: "90px", objectFit: "contain" }}
            />

            <div className="ms-3 flex-grow-1">
              <h6 className="mb-1">{item.title}</h6>
              <p className="mb-2 fw-bold">
                <FaRupeeSign /> {item.price}
              </p>

              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-dark btn-sm">−</button>
                <span>{item.qty}</span>
                <button className="btn btn-outline-dark btn-sm">+</button>
              </div>
            </div>

            <button className="btn btn-outline-danger">
              <FaTrash />
            </button>
          </div>
        ))}

        <div className="text-end mt-4">
          <h5>
            Total: <FaRupeeSign /> 2097
          </h5>
          <button className="btn btn-dark mt-2">Proceed to Checkout</button>
        </div>
      </div>
      <ProductSidebar />
    </div>
  );
};

export default CartPage;
