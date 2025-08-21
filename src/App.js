import React, { useState, useEffect } from "react";
import "./App.css";

const motivationalQuotes = [
  "Stay focused and never give up!",
  "Small steps lead to big success.",
  "Discipline beats motivation.",
  "Your future is created by what you do today.",
  "One task at a time, stay consistent."
];

function App() {
  // Timer
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Settings
  const [focusTime, setFocusTime] = useState(
    parseInt(localStorage.getItem("focusTime")) || 25
  );
  const [shortBreak, setShortBreak] = useState(
    parseInt(localStorage.getItem("shortBreak")) || 5
  );
  const [longBreak, setLongBreak] = useState(
    parseInt(localStorage.getItem("longBreak")) || 15
  );

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);

  // Other
  const [quote, setQuote] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Save settings & theme
  useEffect(() => {
    localStorage.setItem("focusTime", focusTime);
    localStorage.setItem("shortBreak", shortBreak);
    localStorage.setItem("longBreak", longBreak);
    localStorage.setItem("theme", theme);
  }, [focusTime, shortBreak, longBreak, theme]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Session logic
  useEffect(() => {
    if (time === 0) {
      setIsRunning(false);
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

      if (!isBreak) {
        setSessions(sessions + 1);
        if ((sessions + 1) % 4 === 0) {
          alert("🎉 Long Break Time!");
          setTime(longBreak * 60);
        } else {
          alert("☕ Short Break Time!");
          setTime(shortBreak * 60);
        }
      } else {
        alert("Back to Focus 🎯");
        setTime(focusTime * 60);
      }

      setIsBreak(!isBreak);
    }
  }, [time]);

  // Add task
  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Toggle task
  const toggleTask = (i) => {
    const updated = [...tasks];
    updated[i].completed = !updated[i].completed;
    setTasks(updated);
    setCompletedTasks(updated.filter((t) => t.completed).length);
  };

  // Format time
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>🚀 FocusTrack</h1>
        <button
          className="btn theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Timer */}
      <div className="card timer">
        <h2>{isBreak ? "☕ Break" : "🎯 Focus"}</h2>
        <h1>{formatTime(time)}</h1>
        <div className="controls">
          <button onClick={() => setIsRunning(!isRunning)} className="btn primary">
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={() => { setIsRunning(false); setTime(focusTime * 60); }} className="btn danger">
            Reset
          </button>
        </div>
        <p>Session: {sessions}</p>
      </div>

      {/* Settings */}
      <div className="card settings">
        <h2>⚙️ Settings</h2>
        <label>
          Focus Time:
          <input
            type="number"
            value={focusTime}
            onChange={(e) => setFocusTime(e.target.value)}
          /> min
        </label>
        <label>
          Short Break:
          <input
            type="number"
            value={shortBreak}
            onChange={(e) => setShortBreak(e.target.value)}
          /> min
        </label>
        <label>
          Long Break:
          <input
            type="number"
            value={longBreak}
            onChange={(e) => setLongBreak(e.target.value)}
          /> min
        </label>
      </div>

      {/* Quote */}
      {quote && <div className="card quote">💡 {quote}</div>}

      {/* Tasks */}
      <div className="card task-section">
        <h2>✅ My Tasks</h2>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            placeholder="Add a new task..."
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask} className="btn primary">Add</button>gui
        </div>
        <ul>
          {tasks.map((t, i) => (
            <li key={i} onClick={() => toggleTask(i)} className={t.completed ? "completed" : ""}>
              {t.text}
            </li>
          ))}
        </ul>
        <p>Completed: {completedTasks}/{tasks.length}</p>
      </div>
    </div>
  );
}

export default App;
