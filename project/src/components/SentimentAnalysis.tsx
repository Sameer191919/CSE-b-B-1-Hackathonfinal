import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { Task } from '../types';

interface SentimentAnalysisProps {
  tasks: Task[];
}

interface SentimentResult {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  insights: string[];
  recommendations: string[];
}

export function SentimentAnalysis({ tasks }: SentimentAnalysisProps) {
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate AI sentiment analysis (replace with actual Together.ai integration)
  const analyzeSentiment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock sentiment analysis based on task completion and patterns
      const completedTasks = tasks.filter(t => t.completed).length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

      // Analyze task titles for sentiment keywords
      const taskText = tasks.map(t => `${t.title} ${t.description || ''}`).join(' ').toLowerCase();
      
      const positiveWords = ['success', 'achieve', 'complete', 'finish', 'done', 'great', 'good', 'important'];
      const negativeWords = ['urgent', 'deadline', 'problem', 'fix', 'issue', 'difficult', 'hard', 'stress'];
      
      const positiveCount = positiveWords.reduce((count, word) => 
        count + (taskText.split(word).length - 1), 0);
      const negativeCount = negativeWords.reduce((count, word) => 
        count + (taskText.split(word).length - 1), 0);

      // Calculate sentiment score
      let score = 0.5; // neutral baseline
      score += completionRate * 0.4; // completion rate influence
      score += (positiveCount - negativeCount) * 0.1; // word sentiment influence
      
      // Add some randomness for demo
      score += (Math.random() - 0.5) * 0.2;
      score = Math.max(0, Math.min(1, score)); // clamp between 0 and 1

      const overall = score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral';

      const insights = [];
      const recommendations = [];

      if (completionRate > 0.7) {
        insights.push("High task completion rate indicates strong productivity");
      } else if (completionRate < 0.3) {
        insights.push("Low completion rate suggests potential focus challenges");
      }

      if (positiveCount > negativeCount) {
        insights.push("Task descriptions show positive goal-oriented language");
      } else if (negativeCount > positiveCount) {
        insights.push("Task descriptions indicate high-stress or urgent work");
        recommendations.push("Consider breaking down urgent tasks into smaller steps");
      }

      if (overall === 'positive') {
        recommendations.push("Maintain current productivity momentum");
        recommendations.push("Consider setting more challenging goals");
      } else if (overall === 'negative') {
        recommendations.push("Take regular breaks to manage stress");
        recommendations.push("Focus on completing easier tasks first to build momentum");
      } else {
        recommendations.push("Try time-blocking to improve focus");
        recommendations.push("Set specific, achievable daily goals");
      }

      setSentiment({
        overall,
        score,
        insights: insights.length > 0 ? insights : ["Analyzing your productivity patterns..."],
        recommendations: recommendations.length > 0 ? recommendations : ["Keep tracking your tasks for better insights"]
      });

    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      analyzeSentiment();
    }
  }, [tasks]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-8 h-8 text-green-400" />;
      case 'negative': return <TrendingDown className="w-8 h-8 text-red-400" />;
      default: return <Minus className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'from-green-400 to-green-500';
      case 'negative': return 'from-red-400 to-red-500';
      default: return 'from-yellow-400 to-yellow-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Productivity Insights</h1>
        <p className="text-blue-200">Understanding your work patterns with artificial intelligence</p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Data to Analyze</h3>
          <p className="text-blue-200">Add some tasks to get AI-powered insights about your productivity patterns.</p>
        </div>
      ) : loading ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <RefreshCw className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Data...</h3>
          <p className="text-blue-200">Our AI is processing your tasks and productivity patterns.</p>
        </div>
      ) : error ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="text-red-400 mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Analysis Error</h3>
          <p className="text-blue-200 mb-4">{error}</p>
          <button
            onClick={analyzeSentiment}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      ) : sentiment && (
        <>
          {/* Overall Sentiment */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full bg-gradient-to-r ${getSentimentColor(sentiment.overall)} shadow-lg`}>
                {getSentimentIcon(sentiment.overall)}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 capitalize">{sentiment.overall} Productivity</h2>
            <p className="text-blue-200 mb-6">Overall sentiment score: {Math.round(sentiment.score * 100)}%</p>
            
            <div className="relative w-full h-4 bg-white/20 rounded-full overflow-hidden mb-4">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getSentimentColor(sentiment.overall)} transition-all duration-1000`}
                style={{ width: `${sentiment.score * 100}%` }}
              />
            </div>
            
            <button
              onClick={analyzeSentiment}
              className="flex items-center space-x-2 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Analysis</span>
            </button>
          </div>

          {/* Insights and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Insights</span>
              </h3>
              
              <div className="space-y-3">
                {sentiment.insights.map((insight, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-xl">
                    <p className="text-blue-100 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                <span>Recommendations</span>
              </h3>
              
              <div className="space-y-3">
                {sentiment.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-xl">
                    <p className="text-blue-100 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Analysis Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Task Analysis Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-2xl">
                <div className="text-2xl font-bold text-white">{tasks.length}</div>
                <div className="text-sm text-blue-200">Total Tasks</div>
              </div>
              
              <div className="text-center p-4 bg-white/10 rounded-2xl">
                <div className="text-2xl font-bold text-green-400">{tasks.filter(t => t.completed).length}</div>
                <div className="text-sm text-blue-200">Completed</div>
              </div>
              
              <div className="text-center p-4 bg-white/10 rounded-2xl">
                <div className="text-2xl font-bold text-yellow-400">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-sm text-blue-200">Pending</div>
              </div>
              
              <div className="text-center p-4 bg-white/10 rounded-2xl">
                <div className="text-2xl font-bold text-blue-400">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-200">Success Rate</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}