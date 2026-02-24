import express from "express";
import {
  getCategories,
  getProductsByCategory,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

export default router;

// fOR SALE SAGE
// import express from "express";
// import {
//   getProducts,
//   getProductById,
// } from "../controllers/productController.js";

// const router = express.Router();

// router.get("/", getProducts);
// router.get("/:id", getProductById);

// export default router;
