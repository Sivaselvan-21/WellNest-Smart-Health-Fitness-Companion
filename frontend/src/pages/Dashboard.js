import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  userAPI, workoutAPI, mealAPI,
  waterAPI, sleepAPI
} from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';
import DarkModeToggle from '../components/DarkModeToggle';
import HealthTips from '../components/HealthTips/HealthTips';
import WorkoutChart from '../components/analytics/WorkoutChart';
import NutritionChart from '../components/analytics/NutritionChart';
import WaterSleepChart from '../components/analytics/WaterSleepChart';
import GoalProgress from '../components/analytics/GoalProgress';
import Insights from '../components/analytics/Insights';
import {
  FaSignOutAlt, FaHeartbeat, FaWeight,
  FaRulerVertical, FaFire, FaCalendarAlt,
  FaLeaf, FaCalculator, FaChartLine,
  FaTachometerAlt, FaCamera
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser]               = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [mealLogs, setMealLogs]       = useState([]);
  const [waterLogs, setWaterLogs]     = useState([]);
  const [sleepLogs, setSleepLogs]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profilePic, setProfilePic]   = useState(null);
  const fileInputRef                  = useRef(null);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const [profileRes, workoutRes, mealRes, waterRes, sleepRes] = await Promise.allSettled([
        userAPI.getProfile(),
        workoutAPI.getLogs(),
        mealAPI.getLogs(),
        waterAPI.getLogs(),
        sleepAPI.getLogs(),
      ]);
      if (profileRes.status === 'fulfilled') {
        setUser(profileRes.value.data);
        setProfilePic(profileRes.value.data.profilePicture || null);
      }
      else { toast.error('Failed to load profile'); navigate('/login'); return; }
      if (workoutRes.status === 'fulfilled') setWorkoutLogs(workoutRes.value.data || []);
      if (mealRes.status === 'fulfilled')    setMealLogs(mealRes.value.data || []);
      if (waterRes.status === 'fulfilled')   setWaterLogs(waterRes.value.data || []);
      if (sleepRes.status === 'fulfilled')   setSleepLogs(sleepRes.value.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      toast.success('Profile picture updated!');
    };
    reader.readAsDataURL(file);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: <FaTachometerAlt /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartLine /> },
    { id: 'goals',     label: 'Goals',     icon: <FaHeartbeat /> },
  ];

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>

      {/* TOP NAVBAR */}
      <nav
        className="navbar px-4 py-2 d-flex align-items-center justify-content-between"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* LEFT — Profile */}
        <div className="d-flex align-items-center gap-3">

          {/* Profile picture with camera overlay */}
          <div
            style={{ position: 'relative', width: 42, height: 42, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => fileInputRef.current.click()}
            title="Click to update profile picture"
          >
            <img
              src={profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #4f8ef7',
                display: 'block',
              }}
            />
            {/* Camera icon overlay on hover */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#4f8ef7',
                borderRadius: '50%',
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaCamera size={8} color="#fff" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
          </div>

          {/* Username and full email */}
          <div style={{ lineHeight: 1.3 }}>
            <div className="text-white fw-semibold" style={{ fontSize: '0.9rem' }}>
              {user.username}
            </div>
            <div
              className="text-light"
              title={user.email}
              style={{
                fontSize: '0.75rem',
                opacity: 0.85,
                wordBreak: 'break-all',
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* CENTER — Nav Links */}
        <div className="d-flex align-items-center gap-2">
          <Link
            to="/profile"
            className="nav-link d-flex align-items-center gap-1 px-3 py-1"
            style={{
              borderRadius: 8,
              fontSize: '0.85rem',
              background: 'rgba(79,142,247,0.15)',
              border: '1px solid rgba(79,142,247,0.4)',
              color: '#4f8ef7',
              boxShadow: '0 4px 20px rgba(79,142,247,0.15)',
            }}
          >
            <FaHeartbeat /> <span className="d-none d-md-inline">Health Metrics</span>
          </Link>
          <Link
            to="/nutrition"
            className="nav-link d-flex align-items-center gap-1 px-3 py-1"
            style={{
              borderRadius: 8,
              fontSize: '0.85rem',
              background: 'rgba(79,142,247,0.15)',
              border: '1px solid rgba(79,142,247,0.4)',
              color: '#4f8ef7',
              boxShadow: '0 4px 20px rgba(79,142,247,0.15)',
            }}
          >
            <FaLeaf /> <span className="d-none d-md-inline">Nutrition</span>
          </Link>
          <Link
            to="/bmi"
            className="nav-link d-flex align-items-center gap-1 px-3 py-1"
            style={{
              borderRadius: 8,
              fontSize: '0.85rem',
              background: 'rgba(79,142,247,0.15)',
              border: '1px solid rgba(79,142,247,0.4)',
              color: '#4f8ef7',
              boxShadow: '0 4px 20px rgba(79,142,247,0.15)',
            }}
          >
            <FaCalculator /> <span className="d-none d-md-inline">BMI</span>
          </Link>
        </div>

        {/* RIGHT — Dark mode + Logout */}
        <div className="d-flex align-items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={handleLogout}
            className="btn btn-sm d-flex align-items-center gap-1"
            style={{ background: 'rgba(255,107,107,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8 }}
          >
            <FaSignOutAlt />
            <span className="d-none d-md-inline">
              {showLogoutConfirm ? 'Confirm?' : 'Logout'}
            </span>
          </button>
          {showLogoutConfirm && (
            <button onClick={cancelLogout} className="btn btn-sm btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary mb-0">Dashboard</h2>
            <small className="text-muted">Welcome back, {user.username}!</small>
          </div>
          <div className="text-muted small">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Tab Navigation */}
        <ul className="nav analytics-tabs mb-4">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link analytics-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="me-2">{tab.icon}</span>{tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <HealthTips />
            <div className="row mb-4">
              {[
                { icon: <FaRulerVertical size={32} color="#4f8ef7" />, value: user.height ? `${user.height} cm` : '--', label: 'Height' },
                { icon: <FaWeight size={32} color="#43d9a2" />,        value: user.weight ? `${user.weight} kg` : '--', label: 'Weight' },
                { icon: <FaFire size={32} color="#ff6b6b" />,          value: user.caloriesBurnt || '--', label: 'Calories Burnt' },
                { icon: <FaCalendarAlt size={32} color="#ffd166" />,   value: user.age || '--', label: 'Age' },
              ].map((card, i) => (
                <div className="col-6 col-lg-3 mb-3" key={i}>
                  <div
                    className="health-card text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(79,142,247,0.05))',
                      border: '1px solid rgba(79,142,247,0.4)',
                      borderRadius: 16,
                      boxShadow: '0 4px 20px rgba(79,142,247,0.15)',
                    }}
                  >
                    <div className="mb-2">{card.icon}</div>
                    <h3 className="mb-0 fw-bold">{card.value}</h3>
                    <p className="text-muted mb-0 small">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <Insights
              workoutLogs={workoutLogs}
              mealLogs={mealLogs}
              waterLogs={waterLogs}
              sleepLogs={sleepLogs}
              user={user}
            />

            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Quick Actions</h5>
                <div className="d-flex gap-3 flex-wrap">
                  <button onClick={() => navigate('/profile', { state: { editMode: true } })} className="btn btn-gradient">
                    Update Profile
                  </button>
                  <button onClick={() => navigate('/nutrition')} className="btn btn-gradient">
                    <FaLeaf className="me-2" />Nutrition &amp; Diet Plan
                  </button>
                  <button onClick={() => navigate('/bmi')} className="btn btn-gradient">
                    <FaCalculator className="me-2" />BMI Calculator
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="row">
            <div className="col-12 col-xl-6 mb-4">
              <WorkoutChart workoutLogs={workoutLogs} />
            </div>
            <div className="col-12 col-xl-6 mb-4">
              <NutritionChart mealLogs={mealLogs} user={user} />
            </div>
            <div className="col-12 mb-4">
              <WaterSleepChart waterLogs={waterLogs} sleepLogs={sleepLogs} />
            </div>
          </div>
        )}

        {/* GOALS TAB */}
        {activeTab === 'goals' && (
          <GoalProgress
            user={user}
            workoutLogs={workoutLogs}
            mealLogs={mealLogs}
            waterLogs={waterLogs}
            sleepLogs={sleepLogs}
          />
        )}

      </div>
    </div>
  );
};

export default Dashboard;