// src/components/charts/BubbleChart.tsx
"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Label,
  Legend,
} from 'recharts';
import { Battery, ChartConfig } from '@/types/battery';
import { formatValue, METRIC_INFO } from '@/utils/calculations';

interface BubbleChartProps {
  data: Battery[];
  config: ChartConfig;
}

export default function BubbleChart({ data, config }: BubbleChartProps) {
  const chartData = data.map((battery) => ({
    name: battery.name,
    x: battery[config.xAxis] as number,
    y: battery[config.yAxis] as number,
    z: battery[config.bubbleSize] as number,
    color: battery.color,
    battery,
  }));

  const xInfo = METRIC_INFO[config.xAxis];
  const yInfo = METRIC_INFO[config.yAxis];
  const zInfo = METRIC_INFO[config.bubbleSize];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const battery = payload[0].payload.battery as Battery;
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 animate-fadeIn">
          <h3 className="font-bold text-lg mb-2" style={{ color: battery.color }}>
            {battery.name}
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{xInfo.label}:</span>{' '}
              {formatValue(battery[config.xAxis] as number, config.xAxis)}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{yInfo.label}:</span>{' '}
              {formatValue(battery[config.yAxis] as number, config.yAxis)}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{zInfo.label}:</span>{' '}
              {formatValue(battery[config.bubbleSize] as number, config.bubbleSize)}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Applications: {battery.applications.split(',').slice(0, 2).join(', ')}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Market Share: {battery.marketShare}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getAxisDomain = (values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          type="number"
          dataKey="x"
          domain={getAxisDomain(chartData.map(d => d.x))}
          tickFormatter={(value) => formatValue(value, config.xAxis).split(' ')[0]}
        >
          <Label
            value={`${xInfo.label} (${xInfo.unit})`}
            position="insideBottom"
            offset={-10}
            className="fill-slate-700 dark:fill-slate-300"
          />
        </XAxis>
        <YAxis
          type="number"
          dataKey="y"
          domain={getAxisDomain(chartData.map(d => d.y))}
          tickFormatter={(value) => formatValue(value, config.yAxis).split(' ')[0]}
        >
          <Label
            value={`${yInfo.label} (${yInfo.unit})`}
            angle={-90}
            position="insideLeft"
            className="fill-slate-700 dark:fill-slate-300"
          />
        </YAxis>
        <ZAxis
          type="number"
          dataKey="z"
          range={[50, 400]}
          domain={[0, Math.max(...chartData.map(d => d.z))]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          content={() => (
            <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-2">
              Bubble size represents: {zInfo.label} ({zInfo.unit})
            </div>
          )}
        />
        <Scatter data={chartData} shape="circle">
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              fillOpacity={0.8}
              stroke={entry.color}
              strokeWidth={2}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}