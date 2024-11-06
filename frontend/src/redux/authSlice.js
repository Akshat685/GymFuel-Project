// src/redux/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      return {
        token: response.data.token,
        username: response.data.username, // Ensure this is returned
        email: response.data.email // Ensure this is returned
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Create async thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      return {
        username: response.data.username, // Ensure this is returned
        email: response.data.email // Ensure this is returned
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    username: null, // Add username to initial state
    email: null, // Add email to initial state
    error: null,
    loading: false,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null; // Clear username on logout
      state.email = null; // Clear email on logout
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username; // Set username
        state.email = action.payload.email; // Set email
        localStorage.setItem("token", action.payload.token); // Store token
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("username", action.payload.username);
                console.log('User logged in:', action.payload); // Debugging log

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username; // Set username
        state.email = action.payload.email; // Set email
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logout, clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;