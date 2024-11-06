import DietPlan from '../models/dietModel.js';

// Create a new diet plan
export const createDietPlan = async (req, res) => {
    const { mealType, foodItem, servingSize, calories, protein, carbs, fats, fiber, notes,category } = req.body;

    try {
        const newDietPlan = new DietPlan({
            mealType,
            foodItem,
            servingSize,
            calories,
            protein,
            carbs,
            fats,
            fiber,
            notes,
            category
        });
        await newDietPlan.save();
        res.status(201).json({
            message: "Diet plan created successfully",
            dietPlan: newDietPlan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all diet plans
export const getDietPlans = async (req, res) => {
    try {
        const dietPlans = await DietPlan.find();
        res.status(200).json(dietPlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a diet plan by ID
export const updateDietPlan = async (req, res) => {
    const { id } = req.params;
    console.log("Received ID:", id); // Debugging the ID

    const { mealType, foodItem, servingSize, calories, protein, carbs, fats, fiber, notes, category } = req.body;
    console.log("Received Payload:", req.body); // Debugging the request body

    try {
        const existingDietPlan = await DietPlan.findById(id);
        console.log("Existing Diet Plan:", existingDietPlan); // Check if the diet plan exists

        if (!existingDietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }

        // Update only if fields are provided
        existingDietPlan.mealType = mealType || existingDietPlan.mealType;
        existingDietPlan.foodItem = foodItem || existingDietPlan.foodItem;
        existingDietPlan.servingSize = servingSize || existingDietPlan.servingSize;
        existingDietPlan.calories = calories !== undefined ? calories : existingDietPlan.calories;
        existingDietPlan.protein = protein !== undefined ? protein : existingDietPlan.protein;
        existingDietPlan.carbs = carbs !== undefined ? carbs : existingDietPlan.carbs;
        existingDietPlan.fats = fats !== undefined ? fats : existingDietPlan.fats;
        existingDietPlan.fiber = fiber !== undefined ? fiber : existingDietPlan.fiber;
        existingDietPlan.notes = notes || existingDietPlan.notes;

        // Ensure category is updated only if present
        if (category) {
            existingDietPlan.category = category;
        }

        const updatedDietPlan = await existingDietPlan.save();
        console.log("Updated Diet Plan:", updatedDietPlan); // Debug the updated object

        res.status(200).json({
            message: "Diet plan updated successfully",
            dietPlan: updatedDietPlan,
        });
    } catch (error) {
        console.error("Error in updateDietPlan:", error); // Log the full error
        res.status(500).json({ message: error.message });
    }
};


// Delete a diet plan by ID
export const deleteDietPlan = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDietPlan = await DietPlan.findByIdAndDelete(id);
        
        if (!deletedDietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }

        res.status(200).json({ message: "Diet plan deleted successfully" });        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
