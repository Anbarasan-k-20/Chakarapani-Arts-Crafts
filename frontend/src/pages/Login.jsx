import { useState } from "react";
import api from "../api/axiosInstance.js";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux"; // ← ADD
import { loginSuccess } from "../redux/authSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      dispatch(
        loginSuccess({
          user: res.data.user, // Backend should return { id, name, email }
          token: res.data.token,
        }),
      );
      alert("Login successful!");
      navigate("/"); // Go to home page
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4 p-md-5 section-1">
              <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
              <p className="text-center text-muted mb-4">
                Sign in to your account
              </p>

              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field with Eye Icon */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <i
                        className={`fas fa-eye${showPassword ? "-slash" : ""}`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-in w-100 py-2 fw-semibold mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="text-center my-4 position-relative">
                  <hr className="w-100" />
                  <span className="bg-white px-3 position-absolute top-50 start-50 translate-middle text-muted">
                    OR
                  </span>
                </div>

                {/* Social Login (Optional) */}
                {/* <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mb-2"
                    disabled={loading}
                  >
                    <i className="fab fa-google me-2"></i>
                    Sign in with Google
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    disabled={loading}
                  >
                    <i className="fab fa-facebook-f me-2"></i>
                    Sign in with Facebook
                  </button>
                </div> */}

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-decoration-none fw-semibold"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <small className="text-muted">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-decoration-none">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-decoration-none">
                Privacy Policy
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
