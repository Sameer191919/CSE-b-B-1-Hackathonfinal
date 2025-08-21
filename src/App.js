import React from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import Quotes from "./components/Quotes";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 text-white flex flex-col items-center p-6">
      
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">⏳ Task Timer App</h1>
        <p className="text-lg opacity-80">Stay focused. Stay productive. Stay inspired ✨</p>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Side - Timer + Quotes */}
        <div className="space-y-6">
          <Timer />
          <Quotes />
        </div>

        {/* Right Side - Task List */}
        <TaskList />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm opacity-70">
        🚀 Made with ❤️ by Batch B1
      </footer>
    </div>
  );
}

export default App;
