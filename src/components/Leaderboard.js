import React, { useState, useEffect } from "react";

function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("leaderboard")) || [];
    setScores(saved);
  }, []);

  const addScore = () => {
    const newScores = [...scores, { name: "You", score: Math.floor(Math.random() * 100) }];
    setScores(newScores);
    localStorage.setItem("leaderboard", JSON.stringify(newScores));
  };

  return (
    <div>
      <h3>🏆 Leaderboard</h3>
      <button onClick={addScore}>Add Random Score (Demo)</button>
      <ul>
        {scores.map((s, i) => (
          <li key={i}>{s.name} - {s.score}</li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
