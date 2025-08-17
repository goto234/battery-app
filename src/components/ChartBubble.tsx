"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, Cell, Label
} from "recharts";
import batteries from "@/data/batteries.json";

type Battery = {
  name: string;
  energyDensity_Whkg: number;
  cycleLife_cycles: number;
  chargeTime_hours: number;
  selfDischarge_pctPerMonth: number;
  safety_rating10: number;
  cost_INRperkWh: number; // Changed to INR
  tempRange_spanC: number;
  color: string;
  applications?: string;
  marketShare?: string;
};

const LABELS: Record<string, { label: string; unit?: string; icon?: string }> = {
  energyDensity_Whkg:        { label: "Energy Density",     unit: "Wh/kg", icon: "⚡" },
  cycleLife_cycles:          { label: "Cycle Life",         unit: "cycles", icon: "🔄" },
  chargeTime_hours:          { label: "Charge Time",        unit: "h", icon: "⏱️" },
  selfDischarge_pctPerMonth: { label: "Self-Discharge",     unit: "%/mo", icon: "📉" },
  safety_rating10:           { label: "Safety",             unit: "/10", icon: "🛡️" },
  cost_INRperkWh:            { label: "Cost",               unit: "₹/kWh", icon: "💰" }, // Changed to INR
  tempRange_spanC:           { label: "Temp Range",         unit: "°C span", icon: "🌡️" },
};

const nf0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });

function fmt(v: number, key: keyof Battery) {
  const unit = LABELS[key as string]?.unit;
  let num: string;
  
  if (key === "cost_INRperkWh") {
    // Format INR in thousands for readability
    num = `₹${(v/1000).toFixed(0)}k`;
    return num;
  } else if (key === "chargeTime_hours" || key === "safety_rating10") {
    num = nf1.format(v);
  } else {
    num = nf0.format(v);
  }
  
  return unit && key !== "cost_INRperkWh" ? `${num} ${unit}` : num;
}

function domainWithPadding(values: number[]) {
  if (!values.length) return [0, "auto"] as const;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.1 || (max || 1) * 0.1;
  return [Math.floor(min - pad), Math.ceil(max + pad)] as const;
}

const CustomTooltip = ({ active, payload, isDark }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`p-4 rounded-xl shadow-lg border max-w-xs ${
        isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200'
      }`}>
        <h3 className="font-bold text-lg mb-2">{data.name}</h3>
        <div className="space-y-1 text-sm">
          <p><strong>📊 X-Value:</strong> {data.xFormatted}</p>
          <p><strong>📈 Y-Value:</strong> {data.yFormatted}</p>
          <p><strong>🔄 Cycle Life:</strong> {data.z.toLocaleString('en-IN')} cycles</p>
          {data.applications && (
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
              <strong>Applications:</strong> {data.applications}
            </p>
          )}
          {data.marketShare && (
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Market:</strong> {data.marketShare}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartBubble({
  xKey,
  yKey,
  isDark = false
}: {
  xKey: keyof Battery;
  yKey: keyof Battery;
  isDark?: boolean;
}) {
  const rows = batteries as Battery[];

  const data = useMemo(() => {
    return rows.map((b) => ({
      name: b.name,
      x: b[xKey] as number,
      y: b[yKey] as number,
      z: b.cycleLife_cycles as number,
      color: b.color,
      applications: b.applications,
      marketShare: b.marketShare,
      xFormatted: fmt(b[xKey] as number, xKey),
      yFormatted: fmt(b[yKey] as number, yKey),
    }));
  }, [rows, xKey, yKey]);

  const xVals = data.map((d) => d.x);
  const yVals = data.map((d) => d.y);

  const cardClass = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

  return (
    <div className={`${cardClass} p-6 rounded-2xl shadow-xl`}>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">
            {LABELS[xKey as string]?.icon} {LABELS[xKey as string]?.label ?? xKey} vs{' '}
            {LABELS[yKey as string]?.icon} {LABELS[yKey as string]?.label ?? yKey}
          </h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Bubble size represents cycle life • Hover for details
          </p>
        </div>
        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
          🇮🇳 Indian Market Data
        </div>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 80, bottom: 80, left: 100 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#E5E7EB'}
              strokeOpacity={0.5}
            />
            
            <XAxis
              type="number"
              dataKey="x"
              domain={domainWithPadding(xVals)}
              tick={{ fontSize: 12, fill: isDark ? '#D1D5DB' : '#374151' }}
              axisLine={{ stroke: isDark ? '#6B7280' : '#9CA3AF' }}
              tickLine={{ stroke: isDark ? '#6B7280' : '#9CA3AF' }}
              tickFormatter={(v) => fmt(v as number, xKey)}
              tickCount={6}
              allowDecimals
            >
              <Label
                value={`${LABELS[xKey as string]?.label ?? xKey}${LABELS[xKey as string]?.unit && xKey !== 'cost_INRperkWh' ? ` (${LABELS[xKey as string]?.unit})` : ""}`}
                position="insideBottom"
                offset={-50}
                style={{ 
                  textAnchor: 'middle', 
                  fill: isDark ? '#F3F4F6' : '#111827',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="y"
              domain={domainWithPadding(yVals)}
              tick={{ fontSize: 12, fill: isDark ? '#D1D5DB' : '#374151' }}
              axisLine={{ stroke: isDark ? '#6B7280' : '#9CA3AF' }}
              tickLine={{ stroke: isDark ? '#6B7280' : '#9CA3AF' }}
              tickFormatter={(v) => fmt(v as number, yKey)}
              tickCount={6}
              allowDecimals
            >
              <Label
                value={`${LABELS[yKey as string]?.label ?? yKey}${LABELS[yKey as string]?.unit && yKey !== 'cost_INRperkWh' ? ` (${LABELS[yKey as string]?.unit})` : ""}`}
                angle={-90}
                position="insideLeft"
                offset={20}
                style={{ 
                  textAnchor: 'middle', 
                  fill: isDark ? '#F3F4F6' : '#111827',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              />
            </YAxis>

            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[80, 800]} 
              name="Cycle Life"
            />

            <Tooltip content={<CustomTooltip isDark={isDark} />} />

            <Scatter data={data} fillOpacity={0.8}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={isDark ? '#1F2937' : '#FFFFFF'}
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h4 className="text-sm font-semibold mb-2">🔋 Battery Technologies</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border"
                style={{ 
                  backgroundColor: item.color,
                  borderColor: isDark ? '#1F2937' : '#FFFFFF'
                }}
              />
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}