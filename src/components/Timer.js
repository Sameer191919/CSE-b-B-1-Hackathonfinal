import React, { useState, useEffect } from "react";

function Timer() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">⏱ Timer</h2>
      <p className="text-5xl font-mono mb-6">{formatTime(time)}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setRunning(!running)}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setRunning(false); setTime(0); }}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 hover:scale-105 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;

