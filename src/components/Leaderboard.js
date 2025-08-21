import React from "react";

export default function Leaderboard() {
  const sample = [
    { name: "You", points: 120 },
    { name: "Alice", points: 100 },
    { name: "Bob", points: 80 },
  ];

  return (
    <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-2">🏆 Leaderboard</h2>
      <ul className="space-y-1">
        {sample.map((u, i) => (
          <li key={i} className="flex justify-between">
            <span>{u.name}</span>
            <span>{u.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}



