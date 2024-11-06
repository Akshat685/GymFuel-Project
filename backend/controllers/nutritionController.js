import Nutrition from "../models/nutritionModel.js";

// Create Nutrition
export const createNutrition = async (req, res) => {
    const { 
        foodItem, protein, carbs, fats, calories, servingSize, category, dietaryRestrictions, fiber, sugar, micronutrients, foodType 
    } = req.body;

    try {
        const nutrition = new Nutrition({
            foodItem, protein, carbs, fats, calories, servingSize, category, dietaryRestrictions, fiber, sugar, micronutrients, foodType 
        });

        await nutrition.save();
        res.status(201).json(nutrition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Nutrition items
export const getNutrition = async (req, res) => {
    try {
        const nutrition = await Nutrition.find();
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one Nutrition item by ID
export const getOneNutrition = async (req, res) => {
    const { id } = req.params;

    try {
        const nutrition = await Nutrition.findById(id);
        if (!nutrition) {
            return res.status(404).json({ message: "Nutrition item not found" });
        }
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Nutrition by ID
export const updateNutrition = async (req, res) => {
    const { id } = req.params;
    const { 
        foodItem, protein, carbs, fats, calories, servingSize, category, dietaryRestrictions, fiber, sugar, micronutrients, foodType 
    } = req.body;

    try {
        const nutrition = await Nutrition.findByIdAndUpdate(id, {
            foodItem, protein, carbs, fats, calories, servingSize, category, dietaryRestrictions, fiber, sugar, micronutrients, foodType
        }, { new: true });

        if (!nutrition) {
            return res.status(404).json({ message: "Nutrition item not found" });
        }
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Nutrition by ID
export const deleteNutrition = async (req, res) => {
    const { id } = req.params;

    try {
        const nutrition = await Nutrition.findByIdAndDelete(id);
        if (!nutrition) {
            return res.status(404).json({ message: "Nutrition item not found" });
        }
        // Change status code to 200 and return a message
        res.status(200).json({ message: "Nutrition item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};