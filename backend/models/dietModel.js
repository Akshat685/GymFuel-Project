import mongoose, { Schema } from 'mongoose';


const dietPlanSchema = new mongoose.Schema({

    mealType: { type: String, required: true },
    foodItem: { type: String, required: true },
    servingSize: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, required: true },
    notes: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'DietCategory', required: true }, // Reference to DietCategory

});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
export default DietPlan;

