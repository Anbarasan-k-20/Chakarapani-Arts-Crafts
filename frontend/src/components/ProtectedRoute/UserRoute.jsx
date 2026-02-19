import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // ✅ Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Block admin users from accessing cart
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Allow regular users
  return children;
};

export default UserRoute;
