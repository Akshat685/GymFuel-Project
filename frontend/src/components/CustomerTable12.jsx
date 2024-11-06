import React, { useState } from 'react';
import CustomerModal from './CustomerModal';

const CustomerTable = ({ customers, handleEdit, handleDelete, handleOpenModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const openModal = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleFormSubmit = (customerData) => {
    if (currentCustomer) {
      handleEdit(customerData);
    } else {
      handleOpenModal(customerData);
    }
    closeModal();
  };

  return (
    <div className="row m-0">
      <div className="col-12">
        <div className="card my-4">
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <h5 className="text-white text-capitalize ps-3 mb-0">Customers Table</h5>
              <button
                className="btn btn-light text-primary"
                onClick={() => openModal(null)}
              >
                Add Customer
              </button>
            </div>
          </div>
          <div className="card-body px-0 pb-2">
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Subscription</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Goal</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Emergency Contact</th>
                    <th>Diet Preference</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((customer, index) => (
                      <tr key={customer.id}>
                        <td>{index + 1}</td>
                        <td>{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.status}</td>
                        <td>{customer.age}</td>
                        <td>{customer.gender}</td>
                        <td>{customer.subscription}</td>
                        <td>{new Date(customer.startDate).toLocaleDateString()}</td>
                        <td>{new Date(customer.endDate).toLocaleDateString()}</td>
                        <td>{customer.goal}</td>
                        <td>{customer.height}</td>
                        <td>{customer.weight}</td>
                        <td>{customer.emergencyContact.name} - {customer.emergencyContact.phone}</td>
                        <td>{customer.dietPreference}</td>
                        <td>
                          <button className="btn btn-link text-secondary" onClick={() => openModal(customer)}>Edit</button>
                          <button className="btn btn-link text-danger" onClick={() => handleDelete(customer.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center">No customers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <CustomerModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        currentCustomer={currentCustomer}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default CustomerTable;
