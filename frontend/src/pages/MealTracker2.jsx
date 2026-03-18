import React, { useState, useEffect } from 'react';
import { mealAPI } from '../services/api';

const mealStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inconsolata:wght@300;400;500&display=swap');

  :root {
    --bg: #0d0f14;
    --surface: #13161e;
    --surface2: #1a1e29;
    --border: #252836;
    --accent: #b6f542;
    --accent-dim: rgba(182, 245, 66, 0.12);
    --text: #e8eaf0;
    --text-muted: #5a6070;
    --text-soft: #9aa0b0;
    --red: #ff5e6c;
    --orange: #ff9f43;
    --blue: #5e8cff;
    --purple: #c07bff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mt-wrapper {
    background: var(--bg);
    min-height: 100vh;
    padding: 48px 32px;
    font-family: 'Inconsolata', monospace;
    color: var(--text);
  }

  .mt-header {
    margin-bottom: 40px;
  }

  .mt-header .eyebrow {
    font-family: 'Inconsolata', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
    font-weight: 500;
  }

  .mt-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 42px;
    font-weight: 800;
    color: var(--text);
    line-height: 1.05;
    letter-spacing: -1.5px;
  }

  .mt-header h1 span {
    color: var(--accent);
  }

  /* TOAST */
  .mt-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 28px;
    animation: slideIn 0.3s ease;
    border: 1px solid;
  }

  .mt-toast.success {
    background: rgba(182, 245, 66, 0.08);
    border-color: rgba(182, 245, 66, 0.3);
    color: var(--accent);
  }

  .mt-toast.error {
    background: rgba(255, 94, 108, 0.08);
    border-color: rgba(255, 94, 108, 0.3);
    color: var(--red);
  }

  .mt-toast::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* FORM CARD */
  .mt-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 36px;
    position: relative;
    overflow: hidden;
  }

  .mt-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }

  .mt-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-soft);
    margin-bottom: 20px;
  }

  .mt-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .mt-form-full { grid-column: 1 / -1; }

  .mt-field {
    position: relative;
  }

  .mt-field label {
    display: block;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
    font-weight: 500;
  }

  .mt-field select,
  .mt-field input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Inconsolata', monospace;
    font-size: 14px;
    padding: 12px 14px;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }

  .mt-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235a6070'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .mt-field select:focus,
  .mt-field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }

  .mt-field input::placeholder { color: var(--text-muted); }

  .mt-submit {
    grid-column: 1 / -1;
    margin-top: 4px;
    background: var(--accent);
    color: #0d0f14;
    border: none;
    border-radius: 8px;
    padding: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    width: 100%;
  }

  .mt-submit:hover { opacity: 0.88; transform: translateY(-1px); }
  .mt-submit:active { transform: translateY(0); }

  /* LOG SECTION */
  .mt-log-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 18px;
  }

  .mt-log-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .mt-count {
    font-size: 12px;
    background: var(--accent-dim);
    color: var(--accent);
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  .mt-meals-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mt-meal-row {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    transition: border-color 0.2s, transform 0.15s;
    animation: fadeUp 0.3s ease both;
  }

  .mt-meal-row:hover {
    border-color: var(--accent);
    transform: translateX(4px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mt-meal-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    white-space: nowrap;
  }

  .badge-Breakfast { background: rgba(255,159,67,0.15); color: var(--orange); }
  .badge-Lunch     { background: rgba(182,245,66,0.12); color: var(--accent); }
  .badge-Dinner    { background: rgba(94,140,255,0.12); color: var(--blue); }
  .badge-Snacks    { background: rgba(192,123,255,0.12); color: var(--purple); }

  .mt-meal-info { min-width: 0; }

  .mt-meal-cals {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
  }

  .mt-meal-macros {
    display: flex;
    gap: 14px;
    margin-top: 4px;
  }

  .macro-pill {
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .macro-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .mt-meal-id {
    font-size: 11px;
    color: var(--text-muted);
    font-family: 'Inconsolata', monospace;
  }

  .mt-empty {
    text-align: center;
    padding: 56px 24px;
    background: var(--surface);
    border: 1px dashed var(--border);
    border-radius: 14px;
  }

  .mt-empty .empty-icon { font-size: 36px; margin-bottom: 12px; }
  .mt-empty p { color: var(--text-muted); font-size: 14px; }
`;

const BADGE = { Breakfast: 'badge-Breakfast', Lunch: 'badge-Lunch', Dinner: 'badge-Dinner', Snacks: 'badge-Snacks' };

const MealTracker = () => {
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [meals, setMeals] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchMeals = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await mealAPI.getMeals(email);
      setMeals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchMeals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('email');
      await mealAPI.addMeal({ email, mealType, calories, protein, carbs, fats });
      setMessage('Meal logged successfully!');
      setIsError(false);
      setMealType(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
      fetchMeals();
    } catch (error) {
      setMessage('Error logging meal');
      setIsError(true);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const totalCals = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);

  return (
    <>
      <style>{mealStyles}</style>
      <div className="mt-wrapper">
        <div className="mt-header">
          <div className="eyebrow">✦ Nutrition Log</div>
          <h1>Meal <span>Tracker</span></h1>
        </div>

        {message && (
          <div className={`mt-toast ${isError ? 'error' : 'success'}`}>{message}</div>
        )}

        <div className="mt-card">
          <div className="mt-card-title">Add Entry</div>
          <form onSubmit={handleSubmit}>
            <div className="mt-form-grid">
              <div className="mt-form-full mt-field">
                <label>Meal Type</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)} required>
                  <option value="">Select meal type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
              <div className="mt-form-full mt-field">
                <label>Calories *</label>
                <input type="number" placeholder="e.g. 450" value={calories} onChange={(e) => setCalories(e.target.value)} required />
              </div>
              <div className="mt-field">
                <label>Protein (g)</label>
                <input type="number" placeholder="0" value={protein} onChange={(e) => setProtein(e.target.value)} />
              </div>
              <div className="mt-field">
                <label>Carbs (g)</label>
                <input type="number" placeholder="0" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
              </div>
              <div className="mt-form-full mt-field">
                <label>Fats (g)</label>
                <input type="number" placeholder="0" value={fats} onChange={(e) => setFats(e.target.value)} />
              </div>
              <button type="submit" className="mt-submit">Log Meal →</button>
            </div>
          </form>
        </div>

        <div className="mt-log-header">
          <h2>Your Meals</h2>
          <span className="mt-count">{meals.length} entries · {totalCals} kcal total</span>
        </div>

        {meals.length === 0 ? (
          <div className="mt-empty">
            <div className="empty-icon">🍽</div>
            <p>No meals logged yet. Add your first entry above.</p>
          </div>
        ) : (
          <ul className="mt-meals-list">
            {meals.map((m, i) => (
              <li key={m.id} className="mt-meal-row" style={{ animationDelay: `${i * 60}ms` }}>
                <span className={`mt-meal-badge ${BADGE[m.mealType] || ''}`}>{m.mealType}</span>
                <div className="mt-meal-info">
                  <div className="mt-meal-cals">{m.calories} kcal</div>
                  {(m.protein || m.carbs || m.fats) && (
                    <div className="mt-meal-macros">
                      {m.protein && <span className="macro-pill"><span className="macro-dot" style={{ background: '#ff9f43' }} />P {m.protein}g</span>}
                      {m.carbs && <span className="macro-pill"><span className="macro-dot" style={{ background: '#5e8cff' }} />C {m.carbs}g</span>}
                      {m.fats && <span className="macro-pill"><span className="macro-dot" style={{ background: '#c07bff' }} />F {m.fats}g</span>}
                    </div>
                  )}
                </div>
                <span className="mt-meal-id">#{String(m.id).padStart(4, '0')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MealTracker;