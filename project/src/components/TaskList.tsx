import React, { useState } from 'react';
import { Plus, Clock, Flag, Check, Trash2, Edit3 } from 'lucide-react';
import { Task, UserStats, Goal } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onStatsUpdate: React.Dispatch<React.SetStateAction<UserStats>>;
  onGoalUpdate: React.Dispatch<React.SetStateAction<Goal[]>>;
  goals: Goal[];
}

export function TaskList({ tasks, setTasks, onStatsUpdate, onGoalUpdate }: TaskListProps) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimatedTime: 25,
    priority: 'medium' as const,
    category: 'Work'
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        timeSpent: 0,
        estimatedTime: newTask.estimatedTime,
        priority: newTask.priority,
        category: newTask.category,
        createdAt: new Date().toISOString(),
      };
      
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        estimatedTime: 25,
        priority: 'medium',
        category: 'Work'
      });
    }
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : undefined
          }
        : t
    ));

    if (!task.completed) {
      // Task completed
      onStatsUpdate(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
      }));

      onGoalUpdate(prevGoals =>
        prevGoals.map(goal =>
          goal.type === 'tasks'
            ? { ...goal, current: goal.current + 1 }
            : goal
        )
      );
    } else {
      // Task uncompleted
      onStatsUpdate(prev => ({
        ...prev,
        tasksCompleted: Math.max(0, prev.tasksCompleted - 1),
      }));

      onGoalUpdate(prevGoals =>
        prevGoals.map(goal =>
          goal.type === 'tasks'
            ? { ...goal, current: Math.max(0, goal.current - 1) }
            : goal
        )
      );
    }
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.completed) {
      onStatsUpdate(prev => ({
        ...prev,
        tasksCompleted: Math.max(0, prev.tasksCompleted - 1),
      }));
    }
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending': return !task.completed;
      case 'completed': return task.completed;
      default: return true;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add Task Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Task</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Work" className="bg-slate-800">Work</option>
            <option value="Study" className="bg-slate-800">Study</option>
            <option value="Personal" className="bg-slate-800">Personal</option>
            <option value="Health" className="bg-slate-800">Health</option>
          </select>
        </div>

        <textarea
          placeholder="Task description (optional)..."
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-4"
          rows={3}
        />

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <input
              type="number"
              min="5"
              max="480"
              value={newTask.estimatedTime}
              onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })}
              className="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded-lg text-white text-center"
            />
            <span className="text-blue-200">minutes</span>
          </div>

          <div className="flex items-center space-x-2">
            <Flag className="w-4 h-4 text-blue-400" />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="px-3 py-1 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none"
            >
              <option value="low" className="bg-slate-800">Low</option>
              <option value="medium" className="bg-slate-800">Medium</option>
              <option value="high" className="bg-slate-800">High</option>
            </select>
          </div>
        </div>

        <button
          onClick={addTask}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-2">
        {(['all', 'pending', 'completed'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === filterType
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 ${
              task.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-white/20 text-blue-200 hover:bg-white/30'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      task.completed ? 'line-through text-blue-300' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-blue-200 text-sm mt-1">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-blue-200">{task.category}</span>
                  <span className="text-blue-200">{task.estimatedTime}min</span>
                  {task.timeSpent > 0 && (
                    <span className="text-teal-300">Spent: {task.timeSpent}min</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingTask(task.id)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
            <p className="text-blue-200">
              {filter === 'all' ? 'Add your first task to get started!' : `No ${filter} tasks.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}