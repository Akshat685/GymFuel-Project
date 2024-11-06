// Modal.js
import React from 'react';
import { toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, onCancel, onSubmit, form, handleInputChange, modalType }) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    const message = modalType === 'edit' ? 'Cancelled editing category' : 'Cancelled adding category';
    toast.info(message); // Show different toast message based on modal type
    onCancel(); 
  };

  const handleSubmit = () => {
    if (modalType === 'edit') {
      toast.success('Category updated successfully'); // Show success message for editing
    } else {
      toast.success('Category added successfully'); // Show success message for adding
    }
    onSubmit(); // Call the onSubmit function passed from the parent
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>{modalType === 'edit' ? 'Edit Category' : 'Add Category'}</h2> {/* Update title based on modalType */}
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleInputChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          style={modalStyles.input}
        />
        <div>
          <button onClick={handleSubmit} style={modalStyles.button}>
            {modalType === 'edit' ? 'Update Category' : 'Add Category'} {/* Update button text based on modalType */}
          </button>
          <button onClick={handleCancel} style={{ ...modalStyles.button, marginLeft: '10px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    minWidth: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Modal;