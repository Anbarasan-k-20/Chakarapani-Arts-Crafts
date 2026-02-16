import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
export const addProduct = async (req, res) => {
    try {
        const { title, category, image, price, description, sizes, stock, rating } = req.body;

        const product = new Product({
            title,
            category,
            image,
            price,
            description,
            sizes,
            stock,
            rating,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: "Invalid product data", error: error.message });
    }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/admin/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
    try {
        const { title, category, image, price, description, sizes, stock, rating } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.title = title || product.title;
            product.category = category || product.category;
            product.image = image || product.image;
            product.price = price || product.price;
            product.description = description || product.description;
            product.sizes = sizes || product.sizes;
            product.stock = stock !== undefined ? stock : product.stock;
            product.rating = rating !== undefined ? rating : product.rating;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid product data", error: error.message });
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // Use deleteOne() for Mongoose v6+
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc    Get all products (Admin view)
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc    Get all orders
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = status;
            // Add to history
            order.orderHistory.push({
                status: status,
                timestamp: new Date(),
                note: `Status updated by Admin`,
            });
            // Update deliveredAt if delivered
            if (status === "delivered") {
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid status data", error: error.message });
    }
};
