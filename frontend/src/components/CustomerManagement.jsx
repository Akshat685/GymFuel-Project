import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../features/customers/customerSlice';
import { toast } from 'react-toastify';
import { Button, Card, Table, Spinner, OverlayTrigger, Tooltip, Container, Row, Col } from 'react-bootstrap';
import { BsPersonAdd, BsPencilSquare, BsTrash } from 'react-icons/bs';
import AddCustomerModal from './AddCustomerModal';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AppBar, Toolbar, Typography } from '@mui/material'; // Import AppBar and Toolbar


const CustomerManagement = () => {
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.customers);
    const loading = useSelector((state) => state.customers.loading);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', age: '', gender: '', subscription: '',
        startDate: '', endDate: '', goal: '', weight: '', height: '',
        dietPreference: '', emergencyContact: { name: '', phone: '' },
    });

    const [showModal, setShowModal] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        dispatch(fetchCustomers()).catch(() => toast.error('Failed to fetch customers'));
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('emergencyContact.')) {
            const fieldName = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, [fieldName]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        try {
            if (formData._id) {
                await dispatch(updateCustomer({ id: formData._id, customer: formData })).unwrap();
            } else {
                await dispatch(createCustomer(formData)).unwrap();
            }
            resetForm();
        } catch (error) {
            toast.error('Failed to save customer');
        } finally {
            setFormSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', email: '', phone: '', age: '', gender: '', subscription: '',
            startDate: '', endDate: '', goal: '', weight: '', height: '',
            dietPreference: '', emergencyContact: { name: '', phone: '' },
        });
        setShowModal(false);
    };

    const handleEdit = (customer) => {
        setFormData({
            ...customer,
            startDate: new Date(customer.startDate).toISOString().split('T')[0], // Format to YYYY-MM-DD
            endDate: new Date(customer.endDate).toISOString().split('T')[0], // Format to YYYY-MM-DD
        });
        setShowModal(true);
    };

    const openDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            await dispatch(deleteCustomer(deleteId)).unwrap();
            toast.success('Customer deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete customer');
        } finally {
            setLoadingDelete(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        toast.info('Deletion cancelled.'); // Show cancel toast here
    };

    return (
        <Container className="mt-1">

            <AppBar position="static" sx={{ background: 'linear-gradient(90deg, rgba(25, 118, 210, 1) 0%, rgba(0, 150, 136, 1) 100%)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                <Toolbar>
                    <Typography variant="h5" color="inherit" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px' }}>
                        <i className="bi bi-people-fill me-2" /> Customer Management
                        <span className="underline"></span>
                    </Typography>
                    <Button className='addcustmerbtn' variant="success" onClick={() => setShowModal(true)}>
                        <BsPersonAdd className="me-2 addcustmerbtn" /> Add Customer
                    </Button>
                </Toolbar>
            </AppBar>
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-lg border-0 mt-4">
                        <Card.Body >

                            {loading ? (
                                <div className="text-center ">
                                    <Spinner animation="border" variant="primary" />
                                    <p>Loading customers...</p>
                                </div>
                            ) : (
                                <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    <Table hover bordered striped className="align-middle">
                                        <thead className="table-dark sticky-top">
                                            <tr>
                                                <th>No.</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Age</th>
                                                <th>Gender</th>
                                                <th>Subscription</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Goal</th>
                                                <th>Weight(Kg)</th>
                                                <th>Height(cm)</th>
                                                <th>Diet Preference</th>
                                                <th>Emergency Contact</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map((customer, index) => (
                                                <tr key={customer._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{customer.name}</td>
                                                    <td>{customer.email}</td>
                                                    <td>{customer.phone}</td>
                                                    <td>{customer.age}</td>
                                                    <td>{customer.gender}</td>
                                                    <td>{customer.subscription}</td>
                                                    <td>{new Date(customer.startDate).toLocaleDateString()}</td>
                                                    <td>{new Date(customer.endDate).toLocaleDateString()}</td>
                                                    <td>{customer.goal}</td>
                                                    <td>{customer.weight}</td>
                                                    <td>{customer.height}</td>
                                                    <td>{customer.dietPreference}</td>
                                                    <td>{customer.emergencyContact?.name} ({customer.emergencyContact?.phone})</td>
                                                    <td>
                                                        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                                            <Button variant="warning" size="sm" onClick={() => handleEdit(customer)}>
                                                                <BsPencilSquare />
                                                            </Button>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="ms-2"
                                                                onClick={() => openDeleteDialog(customer._id)}
                                                            >
                                                                <BsTrash />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <AddCustomerModal
                show={showModal}
                handleClose={resetForm}
                handleSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
                formSubmitting={formSubmitting}
                isEdit={!!formData._id}
            />

            {/* MUI Dialog for Deletion Confirmation */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this customer?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='cancelbtn' onClick={handleCancelDelete}>Cancel</Button>
                    <Button className='deletebtn' onClick={handleDelete} disabled={loadingDelete}>
                        {loadingDelete ? <Spinner as="span" animation="border" size="sm" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default CustomerManagement;