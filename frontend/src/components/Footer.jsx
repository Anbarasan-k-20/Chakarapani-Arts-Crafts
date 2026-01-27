import { Link } from "react-router-dom";

const Footer = () => {
  const payment_img = "../src/assets/client_img/payment-image.png";
  const Logo = "../src/assets/chakrapani_logo.png";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section text-white">
      <div className="container py-5 px-5 ">
        {/* Top Footer */}
        <div className="row gy-4">
          {/* Quick Links */}
          <div className="col-12 col-md-3">
            <h5 className="fw-bold pb-5">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/contact" className="hov-col text-decoration-none">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hov-col text-decoration-none">
                  About
                </Link>
              </li>
              <li>
                <Link to="/awards" className="hov-col text-decoration-none">
                  Our Awards
                </Link>
              </li>
              <li>
                <Link to="#" className="hov-col text-decoration-none">
                  News & Media
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hov-col text-decoration-none">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div className="col-12 col-md-3">
            <h5 className="fw-bold pb-5">Important Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/returns" className="hov-col text-decoration-none">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hov-col text-decoration-none">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/security" className="hov-col text-decoration-none">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hov-col text-decoration-none">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="col-12 col-md-3">
            <h5 className="fw-bold pb-5">Explore</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link
                  to="/bestsellers"
                  className="hov-col text-decoration-none"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/sale" className="hov-col text-decoration-none">
                  On Sale
                </Link>
              </li>
              <li>
                <Link to="/best-2022" className="hov-col text-decoration-none">
                  Best Of 2022
                </Link>
              </li>
              <li>
                <Link to="/featured" className="hov-col text-decoration-none">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/gift-card" className="hov-col text-decoration-none">
                  Gift Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="col-12 col-md-3">
            <h5 className="fw-bold pb-5">Help</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link
                  to="/track-order"
                  className="hov-col text-decoration-none"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hov-col text-decoration-none">
                  Delivery & Returns
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hov-col text-decoration-none">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/community" className="hov-col text-decoration-none">
                  Community
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="d-flex gap-3 mt-3">
              <i className="bi bi-facebook text-decoration-none"></i>
              <i className="bi bi-twitter text-decoration-none"></i>
              <i className="bi bi-instagram text-decoration-none"></i>
            </div>
          </div>
        </div>
        <div className="row gy">
          <div className="col-12 col-md-3">
            <img
              className="mt-3"
              src={Logo}
              alt="chakarapani Logo"
              height="150"
            />
          </div>
          <div className="col-12 col-md-3">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/" className="hov-col text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/indoor" className="hov-col text-decoration-none">
                  Indoor
                </Link>
              </li>
              <li>
                <Link to="/outdoors" className="hov-col text-decoration-none">
                  Outdoors
                </Link>
              </li>
              <li>
                <Link to="/about" className="hov-col text-decoration-none">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hov-col text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-3 mt-3">
            <h4 className="fw-bold">Contact US</h4>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom py-4">
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span>© {currentYear} Chakrapani Arts & Crafts</span>

          <span>
            Developed by <strong>Vyoobam Tech</strong>
          </span>

          <div className="d-flex gap-2">
            <img src={payment_img} alt="card" height="22" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
