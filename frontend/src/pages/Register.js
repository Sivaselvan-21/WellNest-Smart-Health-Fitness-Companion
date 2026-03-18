import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      toast.success('Registration successful! Please check your email for OTP.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="auth-container">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Create Account</h2>
              <p className="text-muted">Join our health & wellness community</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <FaUser className="me-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <FaPhone className="me-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaEnvelope className="me-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <FaLock className="me-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    <FaLock className="me-2" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="d-grid mb-3">
                <button 
                  type="submit" 
                  className="btn btn-gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <FaUserPlus className="me-2" />
                  )}
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>

              <div className="text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
