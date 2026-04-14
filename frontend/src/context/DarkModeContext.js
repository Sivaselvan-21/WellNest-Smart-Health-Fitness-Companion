import { createContext, useContext, useState, useEffect } from "react";
const DarkModeContext = createContext();
export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}
export function useDarkMode() { return useContext(DarkModeContext); }