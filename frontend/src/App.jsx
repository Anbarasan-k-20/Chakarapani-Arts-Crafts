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
import PagenotFound from "./pages/pageNotFound/PagenotFound";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect } from "react"; // ← ADD
import { useDispatch } from "react-redux"; // ← ADD
import { restoreSession } from "./redux/authSlice"; // ← ADD
import { fetchCart } from "./redux/cartSlice";
const App = () => {
  const dispatch = useDispatch(); // ← ADD

  // ← ADD: Check if user was logged in before (on page refresh)
  useEffect(() => {
    dispatch(restoreSession()); // Sets Redux state

    const token = localStorage.getItem("token"); // ✅ Read directly!
    if (token) dispatch(fetchCart()); // Don't wait for Redux state
  }, [dispatch]); // Runs ONCE on mount — cart ready immediately
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/allproduct" element={<AllProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<PagenotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
