import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer, // ←  Register auth reducer
  },
});

export default store;