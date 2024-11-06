import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:5000/api/nutrition';

// Thunks for CRUD operations
export const fetchNutrition = createAsyncThunk('nutrition/fetch', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const createNutrition = createAsyncThunk('nutrition/create', async (nutrition) => {
  const response = await axios.post(API_URL, nutrition);
  return response.data;
});

export const updateNutrition = createAsyncThunk('nutrition/update', async ({ id, data }) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
});

export const deleteNutrition = createAsyncThunk('nutrition/delete', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutrition.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createNutrition.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateNutrition.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        state.items[index] = action.payload;
      })
      .addCase(deleteNutrition.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default nutritionSlice.reducer;
