import React from 'react';
import { Flame, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { UserStats } from '../types';

interface StreakTrackerProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export function StreakTracker({ userStats }: StreakTrackerProps) {
  const getStreakMessage = () => {
    if (userStats.currentStreak === 0) {
      return "Start your productivity journey today!";
    } else if (userStats.currentStreak < 3) {
      return "Great start! Keep building your streak.";
    } else if (userStats.currentStreak < 7) {
      return "You're on fire! Consistency is key.";
    } else if (userStats.currentStreak < 30) {
      return "Amazing dedication! You're a productivity champion.";
    } else {
      return "Legendary! You're a true productivity master.";
    }
  };

  const getStreakLevel = () => {
    if (userStats.currentStreak < 3) return { level: "Beginner", color: "from-blue-400 to-blue-500" };
    if (userStats.currentStreak < 7) return { level: "Motivated", color: "from-green-400 to-green-500" };
    if (userStats.currentStreak < 30) return { level: "Consistent", color: "from-orange-400 to-orange-500" };
    return { level: "Master", color: "from-purple-400 to-purple-500" };
  };

  const streakLevel = getStreakLevel();
  const progressToNextLevel = userStats.currentStreak < 3 ? 
    (userStats.currentStreak / 3) * 100 : 
    userStats.currentStreak < 7 ?
    ((userStats.currentStreak - 3) / 4) * 100 :
    userStats.currentStreak < 30 ?
    ((userStats.currentStreak - 7) / 23) * 100 : 100;

  // Generate calendar view for last 30 days
  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Simulate activity based on current streak and some randomness
      const daysSinceToday = i;
      const hasActivity = daysSinceToday < userStats.currentStreak || 
                         (Math.random() > 0.3 && userStats.totalFocusTime > 0);
      
      days.push({
        date: date.getDate(),
        hasActivity,
        isToday: i === 0
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendar();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Streak Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
        <div className="flex justify-center mb-6">
          <div className={`p-6 rounded-full bg-gradient-to-r ${streakLevel.color} shadow-lg`}>
            <Flame className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-2">{userStats.currentStreak}</h1>
        <p className="text-2xl text-blue-200 mb-4">Day Streak</p>
        
        <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${streakLevel.color} text-white font-medium mb-6`}>
          <Trophy className="w-5 h-5 mr-2" />
          {streakLevel.level} Level
        </div>
        
        <p className="text-lg text-blue-200 max-w-md mx-auto">
          {getStreakMessage()}
        </p>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-orange-500/20">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{userStats.currentStreak}</h3>
          <p className="text-blue-200">Current Streak</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-purple-500/20">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{userStats.longestStreak}</h3>
          <p className="text-blue-200">Longest Streak</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-teal-500/20">
              <TrendingUp className="w-8 h-8 text-teal-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{Math.round(progressToNextLevel)}%</h3>
          <p className="text-blue-200">To Next Level</p>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-6 h-6" />
          <span>30-Day Activity</span>
        </h2>
        
        <div className="grid grid-cols-10 gap-2 mb-4">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                day.hasActivity
                  ? day.isToday
                    ? 'bg-gradient-to-br from-blue-400 to-teal-400 text-white shadow-lg transform scale-110'
                    : 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                  : 'bg-white/10 text-blue-300'
              }`}
            >
              {day.date}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-white/10"></div>
            <span className="text-blue-200">No activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
            <span className="text-blue-200">Activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-400 to-teal-400"></div>
            <span className="text-blue-200">Today</span>
          </div>
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Streak Milestones</h2>
        
        <div className="space-y-4">
          {[
            { days: 3, title: "First Steps", emoji: "🎯", achieved: userStats.longestStreak >= 3 },
            { days: 7, title: "One Week Wonder", emoji: "⭐", achieved: userStats.longestStreak >= 7 },
            { days: 30, title: "Monthly Master", emoji: "🏆", achieved: userStats.longestStreak >= 30 },
            { days: 100, title: "Century Champion", emoji: "💎", achieved: userStats.longestStreak >= 100 },
          ].map((milestone) => (
            <div
              key={milestone.days}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                milestone.achieved
                  ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{milestone.emoji}</span>
                <div>
                  <h3 className={`font-semibold ${milestone.achieved ? 'text-yellow-300' : 'text-white'}`}>
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-blue-200">{milestone.days} day streak</p>
                </div>
              </div>
              
              {milestone.achieved && (
                <div className="flex items-center space-x-1 text-green-400">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Achieved</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}