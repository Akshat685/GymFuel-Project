// dietCategoryModel.js
import mongoose from 'mongoose';

// Define the schema for Diet Category
const dietCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
}); // Automatically adds createdAt and updatedAt fields

// Create the model from the schema
const DietCategory = mongoose.model('DietCategory', dietCategorySchema);

export default DietCategory;
