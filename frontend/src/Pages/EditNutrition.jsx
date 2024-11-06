import React from 'react';
import {
  Button, TextField, Typography, Grid,
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel'; // Import CancelIcon
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon

const EditNutrition = ({ 
  open, 
  handleClose, 
  formData, 
  setFormData, // Ensure this is passed as a prop
  handleEditNutrition 
}) => {
  // Destructure and provide default values to avoid undefined errors
  const {
    foodItem = '',
    protein = '',
    carbs = '',
    fats = '',
    calories = '',
    servingSize = '',
    category = '',
    dietaryRestrictions = [],
    micronutrients = { calcium: '', iron: '' }, // Default structure for micronutrients
    fiber = '',
    sugar = '',
    foodType = ''
  } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Check if the name is for a nested object
    if (name.startsWith('micronutrients.')) {
      const micronutrientKey = name.split('.')[1]; // Get the key (calcium or iron)
      setFormData((prevData) => ({
        ...prevData,
        micronutrients: {
          ...prevData.micronutrients,
          [micronutrientKey]: value // Update the specific micronutrient
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value // Update other fields normally
      }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" color="primary" align="center">Edit Nutrition</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleEditNutrition} style={{ marginTop: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Food Item"
                name="foodItem"
                value={foodItem}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                placeholder="Enter the food item name"
              />
            </Grid>

            {/* Macronutrients Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Macronutrients</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Protein (g)"
                type="number"
                name="protein"
                value={protein}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Carbs (g)"
                type="number"
                name="carbs"
                value={carbs}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4 }>
              <TextField
                label="Fats (g)"
                type="number"
                name="fats"
                value={fats}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            {/* Calories and Serving Size */}
            <Grid item xs={6}>
              <TextField
                label="Calories"
                type="number"
                name="calories"
                value={calories}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Serving Size"
                name="servingSize"
                value={servingSize}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            {/* Category Section */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={category}
                  onChange={handleChange}
                  label="Category"
                >
                  {['Vegetable', 'Fruit', 'Meat', 'Dairy', 'Grains', 'Nuts', 'Other'].map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Dietary Restrictions */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Dietary Restrictions</InputLabel>
                <Select
                  multiple
                  name="dietaryRestrictions"
                  value={dietaryRestrictions}
                  onChange={handleChange}
                  label="Dietary Restrictions"
                >
                  {['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'None'].map((restriction) => (
                    <MenuItem key={restriction} value={restriction}>{restriction}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Micronutrients Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Micronutrients</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Calcium (mg)"
                type="number"
                name="micronutrients.calcium"
                value={micronutrients.calcium}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Iron (mg)"
                type="number"
                name="micronutrients.iron"
                value={micronutrients.iron}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Fiber and Sugar */}
            <Grid item xs={6}>
              <TextField
                label="Fiber (g)"
                type="number"
                name="fiber"
                value={fiber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sugar (g)"
                type="number"
                name="sugar"
                value={sugar}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Food Type */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Food Type</InputLabel>
                <Select
                  name="foodType"
                  value={foodType}
                  onChange={handleChange}
                  label="Food Type"
                >
                  <MenuItem value="Veg">Veg</MenuItem>
                  <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ padding: '20px' }}>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleEditNutrition}
          color="primary"
          variant="contained"
          startIcon={<EditIcon />}
        >
          Edit Nutrition
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNutrition;