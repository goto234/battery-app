"use client";

import { useState } from "react";
import ControlsAxes from "@/components/ControlsAxes";
import ChartBubble from "@/components/ChartBubble";
import { Sun, Moon, Info, BarChart3 } from 'lucide-react';

export default function Home() {
  const [axes, setAxes] = useState<{ xKey: string; yKey: string }>({
    xKey: "energyDensity_Whkg",
    yKey: "cost_INRperkWh", // Changed to INR
  });
  
  const [isDark, setIsDark] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const bgClass = isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const cardClass = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

  return (
    <main className={`min-h-screen ${bgClass} transition-all duration-300`}>
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        
        {/* Enhanced Header */}
        <header className={`${cardClass} rounded-2xl shadow-xl p-6`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Indian Battery Market Analyzer</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare battery technologies for Indian applications • Pricing in ₹INR • Market insights
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Show info"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showInfo && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">How to use this tool:</h3>
              <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Select X and Y axes to explore different trade-offs</li>
                <li>• Bubble size represents cycle life (larger = more durable)</li>
                <li>• Hover over bubbles for detailed information</li>
                <li>• All costs shown in Indian Rupees (₹/kWh)</li>
                <li>• Applications and market share data specific to India</li>
              </ul>
            </div>
          )}
        </header>

        {/* Enhanced Controls */}
        <div className={`${cardClass} rounded-2xl shadow-xl p-6`}>
          <h2 className="text-lg font-semibold mb-4">📊 Select Parameters to Compare</h2>
          <ControlsAxes
            xKey={axes.xKey}
            yKey={axes.yKey}
            onChange={(patch) => setAxes((prev) => ({ ...prev, ...patch }))}
            isDark={isDark}
          />
        </div>

        {/* Enhanced Chart */}
        <ChartBubble 
          xKey={axes.xKey as any} 
          yKey={axes.yKey as any} 
          isDark={isDark}
        />

        {/* Key Insights */}
        <div className={`${cardClass} rounded-2xl shadow-xl p-6`}>
          <h2 className="text-xl font-bold mb-4">💡 Key Insights for Indian Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200">Cost Leaders</h3>
              <p className="text-green-700 dark:text-green-300">Lead-Acid remains cheapest at ₹10.4k/kWh, dominating UPS and telecom sectors</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">EV Growth</h3>
              <p className="text-blue-700 dark:text-blue-300">Li-ion driving India's EV adoption with 25% market share</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Climate Resilient</h3>
              <p className="text-purple-700 dark:text-purple-300">LFP ideal for Indian heat - 80°C range, 3500 cycles</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}