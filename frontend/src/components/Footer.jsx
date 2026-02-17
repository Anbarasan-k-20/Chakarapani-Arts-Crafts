import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const payment_img = "../src/assets/client_img/payment-image.png";
  const Logo = "../src/assets/chakrapani_logo.png";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="container py-5">
        <div className="row g-4">
          {/* Logo & About */}
          <div className="col-lg-3 col-md-6">
            <img
              src={Logo}
              alt="Chakrapani Arts & Crafts"
              className="footer-logo mb-3"
            />
            <p className="text-white-50 small mb-3">
              Bringing traditional Indian art and crafts to your home with
              exquisite handcrafted pieces.
            </p>
            {/* Social Icons */}
            <div className="d-flex gap-2">
              <a
                href="https://facebook.com"
                className="social-icon"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="social-icon"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="social-icon"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/products">Shop</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading text-white mb-3">Customer Care</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/track-order">Track Order</Link>
              </li>
              <li>
                <Link to="/returns">Returns & Exchange</Link>
              </li>
              <li>
                <Link to="/delivery">Shipping Info</Link>
              </li>
              <li>
                <Link to="/faqs">FAQs</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading text-white mb-3">Categories</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/products?search=paintings">Paintings</Link>
              </li>
              <li>
                <Link to="/products?search=sculptures">Sculptures</Link>
              </li>
              <li>
                <Link to="/bestsellers">Bestsellers</Link>
              </li>
              <li>
                <Link to="/featured">Featured</Link>
              </li>
              <li>
                <Link to="/gift-card">Gift Cards</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading text-white mb-3">Get In Touch</h6>
            <ul className="list-unstyled footer-contact">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                <span>
                  No.22, 8th Street, Kamraj Nagar,
                  <br />
                  Kumbakonam, Thanjavur – 612001
                </span>
              </li>
              <li className="mb-2">
                <FaPhoneAlt className="me-2" />
                <a href="tel:+919444150104">+91 94441 50104</a>
              </li>
              <li className="mb-3">
                <FaEnvelope className="me-2" />
                <a href="mailto:chakrapaniart@gmail.com">
                  chakrapaniart@gmail.com
                </a>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-4">
              {/* <p className="fw-bold mb-2">We Accept</p> */}
              <img
                src={payment_img}
                alt="Payment Methods"
              // className="img-fluid"
              // style={{ maxWidth: "180px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0 small fw-bold text-light">
                © {currentYear} Chakrapani Arts & Crafts. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="mb-0 small">
                Developed By{" "}
                <a
                  href="https://vyoobam.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="developer-link"
                >
                  Vyoobam Tech. | Empowering Digital Solutions
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
