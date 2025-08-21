import React from 'react';
import { Settings as SettingsIcon, Clock, Volume2, VolumeX, Play } from 'lucide-react';
import { Settings as SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

export function Settings({ settings, setSettings }: SettingsProps) {
  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const testSound = () => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
            <SettingsIcon className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-blue-200">Customize your productivity experience</p>
      </div>

      {/* Timer Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Timer Configuration</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-200">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={settings.workDuration}
              onChange={(e) => updateSetting('workDuration', parseInt(e.target.value) || 25)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-blue-300">Recommended: 25 minutes</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-200">
              Short Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.shortBreak}
              onChange={(e) => updateSetting('shortBreak', parseInt(e.target.value) || 5)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-blue-300">Recommended: 5 minutes</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-200">
              Long Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.longBreak}
              onChange={(e) => updateSetting('longBreak', parseInt(e.target.value) || 15)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-blue-300">Recommended: 15-30 minutes</p>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          {settings.soundEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
          <span>Audio Settings</span>
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
            <div>
              <h3 className="text-lg font-semibold text-white">Sound Notifications</h3>
              <p className="text-blue-200 text-sm">Play sound when timer sessions end</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={testSound}
                disabled={!settings.soundEnabled}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Play className="w-6 h-6" />
          <span>Automation</span>
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
            <div>
              <h3 className="text-lg font-semibold text-white">Auto-start Breaks</h3>
              <p className="text-blue-200 text-sm">Automatically start break timers when work sessions end</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => updateSetting('autoStartBreaks', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
            <div>
              <h3 className="text-lg font-semibold text-white">Auto-start Work Sessions</h3>
              <p className="text-blue-200 text-sm">Automatically start work timers when breaks end</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => updateSetting('autoStartPomodoros', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">💡 Pro Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100">
          <div className="space-y-2">
            <p>• The Pomodoro Technique uses 25-minute work sessions</p>
            <p>• Take a 5-minute break after each work session</p>
            <p>• Take a longer 15-30 minute break every 4 sessions</p>
          </div>
          <div className="space-y-2">
            <p>• Enable sound notifications to stay on track</p>
            <p>• Auto-start features help maintain flow</p>
            <p>• Adjust durations based on your attention span</p>
          </div>
        </div>
      </div>
    </div>
  );
}