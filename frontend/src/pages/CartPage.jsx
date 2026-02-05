import { FaRupeeSign, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart } from "../redux/cartSlice";
import ProductSidebar from "../components/ProductSidebar";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="container row mt-5 py-5 m-auto">
      <div className="col-lg-9 mt-4 section-1">
        <h2 className="mb-4">Shopping Cart</h2>

        {cartItems.length === 0 && <p>Your cart is empty</p>}

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center border rounded p-3 mb-3"
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 90, height: 90, objectFit: "contain" }}
            />

            <div className="ms-3 flex-grow-1">
              <h6>{item.title}</h6>
              <p className="fw-bold">
                <FaRupeeSign /> {item.price}
              </p>

              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => dispatch(decreaseQty(item.id))}
                >
                  −
                </button>

                <span>{item.qty}</span>

                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => dispatch(increaseQty(item.id))}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              <FaTrash />
            </button>
          </div>
        ))}

        <div className="text-end mt-4">
          <h5>
            Total: <FaRupeeSign /> {total}
          </h5>
          <button className="btn btn-dark mt-2">Proceed to Checkout</button>
        </div>
      </div>
      <ProductSidebar/>
    </div>
  );
};

export default CartPage;
