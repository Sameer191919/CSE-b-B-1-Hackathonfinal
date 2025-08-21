import React from "react";

function Quotes() {
  const staticQuotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Success is the sum of small efforts repeated daily.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "The secret of getting ahead is getting started."
  ];

  const random = staticQuotes[Math.floor(Math.random() * staticQuotes.length)];

  return (
    <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl shadow-lg text-center">
      <h3 className="text-xl font-semibold mb-3">💡 Motivation</h3>
      <p className="italic opacity-90">“{random}”</p>
    </div>
  );
}
//hiii
//12345
// If you want to start measuring performance in your app, pass a function
export default Quotes;

