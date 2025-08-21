import React, { useEffect, useState } from "react";

function Stats({ tasks }) {
  const [focusTime, setFocusTime] = useState(0);

  // Load focus time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem("focusTime");
    if (savedTime) setFocusTime(parseInt(savedTime));
  }, []);

  // Save focus time whenever updated
  useEffect(() => {
    localStorage.setItem("focusTime", focusTime);
  }, [focusTime]);

  // Add focus time (this can be updated after each Pomodoro session)
  const addFocusTime = (minutes) => {
    setFocusTime((prev) => prev + minutes);
  };

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div>
      <h3>Daily Stats</h3>
      <p>✅ Tasks Completed: {completedTasks}</p>
      <p>⏳ Focus Time: {focusTime} min</p>
      <button onClick={() => addFocusTime(25)}>+ Add 25min (Demo)</button>
    </div>
  );
}

export default Stats;
