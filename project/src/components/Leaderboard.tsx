import React from 'react';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { UserStats } from '../types';

interface LeaderboardProps {
  userStats: UserStats;
}

export function Leaderboard({ userStats }: LeaderboardProps) {
  const calculateScore = (stats: UserStats) => {
    return stats.totalFocusTime * 2 + stats.tasksCompleted * 50 + stats.currentStreak * 25;
  };

  const generateLeaderboard = () => {
    const mockUsers = [
      { name: "", score: calculateScore(userStats), streak: userStats.currentStreak, focusTime: userStats.totalFocusTime, isCurrentUser: true },
      { name: "Sai Pranathi", score: 2450, streak: 15, focusTime: 1800, isCurrentUser: false},
      { name: "Rimsha", score: 2380, streak: 12, focusTime: 1650, isCurrentUser: false },
      { name: "Nishitha", score: 2340, streak: 18, focusTime: 1920, isCurrentUser: false },
      { name: "Sahasra", score: 2290, streak: 8, focusTime: 1420, isCurrentUser: false },
      { name: "Narendra", score: 2180, streak: 22, focusTime: 2100, isCurrentUser: false },
      { name: "Rama Chary", score: 2150, streak: 6, focusTime: 1380, isCurrentUser: false },
      { name: "Pavan Sai", score: 2080, streak: 14, focusTime: 1560, isCurrentUser: false },
    ];
    return mockUsers.sort((a, b) => b.score - a.score);
  };

  const leaderboard = generateLeaderboard();
  const currentUserRank = leaderboard.findIndex(user => user.isCurrentUser) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-400" />;
      default: return <Star className="w-6 h-6 text-blue-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return "from-yellow-400 to-yellow-500";
      case 2: return "from-gray-300 to-gray-400";
      case 3: return "from-orange-400 to-orange-500";
      default: return "from-blue-400 to-blue-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Local Leaderboard</h1>
        <p className="text-blue-200">Compete with others and track your productivity ranking</p>
      </div>

      {/* Current User Rank */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Your Ranking</h2>
        
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            {/* Show NAME here instead of icon */}
            <div className="text-xl font-bold text-white mb-1">
              {leaderboard[currentUserRank - 1]?.name}
            </div>
            <div className="text-3xl font-bold text-white">#{currentUserRank}</div>
            <div className="text-blue-200 text-sm">Your Rank</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{calculateScore(userStats)}</div>
            <div className="text-blue-200 text-sm">Your Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{userStats.currentStreak}</div>
            <div className="text-blue-200 text-sm">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-xl font-bold text-white mb-6">Top Performers</h2>
        
        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.isCurrentUser;
            
            return (
              <div
                key={user.name}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-blue-500/20 to-teal-500/20 border-2 border-blue-400/30'
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                {/* Move Icon to LEFT */}
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${getRankBadge(rank)}`}>
                    {getRankIcon(rank)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                        {user.name}
                      </h3>
                      {isCurrentUser && (
                        <span className="px-2 py-1 bg-blue-500/30 text-blue-200 text-xs rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-blue-200">
                      <span>🔥 {user.streak} days</span>
                      <span>⏰ {Math.round(user.focusTime / 60)}h</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">#{rank}</div>
                  <div className="text-sm text-blue-200">{user.score.toLocaleString()} pts</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoring System (same as before) */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">How Scoring Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <div className="text-2xl mb-2">⏰</div>
            <h3 className="font-semibold text-white mb-1">Focus Time</h3>
            <p className="text-blue-200 text-sm">2 points per minute</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-semibold text-white mb-1">Tasks Completed</h3>
            <p className="text-blue-200 text-sm">50 points each</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <div className="text-2xl mb-2">🔥</div>
            <h3 className="font-semibold text-white mb-1">Daily Streak</h3>
            <p className="text-blue-200 text-sm">25 points per day</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-xl">
          <p className="text-blue-100 text-sm text-center">
            💡 Tip: Maintain consistent daily activity to climb the rankings!
          </p>
        </div>
      </div>
    </div>
  );
}
//sameer 