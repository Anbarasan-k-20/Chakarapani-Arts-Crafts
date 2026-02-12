import mongoose from "mongoose";

// ✅ Shipping Address Schema - Store delivery address details
const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    // User's full name for delivery
  },
  email: {
    type: String,
    required: true,
    // Contact email for order updates
  },
  phone: {
    type: String,
    required: true,
    // Phone number for delivery contact
  },
  addressLine1: {
    type: String,
    required: true,
    // Primary address (street, building, etc.)
  },
  addressLine2: {
    type: String,
    default: "",
    // Secondary address (apartment, suite, etc.) - optional
  },
  city: {
    type: String,
    required: true,
    // City/Town name
  },
  state: {
    type: String,
    required: true,
    // State/Province name
  },
  postalCode: {
    type: String,
    required: true,
    // ZIP/Postal code for delivery
  },
  country: {
    type: String,
    required: true,
    default: "India",
    // Country name
  },
});

// ✅ Order Item Schema - Individual product in the order
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    // Reference to the product ordered
  },
  productDetails: {
    title: String,
    image: String,
    category: String,
    // Snapshot of product info at time of order
  },
  selectedSize: {
    dimension: String,
    originalPrice: Number,
    salePrice: Number,
    // Size and pricing details at checkout time
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    // How many units of this product ordered
  },
  price: {
    type: Number,
    required: true,
    // Final price per unit (sale price)
  },
  subtotal: {
    type: Number,
    required: true,
    // price × qty for this item
  },
});

// ✅ Main Order Schema - Complete order document
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // User who placed the order
    },
    orderNumber: {
      type: String,
      unique: true,
      // Unique order ID like ORD-123456
    },
    items: [orderItemSchema],
    // Array of products in this order

    shippingAddress: shippingAddressSchema,
    // Where to deliver the order

    // ✅ PRICING BREAKDOWN
    subtotal: {
      type: Number,
      required: true,
      // Sum of all items before tax/shipping
    },
    shippingCost: {
      type: Number,
      default: 0,
      // Delivery charges (0 for free shipping in India)
    },
    tax: {
      type: Number,
      default: 0,
      // GST or other applicable taxes
    },
    discount: {
      type: Number,
      default: 0,
      // Any coupon/promo discount applied
    },
    totalAmount: {
      type: Number,
      required: true,
      // Final amount to be paid (subtotal + tax + shipping - discount)
    },

    // ✅ PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      // Whether payment is done or waiting
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "net_banking", "cod"],
      required: true,
      // How user paid or will pay
    },
    paymentId: {
      type: String,
      // Reference ID from payment gateway (Razorpay, etc.)
    },

    // ✅ ORDER STATUS
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      // Current status of the order
    },
    orderHistory: [
      {
        status: String,
        // Status at a point in time
        timestamp: Date,
        // When this status update happened
        note: String,
        // Optional note (e.g., "Shipped from warehouse X")
      },
    ],
    // Track when order moved through different statuses

    // ✅ SPECIAL NOTES
    specialInstructions: {
      type: String,
      default: "",
      // User's delivery instructions or notes
    },

    // ✅ TRACKING
    trackingNumber: {
      type: String,
      default: null,
      // Courier tracking number when shipped
    },
    estimatedDeliveryDate: {
      type: Date,
      // When order is expected to arrive
    },
  },
  {
    timestamps: true,
    // Automatically adds createdAt and updatedAt
  }
);

// ✅ Helper method to calculate total
orderSchema.methods.calculateTotal = function () {
  this.totalAmount =
    this.subtotal + this.shippingCost + this.tax - this.discount;
};

// ✅ Helper method to generate unique order number
orderSchema.statics.generateOrderNumber = async function () {
  const count = await this.countDocuments();
  // Get count of existing orders
  const orderNumber = `ORD-${Date.now()}-${count + 1}`;
  // Format: ORD-1234567890-1
  return orderNumber;
};

const Order = mongoose.model("Order", orderSchema);

export default Order;