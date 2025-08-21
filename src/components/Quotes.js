import React, { useState, useEffect } from "react";

export default function Quotes() {
  const quotes = [
    "Stay focused and never give up!",
    "Discipline is the key to success.",
    "Small steps every day lead to big results.",
    "Your future self will thank you."
  ];
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow text-center italic">
      <p>"{quote}"</p>
    </div>
  );
}
