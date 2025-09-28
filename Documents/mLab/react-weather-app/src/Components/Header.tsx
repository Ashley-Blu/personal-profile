import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiFahrenheitFill, RiCelsiusFill } from "react-icons/ri";
import { useMetrics } from "../Hooks/useMetrics";

export function Header() {
  const [darkTheme, setDarkTheme] = useState(false);
  const { metrics, toggleMetric } = useMetrics();

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode === "dark") {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("mode", darkTheme ? "dark" : "light");
  }, [darkTheme]);

  return (
    <header className="flex justify-between items-center bg-blue shadow-md p-2 rounded-lg mb-4 w-full dark:bg-gray-800 dark:text-white">
      <h2 className="text-lg font-bold p-2 flex items-center">
        React Weather App
      </h2>
      <div className="flex items-center">
        {/* Dark Mode Toggle */}
        <button
          className="mr-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          onClick={() => setDarkTheme((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          {darkTheme ? <MdLightMode /> : <MdDarkMode />}
        </button>
        {/* Metric/Imperial Toggle */}
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          onClick={toggleMetric}
          aria-label="Toggle metric/imperial"
        >
          {metrics.units === "metric" ? (
            <RiFahrenheitFill />
          ) : (
            <RiCelsiusFill />
          )}
        </button>
      </div>
    </header>
  );
}
