import React from "react";

export default function Settings({
  darkMode,
  setDarkMode,
  focusTime,
  setFocusTime,
  breakTime,
  setBreakTime,
  dailyGoal,
  setDailyGoal,
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="space-y-2">
        <label>
          Focus (min):
          <input
            type="number"
            value={focusTime}
            onChange={(e) => setFocusTime(Number(e.target.value))}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <label>
          Break (min):
          <input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(Number(e.target.value))}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <label>
          Daily Goal (tasks):
          <input
            type="number"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 mt-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}
