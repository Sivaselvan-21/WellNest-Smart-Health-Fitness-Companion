import React, { useState, useEffect } from 'react';
import { mealAPI } from '../services/api';

const MealTracker = () => {
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [meals, setMeals] = useState([]);
  const [message, setMessage] = useState('');


     const fetchMeals = async () => {
  try {
    const email = localStorage.getItem("email");
    const response = await mealAPI.getMeals(email);
    setMeals(response.data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchMeals();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const email = localStorage.getItem("email");

    await mealAPI.addMeal({
      email,
      mealType,
      calories,
      protein,
      carbs,
      fats
    });

    setMessage("Meal logged successfully!");
    fetchMeals();
  } catch (error) {
    setMessage("Error logging meal");
  }
};


  return (
    <div>
      <h2>Meal Tracker</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          required
        >
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snacks">Snacks</option>
        </select>

        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
        />

        <input
          type="number"
          placeholder="Carbs (g)"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
        />

        <input
          type="number"
          placeholder="Fats (g)"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
        />

        <button type="submit">Log Meal</button>
      </form>

      <h3>Your Meals</h3>
      <ul>
        {meals.map((m) => (
          <li key={m.id}>
            {m.mealType} - {m.calories} cal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealTracker;
