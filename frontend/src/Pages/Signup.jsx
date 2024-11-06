import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gymFuelCover from "../images/GymFuel_background.png"; // Adjust the path if necessary
import {  toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState({});
  const navigate = useNavigate();

  const validateInputs = () => {
    let errors = {};
    if (username.length < 3) errors.username = "Username must be at least 3 characters.";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Please enter a valid email address.";
    if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateInputs()) return; // Stop form submission if validation fails

    try {
      const response = await fetch("https://gymfuel-project-2.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful!"); // Show success toast
        navigate("/"); // Redirect to sign-in or any other route after successful signup
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="container position-sticky z-index-sticky top-0">
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg blur border-radius-lg top-0 z-index-3 shadow position-absolute mt-4 py-2 start-0 end-0 mx-4">
              <div className="container-fluid ps-2 pe-0">
                <Link className="navbar-brand font-weight-bolder ms-lg-0 ms-3" to="/">
                  GymFuel
                </Link>
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
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link className=" me-2" to="/">
                        <i className="fas fa-key opacity-6 text-dark me-1"></i>
                        Sign In
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className=" me-2" to="/signup">
                        <i className="fas fa-user-circle opacity-6 text-dark me-1"></i>
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <main className="main-content mt-0">
        <section>
          <div className="page-header min-vh-100">
            <div className="container">
              <div className="row">
                <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                  <div
                    className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
                    style={{
                      backgroundImage: `url(${gymFuelCover})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </div>
                <div className="col-xl-4 col-lg-5 col-md-7 mt-6 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                  <div className="card card-plain rounded-3 shadow-lg p-4" style={{ border: 'none', maxWidth: '400px', margin: 'auto' }}>
                    <div className="card-header text-center mb-4">
                      <h4
                        className="font-weight-bolder"
                        style={{
                          background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontSize: '2rem',
                          letterSpacing: '1px',
                        }}
                      >
                        Sign Up
                      </h4>
                      <p className="mb-0 text-muted">Enter your email and password to register</p>
                    </div>

                    <div className="card-body">
                      <form onSubmit={handleSignUp}>
                        {/* Username Field */}
                        <div className="input-group input-group-outline mb-4">
                          <input
                            type="text"
                            className={`form-control p-3 rounded-2 shadow-sm ${validationError.username ? 'border-danger' : ''}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter Your Username"
                          />
                        </div>
                        {validationError.username && <p className="text-danger small mt-1">{validationError.username}</p>}

                        {/* Email Field */}
                        <div className="input-group input-group-outline mb-4">
                          <input
                            type="email"
                            className={`form-control p-3 rounded-2 shadow-sm ${validationError.email ? 'border-danger' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter Your Email"
                          />
                        </div>
                        {validationError.email && <p className="text-danger small mt-1">{validationError.email}</p>}

                        {/* Password Field */}
                        <div className="input-group input-group-outline mb-4">
                          <input
                            type="password"
                            className={`form-control p-3 rounded-2 shadow-sm ${validationError.password ? 'border-danger' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter Your Password"
                          />
                        </div>
                        {validationError.password && <p className="text-danger small">{validationError.password}</p>}

                        {/* Display any generic error */}
                        {error && <p className="text-danger text-center small mb-4">{error}</p>}

                        {/* Submit Button */}
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-lg w-100 mt-4 mb-0"
                            style={{
                              background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
                              color: 'white',
                              padding: '12px 0',
                              fontSize: '1rem',
                              fontWeight: '600',
                              borderRadius: '8px',
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                              transition: 'transform 0.2s ease',
                            }}
                            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                          >
                            Sign Up
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer text-center pt-4">
                      <p className="text-sm mx-auto mb-2 text-muted">
                        Already have an account?
                        <Link
                          to="/"
                          className="font-weight-bold"
                          style={{
                            background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textDecoration: 'none',
                            marginLeft: '5px',
                          }}
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUp;
