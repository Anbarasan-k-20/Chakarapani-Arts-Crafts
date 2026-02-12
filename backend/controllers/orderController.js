import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

/**
 * @desc    Create a new order from cart items
 * @route   POST /api/orders/create
 * @access  Private (requires login)
 *
 * FLOW:
 * 1. Get user's cart
 * 2. Validate cart has items
 * 3. Create order from cart items
 * 4. Clear the cart
 * 5. Return order details
 */
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, specialInstructions } = req.body;

    // ✅ Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Shipping address and payment method are required",
      });
    }

    // ✅ Validate shipping address has all fields
    const requiredAddressFields = [
      "fullName",
      "email",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
    ];
    const missingFields = requiredAddressFields.filter(
      (field) => !shippingAddress[field],
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing address fields: ${missingFields.join(", ")}`,
      });
    }

    // ✅ Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cannot create order from empty cart",
      });
    }

    // ✅ Create order items from cart
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      productDetails: {
        title: item.productDetails.title,
        image: item.productDetails.image,
        category: item.productDetails.category,
      },
      selectedSize: item.selectedSize,
      qty: item.qty,
      price: item.price,
      subtotal: item.price * item.qty,
      // Subtotal for this item
    }));

    // ✅ Calculate order totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    // Sum of all items
    const shippingCost = 0; // Free shipping in India
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const discount = 0; // No discount applied yet
    const totalAmount = subtotal + shippingCost + tax - discount;

    // ✅ Generate unique order number
    const orderNumber = await Order.generateOrderNumber();

    // ✅ Create order document
    const order = new Order({
      user: req.user._id,
      orderNumber,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      // Payment not done yet - just order placed
      orderStatus: "pending",
      // Order placed but not confirmed
      specialInstructions: specialInstructions || "",
      orderHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order placed successfully",
        },
      ],
    });

    // ✅ Save order to database
    await order.save();

    // ✅ Clear user's cart after order created
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 },
    );

    // ✅ Return success response with order details
    res.status(201).json({
      message: "Order created successfully",
      order,
      // Frontend can use this to show order summary
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getUserOrders = async (req, res) => {
  try {
    // ✅ Fetch all orders for logged-in user
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "title image")
      // Populate product details
      .sort({ createdAt: -1 });
    // Newest orders first

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:orderId
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // ✅ Find order and ensure it belongs to logged-in user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      // Security: User can only see their own orders
    }).populate("items.product", "title image category");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PATCH /api/orders/:orderId/status
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    // ✅ Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ✅ Find and update order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ✅ Update status and add to history
    order.orderStatus = status;
    order.orderHistory.push({
      status,
      timestamp: new Date(),
      note: note || "",
    });

    // ✅ If shipped, add estimated delivery date
    if (status === "shipped") {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      // 5 days delivery time
      order.estimatedDeliveryDate = deliveryDate;
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

/**
 * @desc    Cancel order
 * @route   DELETE /api/orders/:orderId/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    // ✅ Find order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      // User can only cancel their own orders
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ✅ Can only cancel pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    // ✅ Update to cancelled
    order.orderStatus = "cancelled";
    order.orderHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      note: reason || "Cancelled by user",
    });

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};
