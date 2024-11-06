import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

const NutritionFormDialog = ({ open, handleClose, handleAddNutrition, formData, handleChange }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" sx={{ color: '#344767', fontWeight: 'bold' }} align="center">
          Add Nutrition
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleAddNutrition} style={{ marginTop: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Food Item"
                name="foodItem"
                value={formData.foodItem}
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
                value={formData.protein}
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
                value={formData.carbs}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Fats (g)"
                type="number"
                name="fats"
                value={formData.fats}
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
                value={formData.calories}
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
                value={formData.servingSize}
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
                  value={formData.category}
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
                  value={formData.dietaryRestrictions}
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
                value={formData.micronutrients.calcium}
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
                value={formData.micronutrients.iron}
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
                value={formData.fiber}
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
                value={formData.sugar}
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
                  value={formData.foodType}
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
        <Button onClick={handleClose} color="secondary" variant="outlined" startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button onClick={handleAddNutrition} color="primary" variant="contained" startIcon={<AddIcon />}>
          Add Nutrition
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NutritionFormDialog;