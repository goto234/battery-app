// src/components/ChartContainer.tsx
"use client";

import { useState } from 'react';
import { useBatteryStore } from '@/store/batteryStore';
import BubbleChart from './charts/BubbleChart';
import RadarChart from './charts/RadarChart';
import BarChart from './charts/BarChart';
import ScatterChart from './charts/ScatterChart';
import { METRIC_INFO } from '@/utils/calculations';
import { 
  ChartCircle, BarChart3, Radar, ScatterChart as ScatterIcon,
  Settings2, Maximize2, Download
} from 'lucide-react';

export default function ChartContainer() {
  const { chartConfig, setChartConfig, filteredBatteries } = useBatteryStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartTypes = [
    { value: 'bubble', label: 'Bubble Chart', icon: ChartCircle },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterIcon },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'radar', label: 'Radar Chart', icon: Radar },
  ] as const;

  const renderChart = () => {
    switch (chartConfig.chartType) {
      case 'bubble':
        return <BubbleChart data={filteredBatteries} config={chartConfig} />;
      case 'radar':
        return <RadarChart data={filteredBatteries} />;
      case 'bar':
        return <BarChart data={filteredBatteries} metric={chartConfig.xAxis} />;
      case 'scatter':
        return <ScatterChart data={filteredBatteries} config={chartConfig} />;
      default:
        return <BubbleChart data={filteredBatteries} config={chartConfig} />;
    }
  };

  return (
    <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Controls */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Visualization Controls
          </h2>
          
          <div className="flex gap-2">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartConfig({ chartType: type.value as any })}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  chartConfig.chartType === type.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <type.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            ))}
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Axis Controls */}
        {(chartConfig.chartType === 'bubble' || chartConfig.chartType === 'scatter') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                X-Axis
              </label>
              <select
                value={chartConfig.xAxis}
                onChange={(e) => setChartConfig({ xAxis: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(METRIC_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Y-Axis
              </label>
              <select
                value={chartConfig.yAxis}
                onChange={(e) => setChartConfig({ yAxis: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(METRIC_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>
            
            {chartConfig.chartType === 'bubble' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bubble Size
                </label>
                <select
                  value={chartConfig.bubbleSize}
                  onChange={(e) => setChartConfig({ bubbleSize: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(METRIC_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {chartConfig.chartType === 'bar' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Metric to Display
            </label>
            <select
              value={chartConfig.xAxis}
              onChange={(e) => setChartConfig({ xAxis: e.target.value as any })}
              className="w-full md:w-1/3 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(METRIC_INFO).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'}`}>
          {renderChart()}
        </div>
        
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <p>💡 Tip: Hover over data points for detailed information. {filteredBatteries.length} batteries displayed.</p>
        </div>
      </div>
    </div>
  );
}