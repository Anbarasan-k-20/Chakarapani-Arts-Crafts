import mongoose from "mongoose";

// ✅ Product Schema - Matches the JSON structure from products_PRODUCTION.json
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // ✅ IMPORTANT: Sizes array for size-based pricing
    sizes: [
      {
        dimension: {
          type: String,
          required: true,
        },
        originalPrice: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt fields
  },
);

// ✅ ADDED: Indexing for better search performance
productSchema.index({ title: "text", category: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
