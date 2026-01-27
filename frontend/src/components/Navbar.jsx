import { FaUser, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg px-5 py-4">
        <div className="container-fluid">
          {/* Logo */}
          <div className="d-flex align-items-center gap-">
            <img
              src="../src/assets/chakrapani_logo.png"
              alt="logo"
              width="90"
            />
            <div>
              <h5 className="mb-0 fw-bold ">CHAKRAPANI ARTS & CRAFTS</h5>
              <small className="text-dark ">Divinity Redefined</small>
            </div>
          </div>

          {/* Menu */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <Link to="/" className="section-1 nav-link custom-nav-link">
              All Products
            </Link>
            <Link to="/" className="section-1 nav-link custom-nav-link">
              Home Decor
            </Link>
            <Link to="/" className="section-1 nav-link custom-nav-link">
              Garden Decor
            </Link>
            <Link to="/" className="section-1 nav-link custom-nav-link">
              <FaShoppingCart />
            </Link>
            <Link to="/" className="section-1 nav-link custom-nav-link">
              <FaUser />
            </Link>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
