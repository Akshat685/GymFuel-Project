import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../components/Addcategorymodal.jsx'; // Ensure this is your modal component
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

const DietCategory = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', id: null });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dietcategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleAddCategory = async () => {
        try {
            await axios.post('http://localhost:5000/api/dietcategory', {
                name: form.name,
                description: form.description,
            });
            fetchCategories();
            resetForm();
            setIsModalOpen(false);
            // toast.success('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        resetForm(); // Reset form when cancelling
    };

    const handleEditCategory = async () => {
        try {
            await axios.put(`http://localhost:5000/api/dietcategory/${form.id}`, {
                name: form.name,
                description: form.description,
            });
            fetchCategories();
            resetForm();
            setIsModalOpen(false);
            // toast.success('Category updated successfully!');
        } catch (error) {
            console.error('Error editing category:', error);
        }
    };

    const startEdit = (category) => {
        setForm({ name: category.name, description: category.description, id: category._id });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/dietcategory/${id}`);
            fetchCategories();
            toast.success('Category deleted successfully.');
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const openDeleteDialog = (id) => {
        setCategoryToDelete(id);
        setOpenDialog(true);
    };

    const handleDeleteConfirm = () => {
        handleDeleteCategory(categoryToDelete);
        setOpenDialog(false);
    };

    const handleDeleteCancel = () => {
        toast.info('Cancelled deleting category');
        setOpenDialog(false);
    };

    const resetForm = () => {
        setForm({ name: '', description: '', id: null });
        setIsEditMode(false);
    };

    return (
        <Container>
            <AppBar position="static" style={{ background: 'linear-gradient(90deg, rgba(25, 118, 210, 1) 0%, rgba(0, 150, 136, 1) 100%)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Toolbar>
                    <Typography variant="h5" color="inherit" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px' }}>
                        Diet Categories
                    </Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        style={{
                            backgroundColor: '#4CAF50',
                        }}
                        onClick={() => { setIsModalOpen(true); resetForm(); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    >
                        Add Category
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category._id}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h5" fontWeight="bold">
                                    {category.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {category.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Tooltip title="Edit Category" arrow>
                                    <IconButton onClick={() => startEdit(category)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Category" arrow>
                                    <IconButton onClick={() => openDeleteDialog(category._id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={isEditMode ? handleEditCategory : handleAddCategory}
                form={form}
                handleInputChange={handleInputChange}
                onCancel={handleCancel}
                modalType={isEditMode ? 'edit' : 'add'} // Pass the modal type
            />

            <Dialog
                open={openDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this category?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default DietCategory;