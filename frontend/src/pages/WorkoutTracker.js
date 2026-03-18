import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../services/api';

const WorkoutTracker = () => {
  const [exerciseType, setExerciseType] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchWorkouts = async () => {
    try {
      const response = await workoutAPI.getWorkouts();
      setWorkouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await workoutAPI.addWorkout({
        exerciseType,
        durationMinutes,
        caloriesBurned
      });

      setMessage("Workout logged successfully!");
      setExerciseType('');
      setDurationMinutes('');
      setCaloriesBurned('');
      fetchWorkouts();
    } catch (error) {
      setMessage("Error logging workout");
    }
  };

  return (
    <div>
      <h2>Workout Tracker</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <select
          value={exerciseType}
          onChange={(e) => setExerciseType(e.target.value)}
          required
        >
          <option value="">Select Exercise Type</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
        </select>

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Calories Burned (optional)"
          value={caloriesBurned}
          onChange={(e) => setCaloriesBurned(e.target.value)}
        />

        <button type="submit">Log Workout</button>
      </form>

      <h3>Your Workouts</h3>
      <ul>
        {workouts.map((w) => (
          <li key={w.id}>
            {w.exerciseType} - {w.durationMinutes} mins - {w.caloriesBurned} cal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutTracker;
