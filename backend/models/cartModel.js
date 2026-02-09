import mongoose from "mongoose";

// ✅ Cart Item Schema - Each item in the cart
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  // Store product snapshot for quick access (denormalized data)
  productDetails: {
    title: String,
    image: String,
    category: String,
  },
  // Selected size information
  selectedSize: {
    dimension: String,
    originalPrice: Number,
    salePrice: Number,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true, // Price at the time of adding (based on selected size)
  },
});

// ✅ Main Cart Schema - One cart per user
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can have only ONE cart
    },
    items: [cartItemSchema], // Array of cart items
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ✅ Method to calculate total amount
cartSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;