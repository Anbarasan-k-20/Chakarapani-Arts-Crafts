import {
  FaUser,
  FaShoppingCart,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // ← CHANGED: Added useDispatch
import { logout } from "../redux/authSlice";

import { clearCartLocal } from "../redux/cartSlice";
const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ← ADD: For dispatching logout

  // ← ADD: Get auth state from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  // ✅ Show 0 if not logged in, otherwise show actual count
  const cartCount = isLoggedIn
    ? cartItems.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // ← ADD: For user dropdown

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/allproducts?search=${encodeURIComponent(query)}`);
    setQuery("");
  };

  // ← ADD: Logout handler
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartLocal()); // ← ADD: Clear cart items
    setShowUserMenu(false);
    navigate("/");
    alert("Logged out successfully!");
  };

  return (
    <>
      {/* TOP INFO BAR - No changes */}
      <div className="top-info-bar d-flex align-items-center px-5 py-2">
        <div className="d-flex gap-3 section-1">
          <a href="https://facebook.com" target="_blank" className="text-light">
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="text-light"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            className="text-light"
          >
            <FaWhatsapp />
          </a>
        </div>
        <div className="offer-wrapper flex-grow-1 mx-4">
          <div className="offer-track text-light d-flex gap-5">
            <span>🔥 Special 50% Discount Offer 🔥</span>
            <span>Free Shipping All Over India 🚚</span>
            <span>Limited Time Sale – Buy Now 🔥</span>
          </div>
        </div>
        <div className="d-flex gap-4 small text-light">
          <span>
            <FaEnvelope className="me-1" />
            support@chakrapaniarts.com
          </span>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg px-5 pt-4">
        <div className="container-fluid">
          {/* Logo - No changes */}
          <div className="d-flex align-items-center">
            <img
              src="../src/assets/chakrapani_logo.png"
              alt="logo"
              width="90"
            />
            <div className="ms-2 d-flex flex-column">
              <Link to="/" className="navbar-brand fw-bold p-0 section-1">
                CHAKRAPANI ARTS & CRAFTS
              </Link>
              <small className="text-muted">Divinity Redefined</small>
            </div>
          </div>

          {/* Menu */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {/* Search - No changes */}
            <li className="nav-item">
              <div className="search-box position-relative">
                <input
                  type="text"
                  className="form-control form-control rounded-lg"
                  placeholder="Search Paintings"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="btn btn-sm search-btn section-1"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </li>

            {/* Navigation Links - No changes */}
            <Link
              to="/allproducts"
              className="nav-link custom-nav-link section-1"
            >
              All Products
            </Link>
            <Link to="/" className="nav-link custom-nav-link section-1">
              Home Decor
            </Link>

            {/* About Us Dropdown - No changes */}
            <li
              className={`nav-item dropdown ${isOpen ? "show" : ""}`}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <button
                className="nav-link dropdown-toggle bg-transparent border-0 section-1"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                About Us
              </button>
              <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
                <li>
                  <Link className="dropdown-item" to="/wall-art">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/paintings">
                    Our clients
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sculptures">
                    Join withUs
                  </Link>
                </li>
              </ul>
            </li>

            {/* Cart - No changes */}
            <Link to="/cart" className="nav-link custom-nav-link section-1">
              <FaShoppingCart />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill footer-section">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>

            {/* ← CHANGED: User Icon with Dropdown */}
            <li
              className="nav-item position-relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {isLoggedIn ? (
                <>
                  {/* Logged In - Show User Icon */}
                  <button
                    className="nav-link custom-nav-link section-1 bg-transparent border-0"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <FaUser />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="dropdown-menu show position-absolute end-0 shadow nav-user-card">
                      {/* User Info */}
                      <div className="px-3 py-2 border-bottom bg-light">
                        <p className="mb-1 fw-bold text-dark">{user?.name}</p>
                        <p className="mb-0 text-muted small">{user?.email}</p>
                      </div>

                      {/* Logout Button */}
                      <button
                        className="dropdown-item fw-semibold py-2 section-1"
                        onClick={() => {
                          navigate("/orders");
                        }}
                      >
                        {/* <i className="fas fa-sign-out-alt me-2"></i> */}
                        My Orders
                      </button>
                      <button
                        className="dropdown-item fw-semibold py-2 section-1"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Not Logged In - Redirect to login
                <Link
                  to="/login"
                  className="nav-link custom-nav-link section-1"
                >
                  <FaUser />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
