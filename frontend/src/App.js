import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import SignUp from "./Pages/Signup";
import { PageTitleProvider } from "./Pages/PageTitleContext"; 
import Nutrition from "./Pages/Nutrition";
import Diet from "./Pages/Diet";
import CustomerManagement from "./components/CustomerManagement";
import DietCategory from "./Pages/DietCategory";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import { ToastContainer } from "react-toastify";

import "./styles/material-dashboard.css.map";
import "./styles/material-dashboard.css";
import "./styles/material-dashboard.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/nucleo-icons.css";
import "./styles/nucleo-svg.css";

// Layout for unauthenticated pages (e.g., Login, SignUp)
const UnauthenticatedLayout = () => (
  <div className="unauthenticated-layout">
    <Outlet /> {/* Renders Login or Signup based on the route */}
  </div>
);

// Layout for authenticated pages (Dashboard, Nutrition, etc.)
const AuthenticatedLayout = () => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <Outlet /> {/* Renders the protected pages */}
    </div>
  </div>
);

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const App = () => (
  <PageTitleProvider> 
    <Router>
      <Routes>
        {/* Unauthenticated routes */}
        <Route element={<UnauthenticatedLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Authenticated routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet"
            element={
              <ProtectedRoute>
                <Diet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dietcategory"
            element={
              <ProtectedRoute>
                <DietCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  </PageTitleProvider>
);

export default App;
