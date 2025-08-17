"use client";
import React from "react";

const OPTIONS = [
  { key: "energyDensity_Whkg", label: "Energy Density (Wh/kg)" },
  { key: "cycleLife_cycles", label: "Cycle Life (cycles)" },
  { key: "chargeTime_hours", label: "Charge Time (h)" },
  { key: "selfDischarge_pctPerMonth", label: "Self-Discharge (%/mo)" },
  { key: "safety_rating10", label: "Safety (/10)" },
  { key: "cost_INRperkWh", label: "Cost (₹/kWh)" },
  { key: "tempRange_spanC", label: "Temp Range (°C span)" }
] as const;

export default function ControlsAxes({
  xKey,
  yKey,
  onChange,
}: {
  xKey: string;
  yKey: string;
  onChange: (axis: { xKey: string; yKey: string }) => void;
}) {
  const base =
    "w-full rounded-lg border-2 px-4 py-3 text-sm bg-white text-gray-900 border-gray-300 font-medium ";
  const focus =
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const hover = "hover:border-gray-400";
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-900">
      <label className="text-sm">
        <span className="block font-bold mb-2 text-gray-900 text-base"> {/* Darker, larger labels */}
          X-Axis
        </span>
        <select
          value={xKey}
          onChange={(e) => onChange({ xKey: e.target.value, yKey })}
          className={base + focus + hover}
        >
          {OPTIONS.map((o) => (
            <option key={o.key} value={o.key} className="text-gray-900 font-medium">
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="block font-bold mb-2 text-gray-900 text-base"> {/* Darker, larger labels */}
          Y-Axis
        </span>
        <select
          value={yKey}
          onChange={(e) => onChange({ xKey, yKey: e.target.value })}
          className={base + focus + hover}
        >
          {OPTIONS.map((o) => (
            <option key={o.key} value={o.key} className="text-gray-900 font-medium">
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}