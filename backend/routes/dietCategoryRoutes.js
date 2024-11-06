// dietCategoryRoutes.js
import express from 'express';
import {
    addDietCategory ,
    getAllDietCategories,
    getDietCategoryById,
    updateDietCategory,
    deleteDietCategory
  } from '../controllers/dietCategoryController.js'; // Make sure to include the .js extension
  
const router = express.Router();

// Route to create a new diet category
router.post('/',addDietCategory );

// Route to get all diet categories
router.get('/', getAllDietCategories);

// Route to get a diet category by ID
router.get('/:id', getDietCategoryById);

// Route to update a diet category by ID
router.put('/:id', updateDietCategory);

// Route to delete a diet category by ID
router.delete('/:id', deleteDietCategory);

export default router;
