import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// ✅ NEW: Import order routes

import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // || "http://localhost:5173"
    credentials: true,
  }),
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
// ✅ NEW: Register admin routes
app.use("/api/admin", adminRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
