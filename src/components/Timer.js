import React, { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setOnBreak(!onBreak);
            new Audio(
              "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3"
            ).play();
            return onBreak ? 25 * 60 : 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, onBreak]);

  const formatTime = (secs) =>
    `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(
      secs % 60
    ).padStart(2, "0")}`;

  return (
    <div className="p-6 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">
        {onBreak ? "☕ Break Time" : "💻 Focus Time"}
      </h2>
      <div className="text-5xl font-mono mb-4">{formatTime(timeLeft)}</div>
      <div className="space-x-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 rounded-xl shadow bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
            setOnBreak(false);
          }}
          className="px-4 py-2 rounded-xl shadow bg-red-500 text-white hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
