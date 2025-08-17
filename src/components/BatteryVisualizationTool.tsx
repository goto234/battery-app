"use client";

import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, Label } from 'recharts';

// Battery data with Indian market context
const batteryData = [
  { 
    name: "Lead-Acid", 
    energyDensity_Whkg: 40, 
    cycleLife_cycles: 400, 
    chargeTime_hours: 12, 
    selfDischarge_pctPerMonth: 11.5, 
    safety_rating10: 6, 
    cost_INRperkWh: 10400, 
    tempRange_spanC: 50, 
    color: "#DC2626",
    applications: "UPS systems, telecom towers, automotive starters",
    marketShare: "60% of Indian battery market"
  },
  { 
    name: "NiCd", 
    energyDensity_Whkg: 62.5, 
    cycleLife_cycles: 1500, 
    chargeTime_hours: 1.5, 
    selfDischarge_pctPerMonth: 15, 
    safety_rating10: 6, 
    cost_INRperkWh: 16600, 
    tempRange_spanC: 80, 
    color: "#F59E0B",
    applications: "Railways, emergency lighting, power tools",
    marketShare: "5% market share (declining due to toxicity)"
  },
  { 
    name: "NiMH", 
    energyDensity_Whkg: 90, 
    cycleLife_cycles: 750, 
    chargeTime_hours: 3, 
    selfDischarge_pctPerMonth: 25, 
    safety_rating10: 7, 
    cost_INRperkWh: 22800, 
    tempRange_spanC: 55, 
    color: "#10B981",
    applications: "Hybrid vehicles, portable electronics",
    marketShare: "2% niche applications"
  },
  { 
    name: "Li-ion (NMC)", 
    energyDensity_Whkg: 200, 
    cycleLife_cycles: 2000, 
    chargeTime_hours: 2, 
    selfDischarge_pctPerMonth: 3, 
    safety_rating10: 7.5, 
    cost_INRperkWh: 13300, 
    tempRange_spanC: 60, 
    color: "#3B82F6",
    applications: "Electric vehicles, smartphones, laptops",
    marketShare: "25% and growing rapidly in EV sector"
  },
  { 
    name: "LFP", 
    energyDensity_Whkg: 125, 
    cycleLife_cycles: 3500, 
    chargeTime_hours: 1.5, 
    selfDischarge_pctPerMonth: 3, 
    safety_rating10: 9, 
    cost_INRperkWh: 16600, 
    tempRange_spanC: 80, 
    color: "#8B5CF6",
    applications: "Electric buses, grid storage, solar systems",
    marketShare: "8% - ideal for Indian climate conditions"
  },
  { 
    name: "Solid-State", 
    energyDensity_Whkg: 300, 
    cycleLife_cycles: 6500, 
    chargeTime_hours: 1.25, 
    selfDischarge_pctPerMonth: 0.5, 
    safety_rating10: 9.5, 
    cost_INRperkWh: 29000, 
    tempRange_spanC: 80, 
    color: "#EC4899",
    applications: "Next-gen EVs, aerospace, premium electronics",
    marketShare: "Expected commercial deployment 2027-2030"
  },
  { 
    name: "Zinc-Air", 
    energyDensity_Whkg: 150, 
    cycleLife_cycles: 400, 
    chargeTime_hours: 5, 
    selfDischarge_pctPerMonth: 0.5, 
    safety_rating10: 8.5, 
    cost_INRperkWh: 10400, 
    tempRange_spanC: 55, 
    color: "#F97316",
    applications: "Grid storage, stationary backup power",
    marketShare: "Emerging technology for large-scale storage"
  },
  { 
    name: "Flow Battery", 
    energyDensity_Whkg: 35, 
    cycleLife_cycles: 12500, 
    chargeTime_hours: 6, 
    selfDischarge_pctPerMonth: 0.1, 
    safety_rating10: 9.5, 
    cost_INRperkWh: 37400, 
    tempRange_spanC: 60, 
    color: "#06B6D4",
    applications: "Renewable energy storage, grid stabilization",
    marketShare: "Pilot projects in renewable energy sector"
  }
];

