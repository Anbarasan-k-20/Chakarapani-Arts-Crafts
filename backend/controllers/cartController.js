import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private (requires authentication)
 */
export const getCart = async (req, res) => {
  try {
    // ✅ Find cart for logged-in user
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "title image category price sizes stock",
    );

    // ✅ If no cart exists, create an empty one
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: error.message });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, selectedSize, qty = 1 } = req.body;

    // ✅ Validate input
    if (!productId || !selectedSize) {
      return res.status(400).json({
        message: "Product ID and selected size are required",
      });
    }

    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Validate selected size exists in product
    const sizeExists = product.sizes.find(
      (s) => s.dimension === selectedSize.dimension,
    );
    if (!sizeExists) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    // ✅ Find or create cart for user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // ✅ Create unique item identifier (product + size)
    // const itemIdentifier = `${productId}_${selectedSize.dimension}`;

    // ✅ Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize?.dimension === selectedSize.dimension,
    );

    if (existingItemIndex > -1) {
      // ✅ Item exists - increase quantity
      cart.items[existingItemIndex].qty += qty;
    } else {
      // ✅ New item - add to cart
      cart.items.push({
        product: productId,
        productDetails: {
          title: product.title,
          image: product.image,
          category: product.category,
        },
        selectedSize: {
          dimension: selectedSize.dimension,
          originalPrice: selectedSize.originalPrice,
          salePrice: selectedSize.salePrice,
        },
        qty,
        price: selectedSize.salePrice, // ✅ Price at time of adding
      });
    }

    // ✅ Calculate total
    cart.calculateTotal();

    // ✅ Save cart
    await cart.save();

    // ✅ Populate product details before sending response
    await cart.populate(
      "items.product",
      "title image category price sizes stock",
    );

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
};

/**
 * @desc    Increase item quantity
 * @route   PATCH /api/cart/increase/:itemId
 * @access  Private
 */
export const increaseQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    // ✅ Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ Find item in cart
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // ✅ Increase quantity
    item.qty += 1;

    // ✅ Recalculate total
    cart.calculateTotal();

    // ✅ Save
    await cart.save();
    await cart.populate(
      "items.product",
      "title image category price sizes stock",
    );

    res.json({
      message: "Quantity increased",
      cart,
    });
  } catch (error) {
    console.error("❌ Error increasing quantity:", error);
    res
      .status(500)
      .json({ message: "Failed to increase quantity", error: error.message });
  }
};

/**
 * @desc    Decrease item quantity
 * @route   PATCH /api/cart/decrease/:itemId
 * @access  Private
 */
export const decreaseQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // ✅ Decrease quantity (minimum 1)
    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      return res.status(400).json({
        message: "Quantity cannot be less than 1. Use remove instead.",
      });
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate(
      "items.product",
      "title image category price sizes stock",
    );

    res.json({
      message: "Quantity decreased",
      cart,
    });
  } catch (error) {
    console.error("❌ Error decreasing quantity:", error);
    res
      .status(500)
      .json({ message: "Failed to decrease quantity", error: error.message });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:itemId
 * @access  Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ Remove item using Mongoose subdocument method
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // ✅ Pull (remove) the item
    item.deleteOne();

    // ✅ Recalculate total
    cart.calculateTotal();

    await cart.save();
    await cart.populate(
      "items.product",
      "title image category price sizes stock",
    );

    res.json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("❌ Error removing item:", error);
    res
      .status(500)
      .json({ message: "Failed to remove item", error: error.message });
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ Clear all items
    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.json({
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: error.message });
  }
};
