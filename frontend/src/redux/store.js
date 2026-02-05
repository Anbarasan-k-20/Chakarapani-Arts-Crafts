import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// mock auth reducer for now
const authReducer = (state = { isLoggedIn: true }) => state;

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});
