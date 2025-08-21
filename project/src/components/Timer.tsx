import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { Settings, UserStats, Goal } from '../types';
import { MotivationalQuotes } from './MotivationalQuotes';

interface TimerProps {
  settings: Settings;
  onStatsUpdate: React.Dispatch<React.SetStateAction<UserStats>>;
  onGoalUpdate: React.Dispatch<React.SetStateAction<Goal[]>>;
  goals: Goal[];
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export function Timer({ settings, onStatsUpdate, onGoalUpdate, goals }: TimerProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showQuotes, setShowQuotes] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const modes = {
    work: { duration: settings.workDuration * 60, label: 'Focus Time', color: 'from-red-500 to-orange-500', icon: Zap },
    shortBreak: { duration: settings.shortBreak * 60, label: 'Short Break', color: 'from-green-500 to-teal-500', icon: Coffee },
    longBreak: { duration: settings.longBreak * 60, label: 'Long Break', color: 'from-blue-500 to-indigo-500', icon: Coffee },
  };

  useEffect(() => {
    setTimeLeft(modes[mode].duration);
  }, [mode, settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      if (settings.soundEnabled) {
        playNotification();
      }
      
      if (mode === 'work') {
        // Update stats for completed pomodoro
        setPomodoroCount(prev => prev + 1);
        onStatsUpdate(prev => ({
          ...prev,
          pomodorosCompleted: prev.pomodorosCompleted + 1,
          totalFocusTime: prev.totalFocusTime + settings.workDuration,
          currentStreak: prev.currentStreak + 1,
          longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
        }));

        // Update goals
        onGoalUpdate(prevGoals => 
          prevGoals.map(goal => 
            goal.type === 'focus-time' 
              ? { ...goal, current: goal.current + settings.workDuration }
              : goal.type === 'pomodoros'
              ? { ...goal, current: goal.current + 1 }
              : goal
          )
        );

        // Switch to break
        const nextMode = (pomodoroCount + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setShowQuotes(true);
      } else {
        // Break completed, back to work
        setMode('work');
        setShowQuotes(false);
      }

      setIsActive(settings.autoStartBreaks || settings.autoStartPomodoros);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, settings, pomodoroCount, onStatsUpdate, onGoalUpdate]);

  const playNotification = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  const ModeIcon = modes[mode].icon;

  return (
    <div className="max-w-2xl mx-auto">
      {showQuotes && (mode === 'shortBreak' || mode === 'longBreak') && (
        <MotivationalQuotes onClose={() => setShowQuotes(false)} />
      )}
      
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${modes[mode].color} text-white mb-4`}>
            <ModeIcon className="w-5 h-5" />
            <span className="font-medium">{modes[mode].label}</span>
          </div>
          
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-in-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start</span>
                </>
              )}
            </button>
            
            <button
              onClick={resetTimer}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <div className="text-2xl font-bold text-white">{pomodoroCount}</div>
            <div className="text-sm text-blue-200">Today's Sessions</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
            <div className="text-sm text-blue-200">Progress</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-2xl">
            <div className="text-2xl font-bold text-white">
              {goals.find(g => g.type === 'focus-time')?.current || 0}m
            </div>
            <div className="text-sm text-blue-200">Focus Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}