import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * ✅ Protect middleware - Verifies JWT token and attaches user to request
 * Usage: Add this middleware to routes that require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  // ✅ Check if authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ✅ Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // ✅ Continue to next middleware/controller
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // ✅ No token provided
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * ✅ Admin middleware - Allows access only to admin users
 * Usage: Add this AFTER protect middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
