import { useState } from "react";

function Mood() {
  const [mood, setMood] = useState("");

  return (
    <div>
      <h3>😊 Mood Tracker</h3>
      <select onChange={(e) => setMood(e.target.value)}>
        <option value="">Select Mood</option>
        <option value="Happy">Happy 😄</option>
        <option value="Sad">Sad 😢</option>
        <option value="Energetic">Energetic ⚡</option>
        <option value="Tired">Tired 😴</option>
      </select>

      {mood && <p>Your mood today: {mood}</p>}
    </div>
  );
}

export default Mood;