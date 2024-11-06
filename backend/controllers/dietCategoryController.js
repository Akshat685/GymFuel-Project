// dietCategoryController.js
import DietCategory from '../models/dietCategoryModel.js';

// Create a new Diet Category
export const addDietCategory  = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
      }
    
  try {
    const newCategory = new DietCategory({ name, description });
    await newCategory.save();
    res.status(201).json({ message: 'Diet category created successfully', newCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Diet Categories
export const getAllDietCategories = async (req, res) => {
  try {
    const categories = await DietCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Diet Category by ID
export const getDietCategoryById = async (req, res) => {
  try {
    const category = await DietCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Diet Category
export const updateDietCategory = async (req, res) => {
  try {
    const updatedCategory = await DietCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Diet Category
export const deleteDietCategory = async (req, res) => {
  try {
    const deletedCategory = await DietCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const dietCategoryController = {
    addDietCategory  ,
    getAllDietCategories,
    getDietCategoryById,
    updateDietCategory,
    deleteDietCategory,
  };

export default dietCategoryController;