// Labels and options
const LABELS: Record<string, { label: string; unit?: string; icon?: string }> = {
  energyDensity_Whkg: { label: "Energy Density", unit: "Wh/kg", icon: "⚡" },
  cycleLife_cycles: { label: "Cycle Life", unit: "cycles", icon: "🔄" },
  chargeTime_hours: { label: "Charge Time", unit: "h", icon: "⏱️" },
  selfDischarge_pctPerMonth: { label: "Self-Discharge", unit: "%/mo", icon: "📉" },
  safety_rating10: { label: "Safety", unit: "/10", icon: "🛡️" },
  cost_INRperkWh: { label: "Cost", unit: "₹/kWh", icon: "💰" },
  tempRange_spanC: { label: "Temp Range", unit: "°C span", icon: "🌡️" },
};

const OPTIONS = [
  { key: "energyDensity_Whkg", label: "⚡ Energy Density (Wh/kg)" },
  { key: "cycleLife_cycles", label: "🔄 Cycle Life (cycles)" },
  { key: "chargeTime_hours", label: "⏱️ Charge Time (h)" },
  { key: "selfDischarge_pctPerMonth", label: "📉 Self-Discharge (%/mo)" },
  { key: "safety_rating10", label: "🛡️ Safety (/10)" },
  { key: "cost_INRperkWh", label: "💰 Cost (₹/kWh)" },
  { key: "tempRange_spanC", label: "🌡️ Temp Range (°C span)" }
] as const;

// Utility functions
const nf0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });

