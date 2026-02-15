import "../src/App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "../src/pages/Home";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import AllProducts from "./pages/AllProducts";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CheckoutPage from "./pages/CheckoutPage";
// ✅ NEW: Import checkout page
import OrdersPage from "./pages/OrderPage";
// ✅ NEW: Import orders page
import PagenotFound from "./pages/pageNotFound/PagenotFound";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession } from "./redux/authSlice";
import { fetchCart } from "./redux/cartSlice";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSessionRestored = useSelector(
    (state) => state.auth.isSessionRestored,
  );

  // ✅ Restore session on app load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // ✅ Fetch cart when user logs in or session is restored
  useEffect(() => {
    if (isLoggedIn && isSessionRestored) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, isSessionRestored, dispatch]);

  if (!isSessionRestored) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* ✅ NEW: Checkout route */}
          <Route path="/orders" element={<OrdersPage />} />
          {/* ✅ NEW: Orders route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<PagenotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
