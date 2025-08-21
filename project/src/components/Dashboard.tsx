import React from "react";
import {
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import { UserStats, Goal } from "../types";
import ThemeToggle from "./ThemeToggle"; // 

interface DashboardProps {
  userStats: UserStats;
  goals: Goal[];
}

export function Dashboard({ userStats, goals }: DashboardProps) {
  const focusTimeHours = Math.floor(userStats.totalFocusTime / 60);
  const focusTimeMinutes = userStats.totalFocusTime % 60;

  const todayFocusTime =
    goals.find((g) => g.type === "focus-time")?.current || 0;
  const todayTasks = goals.find((g) => g.type === "tasks")?.current || 0;

  const stats = [
    {
      title: "Total Focus Time",
      value: `${focusTimeHours}h ${focusTimeMinutes}m`,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Tasks Completed",
      value: userStats.tasksCompleted.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Pomodoros Done",
      value: userStats.pomodorosCompleted.toString(),
      icon: Target,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Current Streak",
      value: `${userStats.currentStreak} days`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/20",
    },
    {
      title: "Today Focus Time",
      value: `${todayFocusTime}m`,
      icon: Calendar,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-500/20",
    },
    {
      title: "Longest Streak",
      value: `${userStats.longestStreak} days`,
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* ✅ Header with title + theme toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔥 Productivity Tracker</h1>
        <ThemeToggle />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 dark:hover:bg-gray-800/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-blue-200">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Goals Progress */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Today's Progress</h2>

        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = goal.current >= goal.target;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{goal.title}</span>
                  <span
                    className={`text-sm font-semibold ${
                      isCompleted ? "text-green-400" : "text-blue-300"
                    }`}
                  >
                    {goal.current}/{goal.target}{" "}
                    {goal.type === "focus-time"
                      ? "min"
                      : goal.type === "tasks"
                      ? "tasks"
                      : "pomodoros"}
                  </span>
                </div>

                <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : "bg-gradient-to-r from-blue-400 to-teal-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  />

                  {isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs ${
                      isCompleted ? "text-green-400" : "text-blue-300"
                    }`}
                  >
                    {Math.round(progress)}% complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Score */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            Productivity Score
          </h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#productivityGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - Math.min(todayFocusTime / 120, 1))
                }`}
                className="transition-all duration-1000 ease-in-out"
              />
              <defs>
                <linearGradient
                  id="productivityGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06d6a0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {Math.round(Math.min((todayFocusTime / 120) * 100, 100))}%
              </span>
            </div>
          </div>
          <p className="text-center text-blue-200 text-sm">
            Based on focus time and task completion
          </p>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            Achievement Badges
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "First Task",
                emoji: "🎯",
                earned: userStats.tasksCompleted > 0,
              },
              {
                name: "Focus Master",
                emoji: "🧠",
                earned: userStats.totalFocusTime >= 120,
              },
              {
                name: "Streak Keeper",
                emoji: "🔥",
                earned: userStats.currentStreak >= 3,
              },
              {
                name: "Pomodoro Pro",
                emoji: "🍅",
                earned: userStats.pomodorosCompleted >= 10,
              },
            ].map((badge) => (
              <div
                key={badge.name}
                className={`p-3 rounded-2xl text-center transition-all duration-300 ${
                  badge.earned
                    ? "bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <div className="text-2xl mb-1">{badge.emoji}</div>
                <div
                  className={`text-xs font-medium ${
                    badge.earned ? "text-yellow-300" : "text-gray-400"
                  }`}
                >
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
