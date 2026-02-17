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
// ✅ NEW: Import Admin Pages
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import AddEditProduct from "./pages/admin/AddEditProduct";
import ManageOrders from "./pages/admin/ManageOrders";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { restoreSession } from "./redux/authSlice";
import { fetchCart } from "./redux/cartSlice";
import PagenotFound from "./pages/pageNotFound/PagenotFound";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // ✅ Restore session on app load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // ✅ Fetch cart when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  const isSessionRestored = useSelector((state) => state.auth.isSessionRestored);

  if (!isSessionRestored) {
    return null; // Or a loading spinner
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
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/add" element={<AddEditProduct />} />
            <Route path="products/edit/:id" element={<AddEditProduct />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>

          <Route path="*" element={<PagenotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
