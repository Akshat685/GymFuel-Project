import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice"; // Adjust the import based on your file structure
import {  toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth); // Accessing error and loading from Redux state

  // Handle login function
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Dispatch the login thunk with email and password
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      localStorage.setItem("token", resultAction.payload.token); // Store token
      localStorage.setItem("email", resultAction.payload.email); // Store email
      toast.success("Login successful! Welcome back!"); // Show success toast

      navigate("/dashboard"); // Redirect to profile after login
    } else {
      console.error(resultAction.payload); // Log any errors
    }
  };

  return (
    <div className="bg-gray-200">
      <div className="container position-sticky z-index-sticky top-0">
        <div className="row">
          <div className="col-12">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg blur border-radius-xl top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
              <div className="container-fluid ps-2 pe-0">
                <a className="navbar-brand font-weight-bolder ms-lg-0 ms-9">
                  GymFuel
                </a>
                <button
                  className="navbar-toggler shadow-none ms-2"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navigation"
                  aria-controls="navigation"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon mt-2">
                    <span className="navbar-toggler-bar bar1"></span>
                    <span className="navbar-toggler-bar bar2"></span>
                    <span className="navbar-toggler-bar bar3"></span>
                  </span>
                </button>

                <div className="collapse navbar-collapse" id="navigation">
                  <ul className="navbar-nav ms-auto"> {/* Pushed to the right */}
                    <li className="nav-item">
                      <Link className=" me-3" to="/signup">
                        <i className="fas fa-user-circle opacity-6 text-dark me-1"></i>
                        Sign Up
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className=" me-2" to="/">
                        <i className="fas fa-key opacity-6 text-dark me-1"></i>
                        Sign In
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            {/* End Navbar */}
          </div>
        </div>
      </div>
      <main className="main-content mt-0">
        <div
          className="page-header align-items-start min-vh-100"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')" }}
        >
          <span className="mask bg-gradient-dark opacity-6"></span>
          <div className="container my-auto">
            <div className="row">
              <div className="col-lg-4 col-md-8 col-12 mx-auto">
                <div className="card z-index-0 fadeIn3 fadeInBottom">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div
                      className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1"
                      style={{
                        background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)', // Blue gradient color
                      }}
                    >
                      <h2 className="text-white font-weight-bolder text-center mt-2 mb-0">
                        Login
                      </h2>
                    </div>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleLogin} role="form" className="text-start">
                      {error && <p className="text-danger">{error}</p>}
                      {loading && <p className="text-primary">Loading...</p>} {/* Display loading message */}
                      <div className="input-group input-group-outline my-3">
                        <label className="form-label"></label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Enter your Email"
                        />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label"></label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter your Password"
                        />
                      </div>

                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn w-100 my-4 mb-2"
                          style={{
                            background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)', // Blue gradient color
                            color: 'white',
                          }}
                        >
                          Login
                        </button>
                      </div>
                      <p className="mt-4 text-sm text-center">
                        Don't have an account?
                        <Link
                          to="/signup"
                          className="font-weight-bold ms-2"
                          style={{
                            background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)', // Blue gradient color
                            WebkitBackgroundClip: 'text', // Ensure text is clipped to the background
                            color: 'transparent', // Make the text color transparent
                          }}
                        >
                          Sign up
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer position-absolute bottom-2 py-2 w-100">
            <div className="container">
              <div className="row align-items-center justify-content-lg-between">
                {/* Footer content can go here */}
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Login;