import Customer from "../models/customerModel.js";

// Create Customer
export const createCustomer = async (req, res) => {
    const { name, email, phone, age, gender, subscription, startDate, endDate, goal, weight, height, emergencyContact, medicalConditions, dietPreference } = req.body;
    try {
        const customer = new Customer({ 
            name, email, phone, age, gender, subscription, 
            startDate, endDate, goal, weight, height, 
            emergencyContact, medicalConditions, dietPreference 
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error); 
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

// Get a single Customer by ID
export const getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Customer by ID
export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { 
        name, email, phone, age, gender, subscription, 
        startDate, endDate, goal, weight, height, 
        emergencyContact, medicalConditions, dietPreference 
    } = req.body;

    try {
        const customer = await Customer.findByIdAndUpdate(id, {
            name, email, phone, age, gender, subscription, 
            startDate, endDate, goal, weight, height, 
            emergencyContact, medicalConditions, dietPreference 
        }, { new: true });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Customer by ID
export const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        await Customer.findByIdAndDelete(id);
        console.log(`Customer with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
