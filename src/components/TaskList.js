import React, { useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  return (
    <div className="p-6 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">📝 Task List</h2>
      <div className="flex space-x-2 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border"
          placeholder="Add a new task..."
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li
            key={i}
            className={`flex items-center justify-between px-3 py-2 rounded-xl ${
              t.completed ? "bg-green-100 line-through" : "bg-gray-100"
            }`}
          >
            <span>{t.text}</span>
            <button
              onClick={() => toggleTask(i)}
              className="px-3 py-1 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
            >
              {t.completed ? "Undo" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

