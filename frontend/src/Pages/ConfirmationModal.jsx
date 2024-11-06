import React from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Spinner } from 'react-bootstrap';
import '../styles/ConfirmationModal.css'; // Optional custom CSS

const ConfirmationModal = ({ show, onHide, onConfirm, title, message, loading }) => {
    const handleConfirm = () => {
        // toast.success('Action confirmed!');
        onConfirm(); // Execute confirm logic
    };

    const handleCancel = () => {
        toast.info('Delete canceled.');
        onHide(); // Close the modal
    };

    return (
        <>
            <Modal show={show} onHide={handleCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger fw-bold">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i> 
                        {title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="fs-5">{message}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirm} 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner 
                                    as="span" 
                                    animation="border" 
                                    size="sm" 
                                    role="status" 
                                    aria-hidden="true" 
                                />
                                Deleting...
                            </>
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast notifications container */}

        </>
    );
};

export default ConfirmationModal;
