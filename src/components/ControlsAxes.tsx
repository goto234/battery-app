"use client";
import React from "react";

const OPTIONS = [
  { key: "energyDensity_Whkg", label: "⚡ Energy Density (Wh/kg)" },
  { key: "cycleLife_cycles", label: "🔄 Cycle Life (cycles)" },
  { key: "chargeTime_hours", label: "⏱️ Charge Time (h)" },
  { key: "selfDischarge_pctPerMonth", label: "📉 Self-Discharge (%/mo)" },
  { key: "safety_rating10", label: "🛡️ Safety (/10)" },
  { key: "cost_INRperkWh", label: "💰 Cost (₹/kWh)" }, // Changed to INR
  { key: "tempRange_spanC", label: "🌡️ Temp Range (°C span)" }
] as const;

export default function ControlsAxes({
  xKey,
  yKey,
  onChange,
  isDark = false
}: {
  xKey: string;
  yKey: string;
  onChange: (axis: { xKey: string; yKey: string }) => void;
  isDark?: boolean;
}) {
  const selectClass = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
    isDark 
      ? 'bg-gray-700 border-gray-600 text-white focus:bg-gray-600' 
      : 'bg-white border-gray-300 text-gray-900 focus:bg-gray-50'
  }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
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
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Horizontal axis measurement
        </p>
      </div>

      <div className="space-y-2">
        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
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
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Vertical axis measurement
        </p>
      </div>
    </div>
  );
}