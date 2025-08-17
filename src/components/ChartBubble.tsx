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
  cost_INRperkWh: number;
  tempRange_spanC: number;
  color: string;
};

type BatteryKey = keyof Battery;

const LABELS: Record<string, { label: string; unit?: string }> = {
  energyDensity_Whkg:        { label: "Energy Density",     unit: "Wh/kg" },
  cycleLife_cycles:          { label: "Cycle Life",         unit: "cycles" },
  chargeTime_hours:          { label: "Charge Time",        unit: "h" },
  selfDischarge_pctPerMonth: { label: "Self-Discharge",     unit: "%/mo" },
  safety_rating10:           { label: "Safety",             unit: "/10" },
  cost_INRperkWh:            { label: "Cost",               unit: "₹/kWh" },
  tempRange_spanC:           { label: "Temp Range",         unit: "°C span" },
};

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function fmt(v: number, key: string): string {
  const labelInfo = LABELS[key];
  const unit = labelInfo?.unit;
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

function domainWithPadding(values: number[]): readonly [number, number] {
  if (!values.length) return [0, 100] as const;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.08 || (max || 1) * 0.08;
  return [Math.floor(min - pad), Math.ceil(max + pad)] as const;
}

interface ChartBubbleProps {
  xKey: string;
  yKey: string;
}

export default function ChartBubble({ xKey, yKey }: ChartBubbleProps) {
  const rows = batteries as Battery[];

  const data = useMemo(() => {
    return rows.map((b) => {
      const xValue = b[xKey as keyof Battery];
      const yValue = b[yKey as keyof Battery];
      
      return {
        name: b.name,
        x: typeof xValue === 'number' ? xValue : 0,
        y: typeof yValue === 'number' ? yValue : 0,
        z: b.cycleLife_cycles,
        color: b.color,
      };
    });
  }, [rows, xKey, yKey]);

  const xVals = data.map((d) => d.x);
  const yVals = data.map((d) => d.y);

  const xLabel = LABELS[xKey];
  const yLabel = LABELS[yKey];

  return (
    <div className="bg-white p-5 rounded-2xl shadow border border-gray-200">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {xLabel?.label || xKey} vs {yLabel?.label || yKey}
        </h3>
        <div className="text-sm font-medium text-gray-700">Size = Cycle Life</div>
      </div>

      <div className="w-full h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" strokeOpacity={0.8} />
            
            <XAxis
              type="number"
              dataKey="x"
              domain={domainWithPadding(xVals)}
              tick={{ fontSize: 12, fill: "#111827" }}
              axisLine={{ stroke: "#6B7280", strokeWidth: 1 }}
              tickLine={{ stroke: "#6B7280" }}
              tickFormatter={(v) => fmt(v as number, xKey)}
              tickCount={4}
              allowDecimals
            >
              <Label
                value={`${xLabel?.label || xKey}${xLabel?.unit ? ` (${xLabel.unit})` : ""}`}
                position="insideBottom"
                offset={-60}
                style={{ fill: "#111827", fontSize: 13, fontWeight: 600 }}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="y"
              domain={domainWithPadding(yVals)}
              tick={{ fontSize: 12, fill: "#111827" }}
              axisLine={{ stroke: "#6B7280", strokeWidth: 1 }}
              tickLine={{ stroke: "#6B7280" }}
              tickFormatter={(v) => fmt(v as number, yKey)}
              tickCount={4}
              allowDecimals
            >
              <Label
                value={`${yLabel?.label || yKey}${yLabel?.unit ? ` (${yLabel.unit})` : ""}`}
                angle={-90}
                position="outside"
                offset={-20}
                style={{ fill: "#111827", fontSize: 13, fontWeight: 600 }}
              />
            </YAxis>

            <ZAxis type="number" dataKey="z" range={[60, 360]} name="Cycle Life" />

            <Tooltip
              contentStyle={{ 
                borderRadius: 8, 
                borderColor: "#D1D5DB", 
                backgroundColor: "#FFFFFF",
                color: "#111827",
                fontSize: 14,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              formatter={(value, _name, p) => {
                const k = (p && (p as any).dataKey) as "x" | "y" | "z";
                if (k === "x") return [fmt(value as number, xKey), xLabel?.label || xKey];
                if (k === "y") return [fmt(value as number, yKey), yLabel?.label || yKey];
                if (k === "z") return [`${nf0.format(value as number)} cycles`, "Cycle Life"];
                return [String(value), String(k)];
              }}
            />

            <Scatter data={data}>
              {data.map((d, i) => (
                <Cell 
                  key={i} 
                  fill={d.color} 
                  stroke="#FFFFFF" 
                  strokeWidth={2}
                  opacity={0.9}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm font-medium text-gray-700 mt-3">
        Hint: Larger bubbles = higher cycle life. Axis ranges auto-pad for readability.
      </p>
    </div>
  );
}