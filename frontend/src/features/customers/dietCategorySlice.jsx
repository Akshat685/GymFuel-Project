import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all diet categories
export const fetchDietCategories = createAsyncThunk(
  'dietCategories/fetchDietCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/dietcategory');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to add a new diet category
export const addCategory = createAsyncThunk(
  'dietCategories/addCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/dietcategory', category);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update an existing diet category
export const updateCategory = createAsyncThunk(
  'dietCategories/updateCategory',
  async ({ id, updatedCategory }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/dietcategory/${id}`, updatedCategory);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a diet category
export const deleteCategory = createAsyncThunk(
  'dietCategories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/dietcategory/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Diet Category Slice
const dietCategorySlice = createSlice({
  name: 'dietCategories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null; // Action to clear the error state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchDietCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDietCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchDietCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      });
  },
});

// Export the actions and reducer
export const { clearError } = dietCategorySlice.actions;
export default dietCategorySlice.reducer;