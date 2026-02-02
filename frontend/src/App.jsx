import "../src/App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "../src/pages/Home";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import AllProducts from "./pages/AllProducts";
import CartPage from "./pages/CartPage";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/allproduct" element={<AllProducts />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