function formatValue(v: number, key: string) {
  const unit = LABELS[key]?.unit;
  let num: string;
  
  if (key === "cost_INRperkWh") {
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
  const pad = (max - min) * 0.12 || (max || 1) * 0.12;
  return [Math.floor(min - pad), Math.ceil(max + pad)] as const;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 rounded-xl shadow-lg border max-w-xs bg-white border-gray-200">
        <h3 className="font-bold text-lg mb-2 text-gray-900">{data.name}</h3>
        <div className="space-y-1 text-sm">
          <p><strong>📊 X-Value:</strong> {data.xFormatted}</p>
          <p><strong>📈 Y-Value:</strong> {data.yFormatted}</p>
          <p><strong>🔄 Cycle Life:</strong> {data.z.toLocaleString('en-IN')} cycles</p>
          {data.applications && (
            <p className="text-xs mt-2 text-gray-600">
              <strong>🏭 Applications:</strong> {data.applications}
            </p>
          )}
          {data.marketShare && (
            <p className="text-xs text-blue-600">
              <strong>📊 Market:</strong> {data.marketShare}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Controls Component
const ControlsAxes = ({ xKey, yKey, onChange }: {
  xKey: string;
  yKey: string;
  onChange: (axis: { xKey: string; yKey: string }) => void;
}) => {
  const selectClass = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white border-gray-300 text-gray-900 focus:bg-gray-50 shadow-sm`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          📈 X-Axis Parameter
        </label>
        <select
          value={xKey}
          onChange={(e) => onChange({ xKey: e.target.value, yKey })}
          className={selectClass}
        >
          {OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-600">
          Horizontal axis measurement
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          📊 Y-Axis Parameter  
        </label>
        <select
          value={yKey}
          onChange={(e) => onChange({ xKey, yKey: e.target.value })}
          className={selectClass}
        >
          {OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-600">
          Vertical axis measurement
        </p>
      </div>
    </div>
  );
};

// Chart Component
const ChartBubble = ({ xKey, yKey }: { xKey: string; yKey: string }) => {
  const data = useMemo(() => {
    return batteryData.map((b) => ({
      name: b.name,
      x: b[xKey as keyof typeof b] as number,
      y: b[yKey as keyof typeof b] as number,
      z: b.cycleLife_cycles,
      color: b.color,
      applications: b.applications,
      marketShare: b.marketShare,
      xFormatted: formatValue(b[xKey as keyof typeof b] as number, xKey),
      yFormatted: formatValue(b[yKey as keyof typeof b] as number, yKey),
    }));
  }, [xKey, yKey]);

  const xVals = data.map((d) => d.x);
  const yVals = data.map((d) => d.y);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {LABELS[xKey]?.icon} {LABELS[xKey]?.label ?? xKey} vs{' '}
            {LABELS[yKey]?.icon} {LABELS[yKey]?.label ?? yKey}
          </h3>
          <p className="text-sm mt-1 text-gray-600">
            Bubble size represents cycle life • Hover for details
          </p>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          🇮🇳 Indian Market Data
        </div>
      </div>

      <div className="w-full h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 30, right: 100, bottom: 100, left: 140 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke='#E5E7EB'
              strokeOpacity={0.5}
            />
            
            <XAxis
              type="number"
              dataKey="x"
              domain={domainWithPadding(xVals)}
              tick={{ fontSize: 11, fill: '#374151' }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
              tickFormatter={(v) => formatValue(v as number, xKey)}
              tickCount={4}
              allowDecimals
            >
              <Label
                value={`${LABELS[xKey]?.label ?? xKey}${LABELS[xKey]?.unit && xKey !== 'cost_INRperkWh' ? ` (${LABELS[xKey]?.unit})` : ""}`}
                position="insideBottom"
                offset={-70}
                style={{ 
                  textAnchor: 'middle', 
                  fill: '#111827',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="y"
              domain={domainWithPadding(yVals)}
              tick={{ fontSize: 11, fill: '#374151' }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickLine={{ stroke: '#9CA3AF' }}
              tickFormatter={(v) => formatValue(v as number, yKey)}
              tickCount={4}
              allowDecimals
            >
              <Label
                value={`${LABELS[yKey]?.label ?? yKey}${LABELS[yKey]?.unit && yKey !== 'cost_INRperkWh' ? ` (${LABELS[yKey]?.unit})` : ""}`}
                angle={-90}
                position="outside"
                offset={-30}
                style={{ 
                  textAnchor: 'middle', 
                  fill: '#111827',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              />
            </YAxis>

            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[100, 800]} 
              name="Cycle Life"
            />

            <Tooltip content={<CustomTooltip />} />

            <Scatter data={data} fillOpacity={0.8}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke='#FFFFFF'
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Legend */}
      <div className="mt-4 p-4 rounded-lg bg-gray-50">
        <h4 className="text-sm font-semibold mb-2">🔋 Battery Technologies</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border"
                style={{ 
                  backgroundColor: item.color,
                  borderColor: '#FFFFFF'
                }}
              />
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
const BatteryVisualizationTool = () => {
  const [axes, setAxes] = useState({
    xKey: 'energyDensity_Whkg',
    yKey: 'cost_INRperkWh'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        
        {/* Enhanced Header */}
        <header className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <span className="text-white text-xl">🔋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Indian Battery Market Analyzer</h1>
              <p className="text-gray-600">
                Compare battery technologies for Indian applications • Pricing in ₹INR • Market insights
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to use this tool:</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Select X and Y axes to explore different trade-offs</li>
              <li>• Bubble size represents cycle life (larger = more durable)</li>
              <li>• Hover over bubbles for detailed information</li>
              <li>• All costs shown in Indian Rupees (₹/kWh)</li>
              <li>• Applications and market share data specific to India</li>
            </ul>
          </div>
        </header>

        {/* Enhanced Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-4">📊 Select Parameters to Compare</h2>
          <ControlsAxes
            xKey={axes.xKey}
            yKey={axes.yKey}
            onChange={(patch) => setAxes((prev) => ({ ...prev, ...patch }))}
          />
        </div>

        {/* Chart */}
        <ChartBubble xKey={axes.xKey} yKey={axes.yKey} />

        {/* Key Insights */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">💡 Key Insights for Indian Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Cost Leaders</h3>
              <p className="text-green-700">Lead-Acid remains cheapest at ₹10.4k/kWh, dominating UPS and telecom sectors</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">EV Growth</h3>
              <p className="text-blue-700">Li-ion driving India's EV adoption with 25% market share</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Climate Resilient</h3>
              <p className="text-purple-700">LFP ideal for Indian heat - 80°C range, 3500 cycles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryVisualizationTool;