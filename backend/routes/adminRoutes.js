import express from "express";
import {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(protect, admin);

// Product management
router.route("/products")
    .get(getAllProducts)
    .post(addProduct);

router.route("/products/:id")
    .put(updateProduct)
    .delete(deleteProduct);

// Order management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;
