import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
    Button,
    Card,
    Table,
    Modal,
    Form,
    Container,
    Row,
    Col,
    Alert,
} from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/diet.css";
import {
    fetchDiets,
    createDiet,
    updateDiet,
    deleteDiet,
    setEditingId,
    setActiveCategory,
    setShowModal,
    setErrorMessage,
    setNewDiet,
    updateDietField,
} from "../features/customers/dietSlice";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    AppBar,
    Toolbar,
    Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons';

const Diet = () => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dietToDelete, setDietToDelete] = useState(null);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [showTitle, setShowTitle] = useState(true);
    const [isSectionVisible, setIsSectionVisible] = useState(false);

    const {
        diets,
        editingId,
        newDiet,
        activeCategory,
        showModal,
        errorMessage,
    } = useSelector((state) => state.diets);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchDiets());
                await fetchCategories();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [dispatch]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dietcategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleEdit = (diet) => {
        dispatch(setEditingId(diet._id));
        dispatch(setNewDiet(diet)); // Set the diet to be edited
    };

    const handleSave = async () => {
        // Use newDiet instead of diet directly
        if (!newDiet.mealType || !newDiet.foodItem || !newDiet.servingSize ||
            !newDiet.calories || !newDiet.protein || !newDiet.carbs ||
            !newDiet.fats || !newDiet.fiber || !newDiet.category) {
            toast.error("All fields are required!");
            return;
        }

        try {
            const updatedDiet = {
                ...newDiet,
                calories: Number(newDiet.calories),
                protein: Number(newDiet.protein),
                carbs: Number(newDiet.carbs),
                fats: Number(newDiet.fats),
                fiber: Number(newDiet.fiber),
            };

            const result = await dispatch(updateDiet(updatedDiet)).unwrap();

            if (result) {
                toast.success("Diet updated successfully!");
                dispatch(setEditingId(null));
                dispatch(fetchDiets()); // Refresh the data
                dispatch(setNewDiet({ mealType: '', foodItem: '', servingSize: '', calories: '', protein: '', carbs: '', fats: '', fiber: '', notes: '', category: activeCategory })); // Reset the newDiet state
            }
        } catch (error) {
            console.error('Error updating diet:', error);
            toast.error("Failed to update diet!");
        }
    };

    const handleDelete = (id) => {
        setDietToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteCancel = () => {
        toast.info('Cancelled deleting diet');
        setShowDeleteConfirm(false);
        setDietToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteDiet(dietToDelete));
            toast.success("Diet deleted successfully!");
            setShowDeleteConfirm(false);
            setDietToDelete(null);
        } catch (error) {
            toast.error("Error deleting diet!");
            console.error('Error deleting diet:', error);
        }
    };

    const handleCreate = async () => {
        if (!newDiet.mealType || !newDiet.foodItem || !newDiet.servingSize || !newDiet.calories || !newDiet.protein || !newDiet.carbs || !newDiet.fats || !newDiet.fiber || !newDiet.category) {
            toast.error("All fields are required!");
            return;
        }
        try {
            const categoryId = categories.find(cat => cat.name === activeCategory)._id;
            await dispatch(createDiet({ ...newDiet, category: categoryId }));
            toast.success("Diet created successfully!");
            dispatch(setNewDiet({ mealType: '', foodItem: '', servingSize: '', calories: '', protein: '', carbs: '', fats: '', fiber: '', notes: '', category: activeCategory }));
            dispatch(fetchDiets());
        } catch (error) {
            toast.error("Error creating diet!");
            console.error('Error creating diet:', error);
        }
    };

    const filteredDiets = diets.filter(diet => diet.category === categories.find(cat => cat.name === activeCategory)?._id);

    const handleChange = (e, id = null) => {
        const { name, value } = e.target;
        if (id) {
            // For editing existing diet
            const updatedValue = e.target.type === 'number' ? Number(value) : value;
            dispatch(updateDietField({ id, name, value: updatedValue }));
        } else {
            // For new diet
            const updatedValue = e.target.type === 'number' ? Number(value) : value;
            dispatch(setNewDiet({ ...newDiet, [name]: updatedValue }));
        }
    };

    const handleCategoryClick = (category) => {
        dispatch(setActiveCategory(category));
        setIsTableVisible(true);
        setShowTitle(false);
        setIsSectionVisible(true);
    };

    const handleClickOpen = () => {
        dispatch(setNewDiet({ category: activeCategory }));
        dispatch(setShowModal(true));
    };

    const handleClose = () => {
        dispatch(setShowModal(false));
        dispatch(setErrorMessage(""));
        dispatch(setNewDiet({ mealType: '', foodItem: '', servingSize: '', calories: '', protein: '', carbs: '', fats: '', fiber: '', notes: '', category: activeCategory }));
        toast.info("Meal creation canceled.");
    };

    const handleBack = () => {
        dispatch(setActiveCategory(null));
        setIsTableVisible(false);
        setShowTitle(true);
        setIsSectionVisible(false);
    };

    return (
        <Container className="my-1">
            {!isSectionVisible && (
                <AppBar position="static" style={{ background: 'linear-gradient(90deg, rgba(25, 118, 210, 1) 0%, rgba(0, 150, 136, 1) 100%)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px' }}>
                            Diet Plans
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {showTitle && (
                <h2 className="text-center mb-4">  </h2>
            )}
            <Row className="justify-content-center">
                {categories.map((category) => (
                    <Col xs={12} sm={4} key={category._id} className="mb-4">
                        <Card
                            className="text-center cursor-pointer category-card"
                            onClick={() => handleCategoryClick(category.name)}
                            style={{ display: isTableVisible ? 'none' : 'block' }}
                        >
                            <Card.Body>
                                <Card.Title>{category.name}</Card.Title>
                                <Card.Text>{category.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {isSectionVisible && activeCategory && (
                <div className="container">
                    <h4 className="text-center heading1">{activeCategory} Diet Plans</h4>
                    <div className="text-center mb-3">
                        <Button onClick={handleClickOpen} className=" addmealbtn me-3" >
                            Add Meal
                        </Button>
                        <Button onClick={handleBack} className=" addmealbtn" >
                            Back
                        </Button>
                    </div>
                    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table striped bordered hover responsive className="mt-4">
                            <thead className="table-light">
                                <tr>
                                    <th>No.</th>
                                    <th>Meal Type</ th>
                                    <th>Food Item</th>
                                    <th>Serving Size</th>
                                    <th>Calories</th>
                                    <th>Protein (g)</th>
                                    <th>Carbs (g)</th>
                                    <th>Fats (g)</th>
                                    <th>Fiber (g)</th>
                                    <th>Notes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {filteredDiets.map((diet, index) => (
                                    <tr key={diet._id} className="align-middle">
                                        <td>{index + 1}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                name="mealType"
                                                value={newDiet.mealType}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.mealType
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                name="foodItem"
                                                value={newDiet.foodItem}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.foodItem
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                name="servingSize"
                                                value={newDiet.servingSize}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.servingSize
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                type="number"
                                                name="calories"
                                                value={newDiet.calories}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.calories
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                type="number"
                                                name="protein"
                                                value={newDiet.protein}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.protein
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                type="number"
                                                name="carbs"
                                                value={newDiet.carbs}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.carbs
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                type="number"
                                                name="fats"
                                                value={newDiet.fats}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.fats
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                type="number"
                                                name="fiber"
                                                value={newDiet.fiber}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.fiber
                                        )}</td>
                                        <td>{editingId === diet._id ? (
                                            <Form.Control
                                                name="notes"
                                                value={newDiet.notes}
                                                onChange={handleChange}
                                                size="sm"
                                                className="form-control"
                                            />
                                        ) : (
                                            diet.notes
                                        )}</td>
                                        <td>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Edit this meal</Tooltip>}
                                            >
                                                <span>
                                                    {editingId === diet._id ? (
                                                        <Button variant="success" size="sm" onClick={handleSave}>
                                                            <FontAwesomeIcon icon={faSave} /> Save
                                                        </Button>
                                                    ) : (
                                                        <Button variant="primary" size="sm" onClick={() => handleEdit(diet)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                    )}
                                                </span>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Delete this meal</Tooltip>}
                                            >
                                                <span>
                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(diet._id)} className="ms-2">
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                </span>
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}

            <Modal show={showModal} onHide={handleClose} centered className="modal-lg" style={{ left: "25%" }}>
                <Modal.Header closeButton className="bg text-white d-flex justify-content-center col-12">
                    <Modal.Title className="text-center col-12">
                        Add New Meal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Form>
                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formCategory">
                                    <Form.Label><i className="bi bi-grid-fill me-1"></i> Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        value={newDiet.category}
                                        onChange={handleChange}
                                        placeholder="Enter meal category"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formMealType">
                                    <Form.Label><i className="bi bi-list-check me-1"></i> Meal Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mealType"
                                        value={newDiet.mealType}
                                        onChange={handleChange}
                                        placeholder="Enter meal type"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formFoodItem">
                                    <Form.Label><i className="bi bi-basket3-fill me-1"></i> Food Item</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="foodItem"
                                        value={newDiet.foodItem}
                                        onChange={handleChange}
                                        placeholder="Enter food item"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formServingSize">
                                    <Form.Label><i className="bi bi-cup-fill me-1"></i> Serving Size</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="servingSize"
                                        value={newDiet.servingSize}
                                        onChange={handleChange}
                                        placeholder="Enter serving size"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col md={4}>
                                <Form.Group controlId="formCalories">
                                    <Form.Label><i className="bi bi-fire me-1"></i> Calories</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="calories"
                                        value={newDiet.calories}
                                        onChange={handleChange}
                                        placeholder="Enter calories"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formProtein">
                                    <Form.Label><i className="bi bi-egg-fried me-1"></i> Protein (g)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="protein"
                                        value={newDiet.protein}
                                        onChange={handleChange}
                                        placeholder="Enter protein"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formCarbs">
                                    <Form.Label><i className="bi bi-pie-chart-fill me-1"></i> Carbs (g)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="carbs"
                                        value={newDiet.carbs}
                                        onChange={handleChange}
                                        placeholder="Enter carbs"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col md={4}>
                                <Form.Group controlId="formFats">
                                    <Form.Label><i className="bi bi-droplet-fill me-1"></i> Fats (g)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="fats"
                                        value={newDiet.fats}
                                        onChange={handleChange}
                                        placeholder="Enter fats"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formFiber">
                                    <Form.Label><i className="bi bi-slash-circle-fill me-1"></i> Fiber (g)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="fiber"
                                        value={newDiet.fiber}
                                        onChange={handleChange}
                                        placeholder="Enter fiber"
                                        className="shadow-sm"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formNotes">
                                    <Form.Label><i className="bi bi-chat-left-dots-fill me-1"></i> Notes</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="notes"
                                        value={newDiet.notes}
                                        onChange={handleChange}
                                        placeholder="Enter notes"
                                        className="shadow-sm"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="bg-light d-flex justify-content-between">
                    <div>
                        <Button variant="outline-secondary" onClick={handleClose} className="me-auto">
                            <i className="bi bi-x-circle me-1"></i> Close
                        </Button>

                    </div>
                    <div>
                        <Button variant="primary" className="btn-gradient-primary" onClick={handleCreate}>
                            <i className="bi bi-save-fill me-1"></i> Save Meal
                        </Button>
                                </div>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this diet?
                    </DialogContentText >
                </DialogContent>
                <DialogActions>
                    <Button className="btntoast" onClick={handleDeleteCancel}>Cancel</Button>
                    <Button className="btntoast" onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default Diet;