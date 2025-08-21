import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { Goals } from './components/Goals';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { StreakTracker } from './components/StreakTracker';
import { SentimentAnalysis } from './components/SentimentAnalysis';
import { 
  Clock, 
  CheckSquare, 
  BarChart3, 
  Target, 
  Trophy, 
  Settings as SettingsIcon,
  Flame,
  Brain
} from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Settings as SettingsType, UserStats, Goal } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<string>('login'); // default to login
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [settings, setSettings] = useLocalStorage<SettingsType>('settings', {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  });
  const [userStats, setUserStats] = useLocalStorage<UserStats>('userStats', {
    totalFocusTime: 0,
    tasksCompleted: 0,
    pomodorosCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date().toDateString(),
  });
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', [
    { id: '1', title: 'Focus for 2 hours daily', target: 120, current: 0, type: 'focus-time' },
    { id: '2', title: 'Complete 5 tasks daily', target: 5, current: 0, type: 'tasks' },
  ]);

  const tabs = [
    { id: 'timer', name: 'Timer', icon: Clock },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'streaks', name: 'Streaks', icon: Flame },
    { id: 'sentiment', name: 'AI Insights', icon: Brain },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];

  // Reset daily goals + streak logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (userStats.lastActivityDate !== today) {
      const resetGoals = goals.map(goal => ({ ...goal, current: 0 }));
      setGoals(resetGoals);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = userStats.lastActivityDate === yesterday.toDateString();

      setUserStats(prev => ({
        ...prev,
        currentStreak: wasYesterday ? prev.currentStreak : 0,
        lastActivityDate: today,
      }));
    }
  }, [userStats.lastActivityDate, goals, setGoals, setUserStats]);

  // Login Page
  const LoginPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:outline-none" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:outline-none" />
          <button 
            type="button" 
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => setActiveTab('timer')}
          >
            Login
          </button>
        </form>
        <p className="text-blue-200 text-center mt-4">
          Don’t have an account?{" "}
          <button className="text-teal-400 underline" onClick={() => setActiveTab('signup')}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );

  // Sign Up Page
  const SignupPage = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:outline-none" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:outline-none" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:outline-none" />
          <button 
            type="button" 
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => setActiveTab('timer')}
          >
            Sign Up
          </button>
        </form>
        <p className="text-blue-200 text-center mt-4">
          Already have an account?{" "}
          <button className="text-teal-400 underline" onClick={() => setActiveTab('login')}>
            Login
          </button>
        </p>
      </div>
    </div>
  );

  if (activeTab === 'login') return <LoginPage />;
  if (activeTab === 'signup') return <SignupPage />;

  // Main App Layout (after login/signup)
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800' : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header with Dark/Light Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Focus Flow Pro
            </h1>
            <p className="text-blue-200">AI-Powered Productivity & Time Management</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="ml-4 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'timer' && (
            <Timer 
              settings={settings}
              onStatsUpdate={setUserStats}
              onGoalUpdate={setGoals}
              goals={goals}
            />
          )}
          {activeTab === 'tasks' && (
            <TaskList 
              tasks={tasks}
              setTasks={setTasks}
              onStatsUpdate={setUserStats}
              onGoalUpdate={setGoals}
              goals={goals}
            />
          )}
          {activeTab === 'dashboard' && <Dashboard userStats={userStats} goals={goals} />}
          {activeTab === 'goals' && <Goals goals={goals} setGoals={setGoals} />}
          {activeTab === 'streaks' && <StreakTracker userStats={userStats} setUserStats={setUserStats} />}
          {activeTab === 'sentiment' && <SentimentAnalysis tasks={tasks} />}
          {activeTab === 'leaderboard' && <Leaderboard userStats={userStats} />}
          {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
        </div>
      </div>
    </div>
  );
}

export default App;