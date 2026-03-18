import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NutritionDietPlan from './pages/NutritionDietPlan/NutritionDietPlan';
import BMIApp from './pages/BMIapp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/nutrition" element={isAuthenticated ? <NutritionDietPlan /> : <Navigate to="/login" />} />
           <Route path="/bmi" element={isAuthenticated ? <BMIApp /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;