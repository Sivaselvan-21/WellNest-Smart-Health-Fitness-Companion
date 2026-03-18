import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { FaEnvelope, FaKey, FaCheckCircle } from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(formData.email);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="auth-container">
            <div className="text-center mb-4">
              <FaKey className="text-primary mb-3" size={50} />
              <h2 className="fw-bold">Reset Password</h2>
              <p className="text-muted">
                {step === 1 
                  ? 'Enter your email to receive OTP' 
                  : 'Enter OTP and new password'}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <div className="mb-4">
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

                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter new password"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm new password"
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
                      <FaCheckCircle className="me-2" />
                    )}
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}

            <div className="text-center">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="text-decoration-none fw-bold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
