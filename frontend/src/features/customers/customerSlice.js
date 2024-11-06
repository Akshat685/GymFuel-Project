import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://gymfuel-project-2.onrender.com/api/customers';

// Async thunks for CRUD operations
export const fetchCustomers = createAsyncThunk('customers/fetchAll', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const createCustomer = createAsyncThunk('customers/create', async (customer) => {
    const response = await axios.post(API_URL, customer);
    return response.data;
});

export const updateCustomer = createAsyncThunk(
    'customers/update',
    async ({ id, customer }) => {
        const response = await axios.put(`${API_URL}/${id}`, customer);
        return response.data;
    }
);

export const deleteCustomer = createAsyncThunk('customers/delete', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.customers.push(action.payload);
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const index = state.customers.findIndex((c) => c._id === action.payload._id);
                state.customers[index] = action.payload;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter((c) => c._id !== action.payload);
            });
    },
});

export default customerSlice.reducer;
