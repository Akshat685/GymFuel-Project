import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
    foodItem: { type: String, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    calories: { type: Number, required: true },
    servingSize: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Vegetable', 'Fruit', 'Meat', 'Dairy', 'Grains', 'Nuts', 'Other'], 
        required: true 
    },
    dietaryRestrictions: { 
        type: [String], 
        enum: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'None'] 
    },
    fiber: { type: Number },
    sugar: { type: Number },
    micronutrients: {
        
        calcium: { type: Number },
        iron: { type: Number }
    },
    foodType: { type: String, enum: ['Veg', 'Non-Veg'], required: true }
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
export default Nutrition;
