import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// ✅ Async thunk to fetch cart from backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// ✅ Async thunk to add item to cart (backend)
export const addToCartBackend = createAsyncThunk(
  "cart/addToCartBackend",
  async ({ productId, selectedSize, qty = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart/add", {
        productId,
        selectedSize,
        qty,
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

// ✅ Async thunk to increase quantity
export const increaseQtyBackend = createAsyncThunk(
  "cart/increaseQtyBackend",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cart/increase/${itemId}`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to increase quantity",
      );
    }
  },
);

// ✅ Async thunk to decrease quantity
export const decreaseQtyBackend = createAsyncThunk(
  "cart/decreaseQtyBackend",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cart/decrease/${itemId}`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decrease quantity",
      );
    }
  },
);

// ✅ Async thunk to remove item
export const removeFromCartBackend = createAsyncThunk(
  "cart/removeFromCartBackend",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

// ✅ Async thunk to clear cart
export const clearCartBackend = createAsyncThunk(
  "cart/clearCartBackend",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/cart/clear");
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Clear cart locally (used on logout)
    clearCartLocal: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    // ✅ Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ✅ Add to Cart
    builder
      .addCase(addToCartBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(addToCartBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ✅ Increase Quantity
    builder.addCase(increaseQtyBackend.fulfilled, (state, action) => {
      state.items = action.payload.items || [];
      state.totalAmount = action.payload.totalAmount || 0;
    });

    // ✅ Decrease Quantity
    builder.addCase(decreaseQtyBackend.fulfilled, (state, action) => {
      state.items = action.payload.items || [];
      state.totalAmount = action.payload.totalAmount || 0;
    });

    // ✅ Remove from Cart
    builder.addCase(removeFromCartBackend.fulfilled, (state, action) => {
      state.items = action.payload.items || [];
      state.totalAmount = action.payload.totalAmount || 0;
    });

    // ✅ Clear Cart
    builder.addCase(clearCartBackend.fulfilled, (state) => {
      state.items = [];
      state.totalAmount = 0;
    });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
