import express from "express";
import {
  getCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All routes require authentication (protect middleware)
router.use(protect);

// ✅ Cart CRUD operations
router.get("/", getCart);                           // GET /api/cart
router.post("/add", addToCart);                     // POST /api/cart/add
router.patch("/increase/:itemId", increaseQty);     // PATCH /api/cart/increase/:itemId
router.patch("/decrease/:itemId", decreaseQty);     // PATCH /api/cart/decrease/:itemId
router.delete("/remove/:itemId", removeFromCart);   // DELETE /api/cart/remove/:itemId
router.delete("/clear", clearCart);                 // DELETE /api/cart/clear

export default router;