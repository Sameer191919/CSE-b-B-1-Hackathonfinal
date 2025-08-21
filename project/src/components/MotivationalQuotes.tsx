import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface MotivationalQuotesProps {
  onClose: () => void;
}

export function MotivationalQuotes({ onClose }: MotivationalQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const quotes = [
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Don't be afraid to give yourself everything you've ever wanted in life.",
      author: "Unknown"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins"
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    }
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(randomIndex);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  const quote = quotes[currentQuote];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">✨ Take a Moment</h2>
            <p className="text-blue-200">You've earned this break! Here's some inspiration:</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center py-8">
          <blockquote className="text-2xl font-light text-white leading-relaxed mb-6">
            "{quote.text}"
          </blockquote>
          <cite className="text-blue-300 font-medium text-lg">— {quote.author}</cite>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={getRandomQuote}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Quote</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            Continue Break
          </button>
        </div>

        {/* Break reminder */}
        <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-xl text-center">
          <p className="text-blue-100 text-sm">
            🧠 Remember to stretch, hydrate, and rest your eyes during this break!
          </p>
        </div>
      </div>
    </div>
  );
}