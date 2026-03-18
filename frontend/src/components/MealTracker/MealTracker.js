import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { mealAPI } from '../../services/api';
import './MealTracker.css';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FOOD_DB = {
  oatmeal:        { protein: 13, carbs: 68, fats: 7,  calories: 389 },
  oats:           { protein: 13, carbs: 68, fats: 7,  calories: 389 },
  eggs:           { protein: 13, carbs: 1,  fats: 11, calories: 155 },
  egg:            { protein: 13, carbs: 1,  fats: 11, calories: 155 },
  pancakes:       { protein: 6,  carbs: 38, fats: 5,  calories: 227 },
  toast:          { protein: 4,  carbs: 25, fats: 2,  calories: 133 },
  bread:          { protein: 4,  carbs: 25, fats: 2,  calories: 133 },
  cereal:         { protein: 3,  carbs: 40, fats: 1,  calories: 180 },
  milk:           { protein: 3,  carbs: 5,  fats: 4,  calories: 61  },
  yogurt:         { protein: 10, carbs: 14, fats: 5,  calories: 140 },
  banana:         { protein: 1,  carbs: 27, fats: 0,  calories: 105 },
  apple:          { protein: 0,  carbs: 25, fats: 0,  calories: 95  },
  orange:         { protein: 1,  carbs: 15, fats: 0,  calories: 62  },
  smoothie:       { protein: 5,  carbs: 35, fats: 2,  calories: 180 },
  rice:           { protein: 4,  carbs: 45, fats: 0,  calories: 206 },
  chicken:        { protein: 31, carbs: 0,  fats: 4,  calories: 165 },
  pasta:          { protein: 8,  carbs: 43, fats: 1,  calories: 220 },
  salad:          { protein: 2,  carbs: 10, fats: 5,  calories: 90  },
  sandwich:       { protein: 12, carbs: 35, fats: 8,  calories: 250 },
  burger:         { protein: 17, carbs: 30, fats: 14, calories: 310 },
  pizza:          { protein: 12, carbs: 36, fats: 10, calories: 285 },
  soup:           { protein: 5,  carbs: 15, fats: 3,  calories: 100 },
  dal:            { protein: 9,  carbs: 20, fats: 1,  calories: 130 },
  roti:           { protein: 3,  carbs: 18, fats: 1,  calories: 100 },
  chapati:        { protein: 3,  carbs: 18, fats: 1,  calories: 100 },
  idli:           { protein: 2,  carbs: 16, fats: 0,  calories: 80  },
  dosa:           { protein: 3,  carbs: 20, fats: 2,  calories: 133 },
  biryani:        { protein: 15, carbs: 40, fats: 8,  calories: 290 },
  fish:           { protein: 26, carbs: 0,  fats: 5,  calories: 150 },
  salmon:         { protein: 25, carbs: 0,  fats: 13, calories: 208 },
  tuna:           { protein: 30, carbs: 0,  fats: 1,  calories: 130 },
  steak:          { protein: 28, carbs: 0,  fats: 15, calories: 250 },
  nuts:           { protein: 15, carbs: 20, fats: 45, calories: 580 },
  almonds:        { protein: 21, carbs: 22, fats: 50, calories: 579 },
  proteinbar:     { protein: 20, carbs: 30, fats: 8,  calories: 280 },
  chocolate:      { protein: 5,  carbs: 60, fats: 30, calories: 546 },
  cookies:        { protein: 2,  carbs: 35, fats: 10, calories: 235 },
  chips:          { protein: 2,  carbs: 30, fats: 15, calories: 250 },
  popcorn:        { protein: 3,  carbs: 18, fats: 4,  calories: 120 },
  chickenrice:    { protein: 30, carbs: 45, fats: 6,  calories: 350 },
  grilledchicken: { protein: 31, carbs: 0,  fats: 4,  calories: 165 },
  upma:           { protein: 4,  carbs: 30, fats: 5,  calories: 180 },
  poha:           { protein: 3,  carbs: 35, fats: 4,  calories: 180 },
  paratha:        { protein: 4,  carbs: 25, fats: 6,  calories: 180 },
  samosa:         { protein: 3,  carbs: 20, fats: 10, calories: 180 },
  paneer:         { protein: 18, carbs: 4,  fats: 20, calories: 265 },
  tofu:           { protein: 8,  carbs: 2,  fats: 4,  calories: 76  },
  avocado:        { protein: 2,  carbs: 9,  fats: 15, calories: 160 },
  sweetpotato:    { protein: 2,  carbs: 27, fats: 0,  calories: 112 },
  corn:           { protein: 3,  carbs: 21, fats: 1,  calories: 96  },
  watermelon:     { protein: 1,  carbs: 12, fats: 0,  calories: 46  },
  mango:          { protein: 1,  carbs: 25, fats: 0,  calories: 99  },
  grapes:         { protein: 1,  carbs: 18, fats: 0,  calories: 69  },
};

function estimateNutrition(foodItem) {
  if (!foodItem) return null;
  var lower = foodItem.toLowerCase().trim();
  var noSpace = lower.replace(/\s+/g, '');
  if (FOOD_DB[noSpace]) return FOOD_DB[noSpace];
  if (FOOD_DB[lower]) return FOOD_DB[lower];
  var keys = Object.keys(FOOD_DB);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (lower.indexOf(k) !== -1 || k.indexOf(lower) !== -1 || noSpace.indexOf(k) !== -1) {
      return FOOD_DB[k];
    }
  }
  return { calories: 200, protein: Math.round(200 * 0.20 / 4), carbs: Math.round(200 * 0.50 / 4), fats: Math.round(200 * 0.30 / 9) };
}

var MEAL_COLORS = {
  Breakfast: '#ff9f43', Lunch: '#1dd1a1',
  Dinner: '#5f27cd',    Snacks: '#ee5a24',
};

function MealGraph(props) {
  var logs = props.logs;
  var [animatedHeights, setAnimatedHeights] = useState([]);
  var animRef = useRef(null);

  var recent = logs.slice(0, 7).reverse();
  var maxCal = 0;
  for (var i = 0; i < recent.length; i++) {
    if (Number(recent[i].calories) > maxCal) maxCal = Number(recent[i].calories);
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
        return maxCal > 0 ? (Number(log.calories) / maxCal) * plotH * eased : 0;
      }));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return function() { cancelAnimationFrame(animRef.current); };
  }, [logs.length]);

  if (!recent.length) return null;

  var barW = Math.min(40, (plotW / recent.length) - 10);
  var ySteps = 5;

  return (
    <div className="graph-box">
      <h3 className="graph-heading">Calorie Intake Progress</h3>
      <svg width="100%" viewBox={'0 0 ' + graphW + ' ' + graphH} preserveAspectRatio="xMidYMid meet">

        <line x1={padL} y1={padT} x2={padL} y2={graphH - padB} stroke="#ee5a24" strokeWidth="2" />
        <line x1={padL} y1={graphH - padB} x2={graphW - padR} y2={graphH - padB} stroke="#ee5a24" strokeWidth="2" />

        <text x="12" y={graphH / 2} fill="#ee5a24" fontSize="11" textAnchor="middle"
          transform={'rotate(-90, 12, ' + (graphH / 2) + ')'}>Calories (cal)</text>
        <text x={padL + plotW / 2} y={graphH - 2} fill="#ee5a24" fontSize="11" textAnchor="middle">Meals</text>

        {Array.from({ length: ySteps + 1 }).map(function(_, idx) {
          var val = Math.round((maxCal / ySteps) * idx);
          var y = (graphH - padB) - (plotH / ySteps) * idx;
          return (
            <g key={idx}>
              <line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="#ee5a24" strokeWidth="1.5" />
              <text x={padL - 7} y={y + 4} fill="#888" fontSize="10" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {recent.map(function(log, idx) {
          var slotW = plotW / recent.length;
          var x = padL + slotW * idx + slotW / 2 - barW / 2;
          var barH = animatedHeights[idx] || 0;
          var y = (graphH - padB) - barH;
          var color = MEAL_COLORS[log.mealType] || '#667eea';
          var label = log.foodItem ? log.foodItem.substring(0, 6) : log.mealType.substring(0, 5);
          return (
            <g key={idx}>
              <rect x={x} y={y} width={barW} height={barH} fill={color} rx="4" opacity="0.9" />
              <text x={x + barW / 2} y={y - 4} fill={color} fontSize="9" textAnchor="middle" fontWeight="600">
                {barH > 5 ? log.calories : ''}
              </text>
              <line x1={padL + slotW * idx + slotW / 2} y1={graphH - padB}
                x2={padL + slotW * idx + slotW / 2} y2={graphH - padB + 4} stroke="#ee5a24" strokeWidth="1.5" />
              <text x={padL + slotW * idx + slotW / 2} y={graphH - padB + 14}
                fill="#888" fontSize="9" textAnchor="middle">{label}</text>
            </g>
          );
        })}

        <circle cx={padL} cy={graphH - padB} r="3" fill="#ee5a24" />
      </svg>

      <div className="graph-legend-row">
        {Object.keys(MEAL_COLORS).map(function(m) {
          return (
            <span key={m} className="legend-item">
              <span className="legend-dot" style={{ background: MEAL_COLORS[m] }} />
              {m}
            </span>
          );
        })}
      </div>
      <p className="graph-note">Last {recent.length} meals — bars grow as you log more!</p>
    </div>
  );
}

const MealTracker = () => {
  const [form, setForm] = useState({
    mealType: '', foodItem: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [estimated, setEstimated] = useState(null);
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(function() { fetchLogs(); }, []);

  async function fetchLogs() {
    try {
      const response = await mealAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Meal logs error:', error);
    }
  }

  useEffect(function() {
    if (form.foodItem.trim().length > 1) {
      setEstimated(estimateNutrition(form.foodItem));
    } else {
      setEstimated(null);
    }
  }, [form.foodItem]);

  function handleChange(e) {
    var updated = { mealType: form.mealType, foodItem: form.foodItem, date: form.date };
    updated[e.target.name] = e.target.value;
    setForm(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.mealType || !form.foodItem) return;
    setLoading(true);
    try {
      var payload = {
        mealType: form.mealType, foodItem: form.foodItem, date: new Date(form.date),
        calories: estimated ? estimated.calories : 0,
        protein:  estimated ? estimated.protein  : 0,
        carbs:    estimated ? estimated.carbs    : 0,
        fats:     estimated ? estimated.fats     : 0,
      };
      const response = await mealAPI.logMeal(payload);
      setLogs([response.data].concat(logs));
      setForm({ mealType: '', foodItem: '', date: new Date().toISOString().split('T')[0] });
      setEstimated(null);
      setSubmitted(true);
      toast.success('Meal logged successfully!');
      setTimeout(function() { setSubmitted(false); }, 2000);
    } catch (error) {
      console.error('Log meal error:', error);
      toast.error('Failed to log meal. Is backend running?');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      await mealAPI.deleteLog(id);
      var filtered = [];
      for (var i = 0; i < logs.length; i++) {
        if (logs[i].id !== id) filtered.push(logs[i]);
      }
      setLogs(filtered);
      toast.success('Meal deleted');
    } catch (error) {
      toast.error('Failed to delete meal');
    }
  }

  var totalCals = 0; var totalProtein = 0; var totalCarbs = 0; var totalFats = 0;
  for (var i = 0; i < logs.length; i++) {
    totalCals    += Number(logs[i].calories) || 0;
    totalProtein += Number(logs[i].protein)  || 0;
    totalCarbs   += Number(logs[i].carbs)    || 0;
    totalFats    += Number(logs[i].fats)     || 0;
  }

  return (
    <div className="tracker-wrapper">
      <h2>Meal Tracker</h2>

      {logs.length > 0 && (
        <div className="tracker-stats">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#ee5a24,#f9ca24)' }}>
            <span>{totalCals}</span><label>Total Cal</label>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#6c5ce7,#a29bfe)' }}>
            <span>{totalProtein}g</span><label>Protein</label>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#00b894,#55efc4)' }}>
            <span>{totalCarbs}g</span><label>Carbs</label>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#fd79a8,#e84393)' }}>
            <span>{totalFats}g</span><label>Fats</label>
          </div>
        </div>
      )}

      {logs.length > 1 && (
        <button className="btn-toggle-graph meal-toggle" onClick={function() { setShowGraph(!showGraph); }}>
          {showGraph ? 'Hide Graph' : 'Show Progress Graph'}
        </button>
      )}

      {showGraph && <MealGraph logs={logs} />}

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Meal Type *</label>
            <select name="mealType" value={form.mealType} onChange={handleChange} required>
              <option value="">Select meal</option>
              {MEAL_TYPES.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
            </select>
          </div>
          <div className="form-group">
            <label>Food Item *</label>
            <input type="text" name="foodItem" value={form.foodItem}
              onChange={handleChange} placeholder="e.g. Oatmeal, Chicken, Biryani" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
        </div>

        {estimated && (
          <div className="nutrition-estimate-box">
            <p className="estimate-title">Auto-Estimated Nutrition for {form.foodItem}</p>
            <div className="estimate-pills">
              <span className="pill calories">Calories: {estimated.calories} cal</span>
              <span className="pill protein">Protein: {estimated.protein}g</span>
              <span className="pill carbs">Carbs: {estimated.carbs}g</span>
              <span className="pill fats">Fats: {estimated.fats}g</span>
            </div>
            <p className="estimate-note">* Estimates based on average serving size</p>
          </div>
        )}

        <button type="submit" className="btn-submit" style={{ marginTop: '16px' }} disabled={loading}>
          {loading ? 'Saving...' : submitted ? 'Logged!' : '+ Log Meal'}
        </button>
      </form>

      {logs.length > 0 && (
        <div className="log-list">
          <h3>Your Meals</h3>
          {logs.map(function(log) {
            return (
              <div key={log.id} className="log-card">
                <div className="log-info">
                  <span className="log-badge" style={{ background: MEAL_COLORS[log.mealType] + '22', color: MEAL_COLORS[log.mealType] }}>
                    {log.mealType}
                  </span>
                  <strong>{log.foodItem}</strong>
                  <span>{log.calories} cal</span>
                  <span>{log.protein}g protein</span>
                  <span>{log.carbs}g carbs</span>
                  <span>{log.fats}g fats</span>
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

export default MealTracker;