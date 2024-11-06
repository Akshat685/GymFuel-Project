// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import authReducer from "./authSlice";
import customerReducer from '../features/customers/customerSlice';
import nutritionReducer from '../features/customers/nutritionSlice';
import dietCategoryReducer from '../features/customers/dietCategorySlice';
import dietReducer from '../features/customers/dietSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
  nutrition: nutritionReducer,
  dietCategories: dietCategoryReducer,
  diets: dietReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for persistence
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

// Create a persistor
export const persistor = persistStore(store);

// Export the store
export default store;
