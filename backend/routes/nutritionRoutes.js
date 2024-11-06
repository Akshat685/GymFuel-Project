import express from 'express';
import { createNutrition, getNutrition, getOneNutrition, updateNutrition, deleteNutrition } from '../controllers/nutritionController.js';

const router = express.Router();

// Create a new nutrition item
router.post('/', createNutrition);

// Get all nutrition items
router.get('/', getNutrition);

// Get one nutrition item by ID
router.get('/:id', getOneNutrition);

// Update a nutrition item by ID
router.put('/:id', updateNutrition);

// Delete a nutrition item by ID
router.delete('/:id', deleteNutrition);

export default router;
