import React, { useState, useEffect } from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import CalendarView from "./components/CalendarView";
import Leaderboard from "./components/Leaderboard";
import Quotes from "./components/Quotes";

export default function App() {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-pink-100 to-indigo-200 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">FocusFlow ⏳</h1>
          <button
            className="px-3 py-1 rounded-xl shadow bg-indigo-600 text-white hover:bg-indigo-700 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Timer />
            <TaskList />
          </div>
          <div className="space-y-6">
            <CalendarView />
            <Leaderboard />
            <Quotes />
          </div>
        </div>
      </div>
    </div>
  );
}
