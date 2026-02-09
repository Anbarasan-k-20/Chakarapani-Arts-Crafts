import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null, // Will store: { id, name, email }
    token: null,
  },
  reducers: {
    // Called when user logs in successfully
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // Called when user clicks logout
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // Called when app loads - checks if user was logged in before
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        state.isLoggedIn = true;
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
