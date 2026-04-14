import React, { useState, useMemo } from 'react';
import { FaBullseye, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';

const DEFAULT_GOALS = {
  weeklyWorkouts:    4,
  dailyCaloriesBurn: 500,
  dailyWater:        2500,
  dailySleep:        8,
  targetWeight:      70,
  dailyCaloriesIn:   2000,
};

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val));

const ProgressBar = ({ label, current, target }) => {
  const pct      = target > 0 ? clamp(Math.round((current / target) * 100)) : 0;
  const isGood   = pct >= 80;
  const isWarn   = !isGood && pct >= 50;
  const barColor = isGood ? '#43d9a2' : isWarn ? '#ffc107' : '#ff6b6b';
  const badge    = isGood ? '✅' : isWarn ? '⚠️' : '🔴';

  return (
    <div className="goal-progress-bar-wrap">
      <div className="goal-label">
        <span>{badge} {label}</span>
        <span className="goal-pct" style={{ color: barColor }}>
          {current} / {target} ({pct}%)
        </span>
      </div>
      <div className="progress">
        <div className="progress-bar" role="progressbar"
          style={{ width: `${pct}%`, background: barColor }}
          aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />
      </div>
    </div>
  );
};

const GoalProgress = ({ user, workoutLogs = [], mealLogs = [], waterLogs = [], sleepLogs = [] }) => {
  const { darkMode } = useDarkMode();

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('fitnessGoals');
      return saved ? { ...DEFAULT_GOALS, ...JSON.parse(saved) } : DEFAULT_GOALS;
    } catch { return DEFAULT_GOALS; }
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...goals });

  const saveGoals = () => {
    setGoals({ ...draft });
    localStorage.setItem('fitnessGoals', JSON.stringify(draft));
    setEditing(false);
  };

  const startOfWeek = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayStr     = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const weeklyWorkouts = workoutLogs.filter(l =>
    new Date(l.date || l.createdAt || l.logDate) >= startOfWeek
  ).length;

  const todayCaloriesBurned = workoutLogs
    .filter(l => new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10) === todayStr)
    .reduce((s, l) => s + (l.caloriesBurned || l.caloriesBurnt || l.calories || 0), 0) || user?.caloriesBurnt || 0;

  const todayWater = waterLogs
    .filter(l => new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10) === todayStr)
    .reduce((s, l) => {
      const amt = l.amount || l.quantity || l.volume || 0;
      return s + (amt < 20 ? amt * 250 : amt);
    }, 0);

  const lastSleep = sleepLogs
    .filter(l => {
      const d = new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10);
      return d === todayStr || d === yesterdayStr;
    })
    .reduce((s, l) => s + (l.duration || l.hours || l.sleepDuration || 0), 0);

  const todayCaloriesIn = mealLogs
    .filter(l => new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10) === todayStr)
    .reduce((s, l) => s + (l.calories || l.totalCalories || 0), 0);

  const currentWeight = user?.weight || 0;
  const weightDiff    = currentWeight && goals.targetWeight
    ? Math.abs(currentWeight - goals.targetWeight) : null;

  const goalFields = [
    { key: 'weeklyWorkouts',    label: 'Workouts / week',        min: 1,    max: 14 },
    { key: 'dailyCaloriesBurn', label: 'Calories burned / day',  min: 100,  max: 3000 },
    { key: 'dailyWater',        label: 'Water intake (ml/day)',   min: 500,  max: 5000 },
    { key: 'dailySleep',        label: 'Sleep (hours/night)',     min: 4,    max: 12 },
    { key: 'targetWeight',      label: 'Target weight (kg)',      min: 30,   max: 200 },
    { key: 'dailyCaloriesIn',   label: 'Calories consumed / day', min: 1000, max: 5000 },
  ];

  return (
    <div className="analytics-card">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center gap-2">
          <FaBullseye color="#ff6b6b" />
          <h5 className="mb-0">Goal Progress</h5>
        </div>
        <button
          className="btn btn-sm"
          style={{ background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: 'none', borderRadius: 8 }}
          onClick={() => editing ? saveGoals() : setEditing(true)}
        >
          {editing
            ? <><FaCheck className="me-1" />Save Goals</>
            : <><FaEdit className="me-1" />Set Goals</>}
        </button>
      </div>
      <p className="subtitle">Compare your activity against your personal targets</p>

      {editing && (
        <div className={`p-3 rounded-3 mb-4 ${darkMode ? 'bg-dark' : 'bg-light'}`}
          style={{ border: '1px dashed #4f8ef7' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong style={{ fontSize: '0.9rem' }}>✏️ Edit Your Goals</strong>
            <button className="btn btn-sm btn-link p-0 text-muted" onClick={() => setEditing(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="row g-2">
            {goalFields.map(({ key, label, min, max }) => (
              <div className="col-md-6 col-lg-4" key={key}>
                <label className="form-label small fw-semibold mb-1">{label}</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={draft[key]}
                  min={min}
                  max={max}
                  onChange={e => setDraft(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
          <button className="btn btn-sm btn-primary mt-3" onClick={saveGoals}>
            <FaCheck className="me-1" /> Save Changes
          </button>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <h6 className="fw-bold text-muted small mb-3 text-uppercase" style={{ letterSpacing: '0.08em' }}>
            This Week
          </h6>
          <ProgressBar label="Workout Sessions" current={weeklyWorkouts} target={goals.weeklyWorkouts} />
        </div>
        <div className="col-md-6">
          <h6 className="fw-bold text-muted small mb-3 text-uppercase" style={{ letterSpacing: '0.08em' }}>
            Today
          </h6>
          <ProgressBar label="Calories Burned"   current={todayCaloriesBurned}              target={goals.dailyCaloriesBurn} />
          <ProgressBar label="Water Intake (ml)" current={Math.round(todayWater)}            target={goals.dailyWater} />
          <ProgressBar label="Calories Consumed" current={todayCaloriesIn}                   target={goals.dailyCaloriesIn} />
          <ProgressBar label="Sleep Last Night"  current={parseFloat(lastSleep.toFixed(1))} target={goals.dailySleep} />
        </div>
      </div>

      {currentWeight > 0 && goals.targetWeight > 0 && (
        <div className="mt-3 p-3 rounded-3"
          style={{ background: darkMode ? '#1a1a2e' : '#f8f9ff', border: '1px solid rgba(79,142,247,0.15)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>⚖️ Weight Goal</strong>
              <div className="text-muted small mt-1">
                Current: <strong>{currentWeight} kg</strong> &nbsp;→&nbsp; Target: <strong>{goals.targetWeight} kg</strong>
              </div>
            </div>
            <div>
              {weightDiff === 0 ? (
                <span className="badge bg-success fs-6">🎉 Goal Reached!</span>
              ) : (
                <span className={`badge fs-6 ${weightDiff <= 5 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                  {currentWeight > goals.targetWeight ? '▼' : '▲'} {weightDiff.toFixed(1)} kg to go
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;