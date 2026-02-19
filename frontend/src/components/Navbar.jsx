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
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearCartLocal } from "../redux/cartSlice";
import { useState } from "react";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = isLoggedIn
    ? cartItems.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/allproducts?search=${encodeURIComponent(query)}`);
    setQuery("");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartLocal());
    setShowUserMenu(false);
    navigate("/");
    alert("Logged out successfully!");
  };

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* TOP INFO BAR */}
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
          {/* Logo */}
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
            {/* Search */}
            <li className="nav-item">
              <div className="search-box position-relative">
                <input
                  type="text"
                  className="form-control form-control rounded-lg"
                  placeholder="Search Paintings"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="btn btn-sm search-btn section-1"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </li>

            {/* Navigation Links */}
            <Link
              to="/allproducts"
              className="nav-link custom-nav-link section-1"
            >
              All Products
            </Link>

            {!isAdmin && (
              <Link to="/" className="nav-link custom-nav-link section-1">
                Home Decor
              </Link>
            )}

            {/* About Us Dropdown */}
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

            {/* Cart - Hidden for Admin */}
            {!isAdmin && (
              <Link to="/cart" className="nav-link custom-nav-link section-1">
                <FaShoppingCart />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill footer-section">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </Link>
            )}

            {/* User Dropdown */}
            <li
              className="nav-item position-relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {isLoggedIn ? (
                <>
                  <button
                    className="nav-link custom-nav-link section-1 bg-transparent border-0"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <FaUser />
                    {isAdmin && (
                      <span
                        className="ms-1 badge bg-danger text-white"
                        style={{ fontSize: "0.6rem" }}
                      >
                        ADMIN
                      </span>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="dropdown-menu show position-absolute end-0 shadow nav-user-card">
                      <div className="px-3 py-2 border-bottom bg-light">
                        <p className="mb-1 fw-bold text-dark">{user?.name}</p>
                        <p className="mb-0 text-muted small">{user?.email}</p>
                      </div>

                      {isAdmin ? (
                        <button
                          className="dropdown-item fw-semibold py-2 section-1"
                          onClick={() => navigate("/admin/dashboard")}
                        >
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Dashboard
                        </button>
                      ) : (
                        <button
                          className="dropdown-item fw-semibold py-2 section-1"
                          onClick={() => navigate("/orders")}
                        >
                          My Orders
                        </button>
                      )}

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
