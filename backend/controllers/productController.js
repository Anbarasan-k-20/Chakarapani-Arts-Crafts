import Product from "../models/productModel.js";

/**
 * @desc    Get all products
 * @route   GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // 🔹 Normalize _id → id for frontend sanity
    const normalized = products.map((p) => ({
      id: p._id,
      title: p.title,
      category: p.category,
      image: p.image,
      price: p.price,
      description: p.description,
      sizes: p.sizes,
      stock: p.stock,
      rating: p.rating,
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};
