import "../src/App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import AllProducts from "./pages/AllProducts";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrderPage";

// ✅ Import protected routes
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import UserRoute from "./components/ProtectedRoute/UserRoute";
// ✅ NEW: Import user-only route

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

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  const isSessionRestored = useSelector((state) => state.auth.isSessionRestored);

  if (!isSessionRestored) {
    return null;
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ✅ Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ User-only routes (blocks admin) */}
          <Route
            path="/cart"
            element={
              <UserRoute>
                <CartPage />
              </UserRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <UserRoute>
                <CheckoutPage />
              </UserRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <UserRoute>
                <OrdersPage />
              </UserRoute>
            }
          />

          {/* ✅ Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/add" element={<AddEditProduct />} />
            <Route path="products/edit/:id" element={<AddEditProduct />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>

          {/* ✅ 404 */}
          <Route path="*" element={<PagenotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
