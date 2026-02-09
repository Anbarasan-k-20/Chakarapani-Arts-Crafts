import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container text-center mt-5 pt-5">
      <div className="row justify-content-center section-1">
        <div className="col-md-6">
          {/* Error Code */}
          <h1 className="display-1 fw-bold">404</h1>

          {/* Error Message */}
          <h2 className="mb-3">Page Not Found</h2>

          {/* Description */}
          <p className="text-muted mb-4">
            The page you are looking for doesn't exist or has been moved.
          </p>

          {/* Home Button */}
          <Link to="/" className="btn btn-in text-light btn-lg">
            <i className="fas fa-home me-2"></i>
            Go Back Home
          </Link>

          {/* Optional Image */}
          <div className="mt-5 mb-5">
            <i className="fas fa-search fa-3x text-muted mb-5"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
