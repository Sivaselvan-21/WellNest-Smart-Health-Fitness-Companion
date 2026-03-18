import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';
import {
  FaUserEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaRulerVertical,
  FaWeight,
  FaFire,
  FaBirthdayCake
} from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    caloriesBurnt: '',
    age: '',
    profilePicture: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // ← GET STATE FROM DASHBOARD

  useEffect(() => {
    fetchProfile();

    // ← IF editMode: true IS PASSED FROM DASHBOARD, DIRECTLY OPEN EDIT MODE
    if (location.state?.editMode) {
      setEditMode(true);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data;
      setUser(userData);
      setProfile({
        height: userData.height || '',
        weight: userData.weight || '',
        caloriesBurnt: userData.caloriesBurnt || '',
        age: userData.age || '',
        profilePicture: userData.profilePicture || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userAPI.updateProfile(profile);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        <div className="col-md-3 col-lg-2 sidebar">
          <div className="p-4 text-center">
            <div className="position-relative d-inline-block">
              <img
                src={profile.profilePicture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="profile-pic mb-3"
              />
              {editMode && (
                <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer">
                  <FaCamera />
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <h5 className="mb-0">{user?.username}</h5>
            <small className="text-light">{user?.email}</small>
          </div>

          <nav className="nav flex-column p-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="nav-link"
            >
              ← Back to Dashboard
            </button>
          </nav>
        </div>

        <div className="col-md-9 col-lg-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary">Profile Settings</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn btn-gradient"
            >
              {editMode ? (
                <>
                  <FaTimes className="me-2" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <FaUserEdit className="me-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title fw-bold mb-4">Health Metrics</h4>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FaRulerVertical className="me-2" />
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="height"
                        value={profile.height}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="Enter height in cm"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FaWeight className="me-2" />
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="weight"
                        value={profile.weight}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="Enter weight in kg"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FaFire className="me-2" />
                        Calories Burnt
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="caloriesBurnt"
                        value={profile.caloriesBurnt}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="Enter calories burnt"
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        <FaBirthdayCake className="me-2" />
                        Age
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="Enter age"
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={handleSave}
                        className="btn btn-gradient"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                          <FaSave className="me-2" />
                        )}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">Health Tips</h5>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <small className="text-muted">
                        • Maintain a balanced diet with proper nutrition
                      </small>
                    </li>
                    <li className="mb-3">
                      <small className="text-muted">
                        • Exercise for at least 30 minutes daily
                      </small>
                    </li>
                    <li className="mb-3">
                      <small className="text-muted">
                        • Drink 8-10 glasses of water daily
                      </small>
                    </li>
                    <li className="mb-3">
                      <small className="text-muted">
                        • Get 7-8 hours of sleep each night
                      </small>
                    </li>
                    <li>
                      <small className="text-muted">
                        • Regular health check-ups are important
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;