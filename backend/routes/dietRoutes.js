import express from 'express';
import {
    createDietPlan,
    getDietPlans,
    updateDietPlan,
    deleteDietPlan
} from '../controllers/dietController.js';

const router = express.Router();

// Create a new diet plan
router.post('/', createDietPlan);

// Get all diet plans
router.get('/', getDietPlans);

// Update a diet plan by ID
router.put('/:id', updateDietPlan);

// Delete a diet plan by ID
router.delete('/:id', deleteDietPlan);

export default router;
