import axios from "axios";

const BASE_URL = "https://vyoobam-bix-backend.onrender.com/api/products";

/**
 * ✅ Get All Categories (for dropdown)
 * GET /api/products/categories
 */
export const getCategories = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/public-categories`);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/**
 * ✅ Get Products By Category
 * GET /api/products/category/:category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const response = await axios.get(`${BASE_URL}/public/category/${category}`);

    const products = response.data;

    const normalized = products.map((p) => ({
      id: p._id,
      title: p.name,
      category: p.category_name,
      price: p.sale_price,
      mrp: p.mrp,
      brand: p.brand_name,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Error fetching products by category:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * ✅ Get Single Product By ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/public/${req.params.id}`);

    const p = response.data;

    const normalized = {
      id: p._id,
      title: p.name,
      category: p.category_name,
      price: p.sale_price,
      mrp: p.mrp,
      brand: p.brand_name,
    };

    res.json(normalized);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// COMMENTED FOR SALESAGE BACKEND

// import Product from "../models/productModel.js";

// /**
//  * @desc    Get all products
//  * @route   GET /api/products
//  */
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();

//     // 🔹 Normalize _id → id for frontend sanity
//     const normalized = products.map((p) => ({
//       id: p._id,
//       title: p.title,
//       category: p.category,
//       image: p.image,
//       price: p.price,
//       description: p.description,
//       sizes: p.sizes,
//       stock: p.stock,
//       rating: p.rating,
//     }));

//     res.json(normalized);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * @desc    Get single product
//  * @route   GET /api/products/:id
//  */
// export const getProductById = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }

//   res.json(product);
// };
