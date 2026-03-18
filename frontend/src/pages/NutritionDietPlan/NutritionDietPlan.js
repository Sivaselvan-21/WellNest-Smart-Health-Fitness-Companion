import React, { useState } from 'react';
import WorkoutTracker from '../../components/WorkoutTracker/WorkoutTracker';
import MealTracker from '../../components/MealTracker/MealTracker';
import WaterIntake from '../../components/WaterIntake/WaterIntake';
import SleepLog from '../../components/SleepLog/SleepLog';
import './NutritionDietPlan.css';

const tabs = [
  { id: 'workout', label: '🏋️ Workout Tracker' },
  { id: 'meal',    label: '🥗 Meal Tracker' },
  { id: 'water',   label: '💧 Water Intake' },
  { id: 'sleep',   label: '😴 Sleep Log' },
];

const NutritionDietPlan = () => {
  const [activeTab, setActiveTab] = useState('workout');

  const renderContent = () => {
    switch (activeTab) {
      case 'workout': return <WorkoutTracker />;
      case 'meal':    return <MealTracker />;
      case 'water':   return <WaterIntake />;
      case 'sleep':   return <SleepLog />;
      default:        return null;
    }
  };

  return (
    <div className="ndp-container">
      <div className="ndp-header">
        <h1>🌿 Nutrition &amp; Diet Plan</h1>
        <p>Track your workouts, meals, hydration, and sleep — all in one place.</p>
      </div>
      <div className="ndp-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`ndp-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ndp-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default NutritionDietPlan;