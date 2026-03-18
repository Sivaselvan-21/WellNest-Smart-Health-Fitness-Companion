import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { workoutAPI } from '../../services/api';
import './WorkoutTracker.css';

const EXERCISE_TYPES = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Pilates', 'Sports', 'Other'];

const CALORIES_PER_MINUTE = {
  running: 11, jogging: 9, walking: 5, cycling: 8,
  swimming: 10, skipping: 12, rowing: 9, dancing: 6,
  zumba: 7, aerobics: 7, benchpress: 5, deadlift: 6,
  squats: 6, weighttraining: 5, pullups: 7, pushups: 5,
  lunges: 5, bicepcurl: 4, yoga: 3, hotyoga: 5,
  vinyasa: 5, hatha: 3, pilates: 4, meditation: 1,
  stretching: 2, hiit: 12, circuittraining: 10, burpees: 10,
  jumprope: 12, football: 9, basketball: 8, badminton: 7,
  tennis: 8, cricket: 5, volleyball: 6, boxing: 11,
  kickboxing: 10,
};

const TYPE_DEFAULT_CALORIES = {
  Cardio: 9, Strength: 6, Yoga: 3,
  HIIT: 11, Pilates: 4, Sports: 8, Other: 5,
};

function getCaloriesPerMinute(lower, noSpace) {
  if (CALORIES_PER_MINUTE[noSpace]) return CALORIES_PER_MINUTE[noSpace];
  if (CALORIES_PER_MINUTE[lower]) return CALORIES_PER_MINUTE[lower];
  var keys = Object.keys(CALORIES_PER_MINUTE);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (lower.indexOf(k) !== -1 || k.indexOf(lower) !== -1 || noSpace.indexOf(k) !== -1) {
      return CALORIES_PER_MINUTE[k];
    }
  }
  return null;
}

function estimateCalories(exerciseType, exerciseName, duration) {
  if (!duration || Number(duration) <= 0) return 0;
  var mins = Number(duration);
  var lower = (exerciseName || '').toLowerCase().trim();
  var noSpace = lower.replace(/\s+/g, '');
  var perMinute = getCaloriesPerMinute(lower, noSpace);
  if (!perMinute) perMinute = TYPE_DEFAULT_CALORIES[exerciseType] || 6;
  return Math.round(perMinute * mins);
}

