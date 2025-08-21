import React, { useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask }]);
      setNewTask("");
    }
  };

  const removeTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📝 Your Tasks</h2>

      <div className="flex mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-2 rounded-l-lg text-black"
          placeholder="Enter a new task..."
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-r-lg hover:scale-105 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-3 bg-white/20 rounded-lg"
          >
            <span>{task.text}</span>
            <button
              onClick={() => removeTask(task.id)}
              className="text-red-400 hover:text-red-600 transition"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
