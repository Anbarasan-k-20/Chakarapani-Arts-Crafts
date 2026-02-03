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

const Navbar = () => {
    // Local state for search input
  // This is TEMPORARY UI state (not global, not Redux)
  const [query, setQuery] = useState("");

  // Used to programmatically change route
  const navigate = useNavigate();

  // Called when user clicks search button or presses Enter
  const handleSearch = () => {
    // Guard clause: avoid empty searches
    if (!query.trim()) return;

    // 👉 Redirect user to AllProducts page
    // Search value is stored in URL (query param)
    // This is the KEY architectural decision
    navigate(`/allproduct?search=${encodeURIComponent(query)}`);

    // Optional UX cleanup
    setQuery("");
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* 🔝 TOP INFO BAR */}
      <div className="top-info-bar d-flex align-items-center px-5 py-2 section-1">
        <div className="d-flex gap-3">
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
          <div className="offer-track  text-light d-flex gap-5">
            <span>🔥 Special 50% Discount Offer 🔥</span>
            <span>Free Shipping All Over India 🚚</span>
            <span>Limited Time Sale – Buy Now 🔥</span>
          </div>
        </div>
        <div className="d-flex gap-4 small text-light">
          {/* <span>
              <FaPhoneAlt className="me-1" />
              +91 99999 99999
            </span> */}
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
              <small className="text-muted ">Divinity Redefined</small>
            </div>
          </div>

          {/* Menu */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {/* 🔍 Search */}
            <li className="nav-item">
              <div className="search-box position-relative">
                {/* Input */}
                <input
                  type="text"
                  className="form-control form-control rounded-lg"
                  placeholder="Search Paintings"
                />

                {/* Button */}
                <button  onClick={handleSearch} className="btn btn-sm search-btn section-1">
                  <span>
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </button>
              </div>
            </li>

            <Link
              to="/allproduct"
              className="nav-link custom-nav-link section-1"
            >
              All Products
            </Link>
            <Link to="/" className="nav-link custom-nav-link section-1">
              Home Decor
            </Link>
            {/* <Link to="/" className="nav-link custom-nav-link section-1">
              About Us
            </Link> */}
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

            <Link to="/cart" className="nav-link custom-nav-link section-1">
              <FaShoppingCart />
              <span>1</span>
            </Link>
            {/* <Link to="/" className="nav-link custom-nav-link section-1">
              <FaHeart />
              <span>1</span>
            </Link> */}
            <Link to="/" className="nav-link custom-nav-link section-1">
              <FaUser />
            </Link>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
