import React, { useState } from 'react';
import { usePageTitle } from '../Pages/PageTitleContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { pageTitle } = usePageTitle(); // Access dynamic page title from context
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Manage dialog state

  const handleSignOut = () => {
    dispatch(logout()); // Dispatch logout action
    toast.success('Successfully signed out!');
    navigate('/'); // Redirect to the homepage
  };

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl">
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li className="breadcrumb-item text-sm">
                <a className="opacity-5 text-dark">Pages</a>
              </li>
              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">
                {pageTitle} {/* Render dynamic page title */}
              </li>
            </ol>
            <h6 className="font-weight-bolder mb-0">{pageTitle}</h6> {/* Dynamic title */}
          </nav>

          {/* Navbar Right Section */}
          <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <ul className="navbar-nav justify-content-end ms-auto align-items-center">
              <li className="nav-item d-flex align-items-center">
                <button
                  onClick={openDialog} // Open sign-out dialog
                  className="btn btn-link nav-link text-body font-weight-bold px-0"
                  aria-label="Sign Out"
                >
                  <i className="fa fa-sign-out me-sm-1"></i>
                  <span className="d-sm-inline d-none">Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sign Out Confirmation Dialog */}
      <Dialog
  open={open}
  onClose={() => {
    closeDialog();
    toast.info('Sign out canceled.'); // Display toast on dialog close
  }}
  PaperProps={{
    style: { borderRadius: 15, padding: '10px' }, // Optional styling for dialog
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
    Confirm Sign Out
  </DialogTitle>
  <DialogActions
    sx={{ justifyContent: 'center', paddingBottom: '16px' }} // Center-align buttons
  >
    <Button
      onClick={() => {
        closeDialog();
        toast.info('Sign out canceled.'); // Toast on cancel
      }}
      variant="outlined"
      color="secondary"
      sx={{ marginRight: '8px' }} // Button spacing
    >
      Cancel
    </Button>
    <Button
      onClick={handleSignOut}
      variant="contained"
      color="primary"
    >
      Sign Out
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

export default Navbar;
