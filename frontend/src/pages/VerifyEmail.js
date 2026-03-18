import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || '';

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyEmail(email, otpString);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await authAPI.forgotPassword(email);
      setResendTimer(60);
      setCanResend(false);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="auth-container">
            <div className="text-center mb-4">
              <div className="mb-3">
                <FaEnvelope className="text-primary" size={60} />
              </div>
              <h2 className="fw-bold">Verify Your Email</h2>
              <p className="text-muted">
                We've sent a 6-digit OTP to {email}
              </p>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-center gap-2 mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input form-control text-center"
                  />
                ))}
              </div>
            </div>

            <div className="d-grid mb-3">
              <button
                onClick={handleVerify}
                className="btn btn-gradient"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <FaCheckCircle className="me-2" />
                )}
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>

            <div className="text-center">
              <p className="mb-2">
                Didn't receive OTP?{' '}
                <button
                  onClick={handleResendOtp}
                  className={`btn btn-link p-0 text-decoration-none ${
                    canResend ? 'text-primary' : 'text-muted'
                  }`}
                  disabled={!canResend}
                >
                  Resend OTP {!canResend && `(${resendTimer}s)`}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
