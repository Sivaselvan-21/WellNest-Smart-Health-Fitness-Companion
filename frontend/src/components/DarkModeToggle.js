import { useDarkMode } from "../context/DarkModeContext";
export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <button onClick={toggleDarkMode} style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"none", border:"none", cursor:"pointer", padding:"6px 10px", borderRadius:"50px", color:"white", width:"100%" }}>
      <span style={{ position:"relative", width:"44px", height:"24px", background: darkMode ? "#667eea" : "rgba(255,255,255,0.3)", borderRadius:"50px", flexShrink:0, transition:"background 0.3s ease" }}>
        <span style={{ position:"absolute", top:"3px", left: darkMode ? "23px" : "3px", width:"18px", height:"18px", background:"white", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", transition:"left 0.3s cubic-bezier(0.34,1.56,0.64,1)", fontSize:"11px" }}>
          {darkMode ? "🌙" : "☀️"}
        </span>
      </span>
      <span style={{ fontSize:"13px", fontWeight:600 }}>{darkMode ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}