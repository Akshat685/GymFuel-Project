import express from 'express';
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController.js';

const router = express.Router();

// Create a new customer
router.post('/', createCustomer);

// Get all customers
router.get('/', getCustomers);

// Get a single customer by ID
router.get('/:id', getCustomerById);

// Update a customer by ID
router.put('/:id', updateCustomer);

// Delete a customer by ID
router.delete('/:id', deleteCustomer);

export default router;
 