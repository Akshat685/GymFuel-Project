import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    subscription: { type: String, required: true },
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    goal: { type: String, enum: ['Weight Gain', 'Weight Loss', 'Maintenance'], required: true },
    height: { type: Number, required: true },  // New field
    weight: { type: Number, required: true },  // New field
    emergencyContact: {  // New field
        name: { type: String, required: true },
        phone: { type: String, required: true },
    },
    medicalConditions: { type: String },  // New field
    dietPreference: { type: String, enum: ['Veg', 'Non-Veg'], required: true },  // New field
});


const Customer = mongoose.model('Customer', customerSchema);
export default Customer;