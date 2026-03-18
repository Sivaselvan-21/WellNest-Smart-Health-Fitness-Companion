import { useState, useEffect, useRef } from "react";
import "./BMI.css";
import HealthTip from "./components/HealthTip.js";
import Mood from "./components/Mood.js";
import BMI from "./components/BMI.js";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {particlesReady && (
        <Particles
          id="tsparticles"  
          options={{
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 80 },
              color: { value: darkMode ? "#ffffff" : "#ff6eb4" },
              links: {
                enable: true,
                distance: 150,
                color: darkMode ? "#c084fc" : "#a855f7",
                opacity: 0.25,
                width: 1,
              },
              move: {
                enable: true,
                speed: 1.5,
              },
              size: {
                value: { min: 1, max: 3 },
              },
              opacity: {
                value: 0.35,
              },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
              },
              modes: {
                repulse: { distance: 100 },
              },
            },
          }}
        />
      )}

      {/* TOGGLE */}
      <button
        className="toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* TITLE */}
      <h1 className="main-title">
        WellNest Smart Health Dashboard
      </h1>

      {/* CONTENT */}
      <div className="top-section">
        <div className="card glow">
          <HealthTip />
        </div>

        <div className="card mood-animate glow">
          <Mood />
        </div>
      </div>

      <div className="bottom-section">
        <div className="card glow">
          <BMI />
        </div>
      </div>
    </div>
  );
}

export default App;