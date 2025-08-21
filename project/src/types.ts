export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  timeSpent: number;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  completedAt?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Settings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface UserStats {
  totalFocusTime: number;
  tasksCompleted: number;
  pomodorosCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'focus-time' | 'tasks' | 'pomodoros';
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  streak: number;
  focusTime: number;
}

export interface SentimentData {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
}