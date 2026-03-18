import { useEffect, useState } from "react";
import axios from "axios";

function HealthTip() {
  const [tip, setTip] = useState("Loading daily tip...");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/tip")
      .then((response) => {
        setTip(response.data.tip);
      })
      .catch((error) => {
        console.error(error);
        setTip("Unable to fetch tip from server.");
      });
  }, []);

  return (
    <div>
      <h2>💡 Daily Health Tip</h2>
      <p>{tip}</p>
    </div>
  );
}

export default HealthTip;