import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';
import {
  FaSignOutAlt,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaFire,
  FaCalendarAlt,
  FaLeaf
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    if (showLogoutConfirm) {
      localStorage.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    } else {
      setShowLogoutConfirm(true);
    }
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="row g-0">

        {/* ── SIDEBAR ── */}
        <div className="col-md-3 col-lg-2 sidebar">
          <div className="p-4 text-center">
            <img
              src={user.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="profile-pic mb-3"
            />
            <h5 className="mb-0">{user.username}</h5>
            <small className="text-light">{user.email}</small>
          </div>

          <nav className="nav flex-column p-3">
            <Link to="/profile" className="nav-link">
              <FaHeartbeat className="me-2" />
              Health Metrics
            </Link>
            <Link to="/bmi" className="nav-link">
              <FaWeight className="me-2" />
              BMI calculation
            </Link>

            <Link to="/nutrition" className="nav-link">
              <FaLeaf className="me-2" />
              Nutrition &amp; Diet Plan
            </Link>

            <button
              onClick={handleLogout}
              className="nav-link text-start border-0 bg-transparent w-100"
            >
              <FaSignOutAlt className="me-2" />
              {showLogoutConfirm ? 'Confirm Logout?' : 'Logout'}
            </button>
          </nav>

          {showLogoutConfirm && (
            <div className="p-3">
              <div className="alert alert-warning">
                <p className="mb-2">Are you sure you want to logout?</p>
                <div className="d-flex gap-2">
                  <button onClick={handleLogout} className="btn btn-sm btn-danger">
                    Yes, Logout
                  </button>
                  <button onClick={cancelLogout} className="btn btn-sm btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary">Dashboard</h2>
            <div className="text-muted">Welcome back, {user.username}!</div>
          </div>

          {/* Health Metric Cards */}
          <div className="row">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="health-card text-center">
                <FaRulerVertical className="text-primary mb-3" size={40} />
                <h3>{user.height || '--'} cm</h3>
                <p className="text-muted mb-0">Height</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="health-card text-center">
                <FaWeight className="text-success mb-3" size={40} />
                <h3>{user.weight || '--'} kg</h3>
                <p className="text-muted mb-0">Weight</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="health-card text-center">
                <FaFire className="text-danger mb-3" size={40} />
                <h3>{user.caloriesBurnt || '--'}</h3>
                <p className="text-muted mb-0">Calories Burnt</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="health-card text-center">
                <FaCalendarAlt className="text-info mb-3" size={40} />
                <h3>{user.age || '--'}</h3>
                <p className="text-muted mb-0">Age</p>
              </div>
            </div>
          </div>

          {/* Health Summary + Quick Access */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title fw-bold">Health Summary</h4>
                  <p className="text-muted">
                    {user.height && user.weight ? (
                      <>
                        Your current health metrics show a balanced profile.
                        {user.height >= 180 && ' You have a good height.'}
                        {user.weight && user.weight < 70 && ' Your weight is within healthy range.'}
                        {' '}Keep up with regular exercise and maintain a balanced diet.
                      </>
                    ) : (
                      'Please complete your profile to see personalized health insights.'
                    )}
                  </p>

                  <div className="mt-4 d-flex gap-3 flex-wrap">
                    <button
                      onClick={() => navigate('/profile', { state: { editMode: true } })}
                      className="btn btn-gradient"
                    >
                      Update Profile
                    </button>

                    <button
                      onClick={() => navigate('/nutrition')}
                      className="btn btn-gradient"
                    >
                      <FaLeaf className="me-2" />
                      Nutrition &amp; Diet Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;