function WorkoutGraph(props) {
  var logs = props.logs;
  var [animatedHeights, setAnimatedHeights] = useState([]);
  var animRef = useRef(null);

  var recent = logs.slice(0, 7).reverse();
  var maxCal = 0;
  for (var i = 0; i < recent.length; i++) {
    if (Number(recent[i].caloriesBurned) > maxCal) maxCal = Number(recent[i].caloriesBurned);
  }

  var graphH = 200;
  var graphW = 500;
  var padL = 55;
  var padB = 45;
  var padT = 20;
  var padR = 20;
  var plotH = graphH - padT - padB;
  var plotW = graphW - padL - padR;

  useEffect(function() {
    setAnimatedHeights(recent.map(function() { return 0; }));
    var start = null;
    var duration = 1000;
    function animate(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedHeights(recent.map(function(log) {
        return maxCal > 0 ? (Number(log.caloriesBurned) / maxCal) * plotH * eased : 0;
      }));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
    animRef.current = requestAnimationFrame(animate);
    return function() { cancelAnimationFrame(animRef.current); };
  }, [logs.length]);

  if (!recent.length) return null;

  var barW = Math.min(40, (plotW / recent.length) - 10);
  var ySteps = 5;

  return (
    <div className="graph-box">
      <h3 className="graph-heading">Calories Burned Progress</h3>
      <svg width="100%" viewBox={'0 0 ' + graphW + ' ' + graphH} preserveAspectRatio="xMidYMid meet">

        {/* Y axis */}
        <line x1={padL} y1={padT} x2={padL} y2={graphH - padB} stroke="#667eea" strokeWidth="2" />
        {/* X axis */}
        <line x1={padL} y1={graphH - padB} x2={graphW - padR} y2={graphH - padB} stroke="#667eea" strokeWidth="2" />

        {/* Y axis label */}
        <text x="12" y={graphH / 2} fill="#667eea" fontSize="11" textAnchor="middle"
          transform={'rotate(-90, 12, ' + (graphH / 2) + ')'}>Calories (cal)</text>

        {/* X axis label */}
        <text x={padL + plotW / 2} y={graphH - 2} fill="#667eea" fontSize="11" textAnchor="middle">
          Workouts
        </text>

        {/* Y axis ticks and values */}
        {Array.from({ length: ySteps + 1 }).map(function(_, idx) {
          var val = Math.round((maxCal / ySteps) * idx);
          var y = (graphH - padB) - (plotH / ySteps) * idx;
          return (
            <g key={idx}>
              <line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="#667eea" strokeWidth="1.5" />
              <text x={padL - 7} y={y + 4} fill="#888" fontSize="10" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {/* Bars */}
        {recent.map(function(log, idx) {
          var slotW = plotW / recent.length;
          var x = padL + slotW * idx + slotW / 2 - barW / 2;
          var barH = animatedHeights[idx] || 0;
          var y = (graphH - padB) - barH;
          var label = log.exerciseName ? log.exerciseName.substring(0, 6) : log.exerciseType.substring(0, 5);
          return (
            <g key={idx}>
              <defs>
                <linearGradient id={'wg' + idx} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <rect x={x} y={y} width={barW} height={barH}
                fill={'url(#wg' + idx + ')'} rx="4" />
              <text x={x + barW / 2} y={y - 4} fill="#667eea" fontSize="9" textAnchor="middle" fontWeight="600">
                {barH > 5 ? log.caloriesBurned : ''}
              </text>
              <line x1={padL + slotW * idx + slotW / 2} y1={graphH - padB}
                x2={padL + slotW * idx + slotW / 2} y2={graphH - padB + 4} stroke="#667eea" strokeWidth="1.5" />
              <text x={padL + slotW * idx + slotW / 2} y={graphH - padB + 14}
                fill="#888" fontSize="9" textAnchor="middle">{label}</text>
            </g>
          );
        })}

        {/* Origin dot */}
        <circle cx={padL} cy={graphH - padB} r="3" fill="#667eea" />
      </svg>
      <p className="graph-note">Last {recent.length} workouts — bars grow as you log more!</p>
    </div>
  );
}

const WorkoutTracker = () => {
  const [form, setForm] = useState({
    exerciseType: '', exerciseName: '', duration: '',
    date: new Date().toISOString().split('T')[0], notes: '',
  });
  const [estimatedCalories, setEstimatedCalories] = useState(0);
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(function() { fetchLogs(); }, []);

  async function fetchLogs() {
    try {
      const response = await workoutAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Workout logs error:', error);
    }
  }

  useEffect(function() {
    if (form.duration && Number(form.duration) > 0) {
      setEstimatedCalories(estimateCalories(form.exerciseType, form.exerciseName, form.duration));
    } else {
      setEstimatedCalories(0);
    }
  }, [form.exerciseType, form.exerciseName, form.duration]);

  function handleChange(e) {
    var updated = {
      exerciseType: form.exerciseType, exerciseName: form.exerciseName,
      duration: form.duration, date: form.date, notes: form.notes,
    };
    updated[e.target.name] = e.target.value;
    setForm(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.exerciseType || !form.duration) return;
    setLoading(true);
    try {
      var payload = {
        exerciseType: form.exerciseType, exerciseName: form.exerciseName,
        duration: Number(form.duration), caloriesBurned: estimatedCalories,
        notes: form.notes, date: new Date(form.date),
      };
      const response = await workoutAPI.logWorkout(payload);
      setLogs([response.data].concat(logs));
      setForm({ exerciseType: '', exerciseName: '', duration: '', date: new Date().toISOString().split('T')[0], notes: '' });
      setEstimatedCalories(0);
      setSubmitted(true);
      toast.success('Workout logged successfully!');
      setTimeout(function() { setSubmitted(false); }, 2000);
    } catch (error) {
      console.error('Log workout error:', error);
      toast.error('Failed to log workout. Is backend running?');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      await workoutAPI.deleteLog(id);
      var filtered = [];
      for (var i = 0; i < logs.length; i++) {
        if (logs[i].id !== id) filtered.push(logs[i]);
      }
      setLogs(filtered);
      toast.success('Workout deleted');
    } catch (error) {
      toast.error('Failed to delete workout');
    }
  }

  var totalCalories = 0;
  var totalMinutes = 0;
  for (var i = 0; i < logs.length; i++) {
    totalCalories += Number(logs[i].caloriesBurned) || 0;
    totalMinutes  += Number(logs[i].duration) || 0;
  }

  return (
    <div className="tracker-wrapper">
      <h2>Workout Tracker</h2>

      {logs.length > 0 && (
        <div className="tracker-stats">
          <div className="stat-card"><span>{logs.length}</span><label>Workouts</label></div>
          <div className="stat-card"><span>{totalMinutes} min</span><label>Total Duration</label></div>
          <div className="stat-card"><span>{totalCalories} cal</span><label>Calories Burned</label></div>
        </div>
      )}

      {logs.length > 1 && (
        <button className="btn-toggle-graph workout-toggle" onClick={function() { setShowGraph(!showGraph); }}>
          {showGraph ? 'Hide Graph' : 'Show Progress Graph'}
        </button>
      )}

      {showGraph && <WorkoutGraph logs={logs} />}

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Exercise Type *</label>
            <select name="exerciseType" value={form.exerciseType} onChange={handleChange} required>
              <option value="">Select type</option>
              {EXERCISE_TYPES.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
            </select>
          </div>
          <div className="form-group">
            <label>Exercise Name</label>
            <input type="text" name="exerciseName" value={form.exerciseName}
              onChange={handleChange} placeholder="e.g. Running, Bench Press, Yoga" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input type="number" name="duration" value={form.duration}
              onChange={handleChange} placeholder="e.g. 30" min="1" required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
        </div>

        {estimatedCalories > 0 && (
          <div className="calorie-estimate-box">
            <p className="estimate-title">Auto-Estimated Calories Burned</p>
            <div className="calorie-display">{estimatedCalories} cal</div>
            <p className="estimate-note">Based on {form.exerciseName || form.exerciseType} for {form.duration} minutes</p>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Notes</label>
          <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Saving...' : submitted ? 'Logged!' : '+ Log Workout'}
        </button>
      </form>

      {logs.length > 0 && (
        <div className="log-list">
          <h3>Your Workouts</h3>
          {logs.map(function(log) {
            return (
              <div key={log.id} className="log-card">
                <div className="log-info">
                  <span className="log-badge">{log.exerciseType}</span>
                  <strong>{log.exerciseName || log.exerciseType}</strong>
                  <span>{log.duration} min</span>
                  <span>{log.caloriesBurned} cal</span>
                  {log.notes && <span className="log-notes">{log.notes}</span>}
                </div>
                <button className="btn-delete" onClick={function() { handleDelete(log.id); }}>X</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;