import React, { useState, useEffect } from "react";

function Goals() {
  const [goal, setGoal] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    if (savedGoal) setGoal(parseInt(savedGoal));
  }, []);

  const updateGoal = () => {
    localStorage.setItem("dailyGoal", goal);
  };

  return (
    <div>
      <h3>Daily Goal</h3>
      <input
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button onClick={updateGoal}>Save Goal</button>
      <p>Progress: {progress}/{goal} tasks</p>
      <progress value={progress} max={goal}></progress>
    </div>
  );
}

export default Goals;
