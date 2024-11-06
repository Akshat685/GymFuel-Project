import AddNutrition from './AddNutrition';
import EditNutrition from './EditNutrition'; // Adjust the path as necessary
import React, { useEffect, useState } from 'react';
import {
  Button, Typography, Grid,
  Card, CardContent, CardActions, AppBar, Toolbar, Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton,
} from '@mui/material';
import { useNavigate, useParams, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchNutrition, createNutrition, updateNutrition, deleteNutrition } from '../features/customers/nutritionSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const Nutrition = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { items } = useSelector((state) => state.nutrition);

  const initialFormData = {
    foodItem: '',
    protein: '',
    carbs: '',
    fats: '',
    calories: '',
    servingSize: '',
    category: '',
    dietaryRestrictions: [],
    micronutrients: { calcium: '', iron: '' },
    fiber: '',
    sugar: '',
    foodType: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedNutrition, setSelectedNutrition] = useState({ ...formData });
  const [openDialog, setOpenDialog] = useState(false);
  const [nutritionToDelete, setNutritionToDelete] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  

  useEffect(() => {
    dispatch(fetchNutrition());
  }, [dispatch]);

  const editingNutrition = id ? items.find((item) => item._id === id) : null;

  useEffect(() => {
    if (editingNutrition) setFormData(editingNutrition);
  }, [editingNutrition]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.'); // Split "micronutrients.calcium" into ["micronutrients", "calcium"]
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEditOpen = (nutrition) => {
    setSelectedNutrition(nutrition); // Ensure 'nutrition' has the correct structure
    setEditOpen(true);
  };


  const handleEditNutrition = (e) => {
    e.preventDefault();
    // Dispatch the update action here
    dispatch(updateNutrition({ id: selectedNutrition._id, data: selectedNutrition }));
    setEditOpen(false); // Close the modal after editing
    toast.success('Nutrition updated successfully!'); // Show success toast
  };

  const handleSubmit = () => {
    if (id) {
      dispatch(updateNutrition({ id, data: formData }));
    } else {
      dispatch(createNutrition(formData));
    }
    handleCloseAddModal();
    setFormData({
      foodItem: '', protein: '', carbs: '', fats: '', calories: '',
      servingSize: '', category: '', foodType: '', fiber: '',
      sugar: '', dietaryRestrictions: [], micronutrients: {
        calcium: '', iron: ''
      }
    });
    navigate('/nutrition');
  };

  const handleAddNutrition = () => {
    const isFormValid = formData.foodItem && formData.protein && formData.carbs &&
      formData.fats && formData.calories && formData.servingSize &&
      formData.category && formData.foodType;

    if (!isFormValid) {
      toast.error('Please fill in all required fields.'); // Show error toast
      return; // Prevent submission
    }

    handleSubmit();
    toast.success('Nutrition added successfully!'); // Show success toast
  };

  const handleDeleteConfirmation = (nutritionId) => {
    setNutritionToDelete(nutritionId);
    setOpenDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    toast.info('Deletion cancelled.');
  };

  const handleDelete = () => {
    if (nutritionToDelete) {
      dispatch(deleteNutrition(nutritionToDelete));
      toast.success('Nutrition data deleted successfully.');
    }
    setOpenDialog(false);
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    resetForm(); // Reset form data when closing the modal
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleCancel = () => {
    handleCloseAddModal();
  }


  return (
    <div style={{ width: '1250px !important', margin: '0 auto' }}>

    <Container>
      <AppBar position="static" sx={{ background: 'linear-gradient(90deg, rgba(25, 118, 210, 1) 0%, rgba(0, 150, 136, 1) 100%)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <Toolbar>
          <Typography variant="h5" color="inherit" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px' }}>
            Nutrition Item List
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={handleOpenAddModal}
            sx={{
              backgroundColor: '#4CAF50', // Set the background color to green
              
            }}
          >
            Add Nutrition
          </Button>
        </Toolbar>
      </AppBar>
      {/* view  */}
      <Routes>
        <Route
          path="/"
          element={
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card elevation={3} sx={{ padding: 2, borderRadius: 10, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ padding: 2 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1, color: '#333' }}>
                        {item.foodItem} {/* Food Item Heading */}
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Category:</span> {item.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Food Type:</span> {item.foodType}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Nutrition Facts:</span>
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Protein:</span> {item.protein} g
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Carbs:</span> {item.carbs} g
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Fats:</span> {item.fats} g
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Calories:</span> {item.calories}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Serving Size:</span> {item.servingSize}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Fiber:</span> {item.fiber} g
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Sugar:</span> {item.sugar} g
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Dietary Restrictions:</span> {item.dietaryRestrictions.join(', ') || 'None'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: 14, color: '#666' }}>
                            <span style={{ fontWeight: 'bold' }}>Micronutrients:</span>
                            {`Calcium: ${item.micronutrients?.calcium || 'N/A'} mg, 
    Iron: ${item.micronutrients?.iron || 'N/A'} mg`}
                          </Typography>
                        </Grid>
                      </Grid>

                      <CardActions sx={{ justifyContent: 'flex-end', padding: 1 }}>
                        <IconButton size="small" onClick={() => handleEditOpen(item)}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteConfirmation(item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          }
        />



      </Routes>



      <AddNutrition
        open={openAddModal}
        
         handleClose={() => {
          setOpenAddModal(false);
          toast.info('Add Nutrition canceled.'); // Show cancel toast here
        }}
        formData={formData}
        handleChange={handleChange}
        handleAddNutrition={handleAddNutrition}
        handleCancel={handleCancel}
      />

      <EditNutrition
        open={editOpen}
        handleClose={() => {
          setEditOpen(false);
          toast.info('Edit canceled.'); // Show cancel toast here
        }}

        formData={selectedNutrition}
        setFormData={setSelectedNutrition}
        handleChange={(e) => {
          const { name, value } = e.target;
          setSelectedNutrition((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }}
        handleEditNutrition={handleEditNutrition}
      />


      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Nutrition data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
    </div>
  );
}

export default Nutrition;
