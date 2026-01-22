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
            <Link to="/" className="section-1 nav-link">
              All Products
            </Link>
            <Link to="/" className="section-1 nav-link">
              Home Decor
            </Link>
            <Link to="/" className="section-1 nav-link">
              Garden Decor
            </Link>
            {/* <li className="nav-item">All Products</li> */}
            {/* <li className="nav-item">Home Decor</li>
              <li className="nav-item">Garden Decor</li> */}
            <Link to="/" className="section-1 nav-link">
              <FaUser />
            </Link>
            <Link to="/" className="section-1 nav-link">
              <FaShoppingCart />
            </Link>
            {/* below will use as a reference later time */}
            {/* <li className="nav-item position-relative">
              <FaShoppingCart />
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                1
              </span>
            </li> */}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
