import React, { useState } from 'react';
import { Plus, Target, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export function Goals({ goals, setGoals }: GoalsProps) {
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    type: 'focus-time' as Goal['type']
  });

  const addGoal = () => {
    if (newGoal.title.trim() && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: newGoal.target,
        current: 0,
        type: newGoal.type
      };
      
      setGoals([...goals, goal]);
      setNewGoal({ title: '', target: 0, type: 'focus-time' });
    }
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const getTypeLabel = (type: Goal['type']) => {
    switch (type) {
      case 'focus-time': return 'Focus Time (minutes)';
      case 'tasks': return 'Tasks';
      case 'pomodoros': return 'Pomodoros';
    }
  };

  const getTypeIcon = (type: Goal['type']) => {
    switch (type) {
      case 'focus-time': return '⏰';
      case 'tasks': return '✅';
      case 'pomodoros': return '🍅';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add Goal Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Target className="w-6 h-6" />
          <span>Set New Goal</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Goal title..."
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
          <select
            value={newGoal.type}
            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })}
            className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="focus-time" className="bg-slate-800">Focus Time</option>
            <option value="tasks" className="bg-slate-800">Tasks</option>
            <option value="pomodoros" className="bg-slate-800">Pomodoros</option>
          </select>
          
          <input
            type="number"
            placeholder="Target..."
            min="1"
            value={newGoal.target || ''}
            onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
            className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={addGoal}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div
              key={goal.id}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(goal.type)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{goal.title}</h3>
                    <p className="text-blue-200 text-sm">{getTypeLabel(goal.type)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isCompleted && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Completed!</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Progress</span>
                  <span className={`text-sm font-semibold ${
                    isCompleted ? 'text-green-400' : 'text-blue-300'
                  }`}>
                    {goal.current}/{goal.target} {goal.type === 'focus-time' ? 'min' : goal.type}
                  </span>
                </div>
                
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : 'bg-gradient-to-r from-blue-400 to-teal-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="text-right">
                  <span className={`text-sm ${isCompleted ? 'text-green-400' : 'text-blue-300'}`}>
                    {Math.round(progress)}% complete
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">No goals set</h3>
            <p className="text-blue-200">Set your first goal to start tracking your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}