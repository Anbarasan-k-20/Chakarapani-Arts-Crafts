import {
  FaUser,
  FaShoppingCart,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaHeart,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      {/* 🔔 OFFER BAR */}
      <div className="bg-danger text-light py-1 overflow-hidden">
        <div className="offer-track d-flex gap-5">
          <span>🔥 Special 50% Discount Offer 🔥</span>
          <span>Free Shipping All Over India 🚚</span>
          <span>Limited Time Sale – Buy Now 🔥</span>
        </div>
      </div>

      {/* 🧭 MAIN NAVBAR */}
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
            <li className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control"
                placeholder="Search Paintings"
              />
              <button className="btn-in px-3 py-1 rounded">Search</button>
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
            <Link to="/" className="nav-link custom-nav-link section-1">
              Garden Decor
            </Link>
            <Link to="/" className="nav-link custom-nav-link section-1">
              <FaShoppingCart />
              <span>1</span>
            </Link>
            <Link to="/" className="nav-link custom-nav-link section-1">
              <FaHeart />
              <span>1</span>
            </Link>
            <Link to="/" className="nav-link custom-nav-link section-1">
              <FaUser />
            </Link>
          </ul>
        </div>
      </nav>
      {/* 📞 SOCIAL + CONTACT BAR */}
      <div className="py-2 px-5 d-flex justify-content-between align-items-center  navbar">
        {/* Left: Social Icons */}
        <div className="d-flex gap-3">
          <a href="https://facebook.com" target="_blank" className="text-dark">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" className="text-dark">
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            className="text-dark"
          >
            <FaWhatsapp />
          </a>
        </div>

        {/* Right: Contact Info */}
        <div className="d-flex gap-4 align-items-center small">
          <span>
            <FaPhoneAlt className="me-1 text-danger" />
            +91 99999 99999
          </span>
          <span>
            <FaEnvelope className="me-1 text-danger" />
            support@chakrapaniarts.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
