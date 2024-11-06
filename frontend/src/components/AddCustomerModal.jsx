import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    InputAdornment,
} from '@mui/material';
import { Person, Email, Phone, DateRange } from '@mui/icons-material'; // Removed Info
import { toast } from 'react-toastify';

const AddCustomerModal = ({ show, handleClose, handleSubmit, formData, handleChange, formSubmitting, isEdit }) => {
    const handleAddCustomer = (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Custom validation for phone numbers
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(formData.phone)) {
            toast.error('Phone number must be exactly 10 digits.');
            return;
        }

        if (!phonePattern.test(formData.emergencyContact.phone)) {
            toast.error('Emergency contact phone number must be exactly 10 digits.');
            return;
        }

        handleSubmit(event);
        if (!isEdit) {
            toast.success('Customer added successfully!'); // Toast notification for success
        } else {
            toast.success('Customer updated successfully!'); // Toast notification for success
        }
    };

    const handleCancel = () => {
        handleClose();
        toast.info('Action cancelled'); // Toast notification for cancel
    };


    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle style={{ backgroundColor: '#3f51b5', color: '#fff' }}>
                {isEdit ? 'Edit Customer' : 'Add Customer'}
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                    Please fill in the customer details.
                </Typography>
                <form onSubmit={handleAddCustomer}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", // Email pattern
                                    title: "Please enter a valid email address.",
                                }}
                                error={
                                    formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) // Error check
                                }
                                helperText={
                                    formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
                                        ? "Invalid email address."
                                        : ""
                                }
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    maxLength: 10, // Ensures only 10 digits can be entered
                                    pattern: "[0-9]{10}", // Regex pattern for exactly 10 digits
                                    title: "Phone number must be exactly 10 numeric digits.",
                                }}
                                error={formData.phone && !/^\d{10}$/.test(formData.phone)} // Shows error if phone number is invalid
                                helperText={
                                    formData.phone && !/^\d{10}$/.test(formData.phone)
                                        ? "Please enter a valid 10-digit phone number."
                                        : ""
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Gender"
                                name="gender"
                                select
                                value={formData.gender}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Subscription"
                                name="subscription"
                                value={formData.subscription}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="End Date"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Goal"
                                name="goal"
                                select
                                value={formData.goal}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                <option value="Weight Gain">Weight Gain</option>
                                <option value="Weight Loss">Weight Loss</option>
                                <option value="Maintenance">Maintenance</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Height (cm)"
                                name="height"
                                type="number"
                                value={formData.height}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Diet Preference"
                                name="dietPreference"
                                select
                                value={formData.dietPreference}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Emergency Contact Name"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Emergency Contact Phone"
                                name="emergencyContact.phone"
                                type="tel"
                                value={formData.emergencyContact.phone}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                margin="normal"
                                inputProps={{
                                    maxLength: 10, // Restrict input to 10 digits
                                    pattern: "[0-9]{10}", // Regex pattern for exactly 10 numeric digits
                                    title: "Emergency contact phone number must be exactly 10 digits.",
                                }}
                                error={
                                    formData.emergencyContact.phone &&
                                    !/^[0-9]{10}$/.test(formData.emergencyContact.phone) // Error check
                                }
                                helperText={
                                    formData.emergencyContact.phone &&
                                        !/^[0-9]{10}$/.test(formData.emergencyContact.phone)
                                        ? "Please enter a valid 10-digit phone number."
                                        : ""
                                }
                            />

                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={handleCancel} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" variant="contained" disabled={formSubmitting}>
                            {formSubmitting ? 'Submitting...' : (isEdit ? 'Update Customer' : 'Add Customer')}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCustomerModal;