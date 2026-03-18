import React, { useState, useEffect } from 'react';
import { healthLogAPI } from '../services/api';

const DailyLog = () => {
  const [waterIntakeLiters, setWaterIntakeLiters] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchLog = async () => {
    try {
      const email = localStorage.getItem("email");
const response = await healthLogAPI.getLog(email);

      if (response.data) {
        setWaterIntakeLiters(response.data.waterIntakeLiters || '');
        setSleepHours(response.data.sleepHours || '');
        setNotes(response.data.notes || '');
      }
    } catch (error) {
      console.log("No log found for today");
    }
  };

  useEffect(() => {
    fetchLog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const email = localStorage.getItem("email");

await healthLogAPI.saveLog({
  email,
  waterIntakeLiters,
  sleepHours,
  notes
});

      setMessage("Daily log saved!");
    } catch (error) {
      setMessage("Error saving log");
    }
  };

  return (
    <div>
      <h2>Water & Sleep Log</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.1"
          placeholder="Water Intake (liters)"
          value={waterIntakeLiters}
          onChange={(e) => setWaterIntakeLiters(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Sleep Hours"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
        />

        <textarea
          placeholder="Optional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Save Log</button>
      </form>
    </div>
  );
};

export default DailyLog;
