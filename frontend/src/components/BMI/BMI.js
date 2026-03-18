import { useState, useEffect } from "react";
import axios from "axios";
import BMIChart from "./BMIChart";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    axios
      .get("http://localhost:8080/api/bmi/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const calculateBMI = () => {
    axios
      .post("http://localhost:8080/api/bmi/calculate", {
        height: Number(height),
        weight: Number(weight),
      })
      .then((res) => {
        setResult(res.data);
        fetchHistory(); // refresh history after new calculation
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h2>🧮 BMI Calculator</h2>

      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={calculateBMI}>Calculate</button>

      {result && (
        <p
          className="result"
          style={{
            color:
              result.category === "Normal"
                ? "green"
                : result.category === "Underweight"
                ? "orange"
                : "red",
          }}
        >
          BMI: {result.bmi.toFixed(2)} - {result.category}
        </p>
      )}

      {history.length > 0 && (
        <>
          <h3>BMI History</h3>
          <ul className="history-list">
            {history.map((item, index) => (
              <li key={index}>
                {item.bmi.toFixed(2)} - {item.category}
              </li>
            ))}
          </ul>

          <h3>BMI Progress Chart</h3>
          <BMIChart history={history} />
        </>
      )}
    </div>
  );
}

export default BMI;