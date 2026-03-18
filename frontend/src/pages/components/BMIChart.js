import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

function BMIChart({ history }) {
  const data = {
    labels: history.map((_, index) => `Entry ${index + 1}`),
    datasets: [
      {
        label: "BMI Progress",
        data: history.map((item) => item.bmi),
        borderColor: "#2193b0",
        backgroundColor: "rgba(33,147,176,0.2)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}

export default BMIChart;