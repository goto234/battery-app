// src/components/Header.tsx
"use client";

import { Battery, Zap, Info } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg sticky top-0 z-40 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Battery className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <Zap className="w-4 h-4 text-yellow-500 absolute top-2 left-2 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Battery Technology Visualizer
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Indian Market Analysis & Decision Support System
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        
        {showInfo && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg animate-slideDown">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">About This Tool</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              A comprehensive battery technology comparison platform designed for the Indian market. 
              Compare 8+ battery technologies across multiple parameters, calculate TCO, and get 
              AI-powered recommendations based on your specific requirements. All prices in ₹ (INR).
            </p>
            <div className="mt-3 flex gap-4 text-xs text-blue-700 dark:text-blue-300">
              <span>📊 Real-time Visualization</span>
              <span>💰 TCO Calculator</span>
              <span>🤖 Smart Recommendations</span>
              <span>📱 Mobile Responsive</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}