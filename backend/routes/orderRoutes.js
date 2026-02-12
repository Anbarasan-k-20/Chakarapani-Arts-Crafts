import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All routes require authentication
router.use(protect);

// ✅ Order CRUD routes
router.post("/create", createOrder);
// POST /api/orders/create - Create new order

router.get("/", getUserOrders);
// GET /api/orders - Get all orders for logged-in user

router.get("/:orderId", getOrderById);
// GET /api/orders/:orderId - Get single order details

router.patch("/:orderId/status", updateOrderStatus);
// PATCH /api/orders/:orderId/status - Update order status (admin)

router.delete("/:orderId/cancel", cancelOrder);
// DELETE /api/orders/:orderId/cancel - Cancel order

export default router;
