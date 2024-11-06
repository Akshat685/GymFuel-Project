// src/slices/dietSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDiets = createAsyncThunk("diets/fetchDiets", async () => {
    const response = await axios.get("http://localhost:5000/api/diets");
    return response.data;
});

export const createDiet = createAsyncThunk("diets/createDiet", async (newDiet) => {
    const response = await axios.post("http://localhost:5000/api/diets", newDiet);
    return response.data;
});

export const updateDiet = createAsyncThunk("diets/updateDiet", async (diet) => {
    const { _id, mealType, foodItem, servingSize, calories, protein, carbs, fats, fiber, notes, category } = diet;

    const response = await axios.put(`http://localhost:5000/api/diets/${_id}`, {
        mealType,
        foodItem,
        servingSize,
        calories,
        protein,
        carbs,
        fats,
        fiber,
        notes,
        category,  // Ensure category is sent with the request
    });

    return response.data;
});

export const deleteDiet = createAsyncThunk("diets/deleteDiet", async (id) => {
    await axios.delete(`http://localhost:5000/api/diets/${id}`);
    return id;
});

const dietSlice = createSlice({
    name: "diets",
    initialState: {
        diets: [],
        status: "idle",
        error: null,
        editingId: null,
        newDiet: {
            mealType: "",
            foodItem: "",
            servingSize: "",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
            notes: "",
            category: "",
        },
        activeCategory: null,
        showModal: false,
        errorMessage: "",
    },
    reducers: {
        setEditingId: (state, action) => {
            state.editingId = action.payload;
        },
        setActiveCategory: (state, action) => {
            state.activeCategory = action.payload;
        },
        setShowModal: (state, action) => {
            state.showModal = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setNewDiet: (state, action) => {
            state.newDiet = {
                ...state.newDiet,
                ...action.payload,
            };
        },
        updateDietField: (state, action) => {
            const { id, name, value } = action.payload;
            state.diets = state.diets.map(diet =>
                diet._id === id ? { ...diet, [name]: value } : diet
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiets.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDiets.fulfilled, (state, action) => {
                console.log("Fetched Diets:", action.payload); // Debug the payload
                state.status = "succeeded";
                state.diets = action.payload;
            })
            .addCase(fetchDiets.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createDiet.fulfilled, (state, action) => {
                state.diets.push(action.payload);
                state.showModal = false;
                state.errorMessage = "";
            })
            .addCase(updateDiet.fulfilled, (state, action) => {
                state.diets = state.diets.map(diet =>
                    diet._id === action.payload._id ? action.payload : diet
                );
                state.editingId = null;
            })
            .addCase(deleteDiet.fulfilled, (state, action) => {
                state.diets = state.diets.filter(diet => diet._id !== action.payload);
            });
    },
});

export const {
    setEditingId,
    setActiveCategory,
    setShowModal,
    setErrorMessage,
    setNewDiet,
    updateDietField,
} = dietSlice.actions;

export default dietSlice.reducer;
