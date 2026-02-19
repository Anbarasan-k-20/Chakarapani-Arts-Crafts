import { Link } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaPlus } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold section-1">Admin Dashboard</h2>

      <div className="row g-4 justify-content-center">
        {/* Manage Products Card */}
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm h-100 border-0 bg-light">
            <div className="card-body text-center p-5">
              <FaBoxOpen className="fs-1 text-primary mb-3" />
              <h4 className="card-title fw-semibold">Manage Products</h4>
              <p className="card-text text-muted">
                View, add, edit, and delete products from the store.
              </p>
              <div className="d-grid gap-2">
                <Link to="/admin/products" className="btn btn-outline-primary">
                  View Products
                </Link>
                <Link to="/admin/products/add" className="btn-in p-2 rounded">
                  <FaPlus className="me-2" /> Add New Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Manage Orders Card */}
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm h-100 border-0 bg-light">
            <div className="card-body text-center p-5">
              <FaClipboardList className="fs-1 text-success mb-3" />
              <h4 className="card-title fw-semibold">Manage Orders</h4>
              <p className="card-text text-muted">
                View all orders and update their delivery status.
              </p>
              <div className="d-grid">
                <Link to="/admin/orders" className="btn btn-outline-success">
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
