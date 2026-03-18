import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      // DEBUG LINES - ADD THESE
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Token:', response.data.token);
      // END DEBUG LINES
      
      if (response.data.token) {
        console.log('Token found, saving to localStorage');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Calling navigate to dashboard');
        toast.success('Login successful!');
        navigate('/dashboard');
        console.log('Navigate called');
      } else {
        console.log('No token in response!');
      }
    } catch (error) {
      // DEBUG LINES - ADD THESE
      console.log('Login error:', error);
      console.log('Error response:', error.response);
      // END DEBUG LINES
      
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="auth-container">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Health & Wellness</h2>
              <p className="text-muted">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
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
                  placeholder="Enter your password"
                />
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
                    <FaSignInAlt className="me-2" />
                  )}
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              <div className="text-center">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
                <p className="mt-3">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Sign Up
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

export default Login;
