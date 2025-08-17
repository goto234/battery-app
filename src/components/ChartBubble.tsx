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
  cost_USDperkWh: number;
  tempRange_spanC: number;
  color: string;
};

const LABELS: Record<string, { label: string; unit?: string }> = {
  energyDensity_Whkg:        { label: "Energy Density",     unit: "Wh/kg" },
  cycleLife_cycles:          { label: "Cycle Life",         unit: "cycles" },
  chargeTime_hours:          { label: "Charge Time",        unit: "h" },
  selfDischarge_pctPerMonth: { label: "Self-Discharge",     unit: "%/mo" },
  safety_rating10:           { label: "Safety",             unit: "/10" },
  cost_USDperkWh:            { label: "Cost",               unit: "USD/kWh" },
  tempRange_spanC:           { label: "Temp Range",         unit: "°C span" },
};

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function fmt(v: number, key: keyof Battery) {
  const unit = LABELS[key as string]?.unit;
  const num =
    key === "chargeTime_hours" || key === "safety_rating10"
      ? nf1.format(v)
      : nf0.format(v);
  return unit ? `${num} ${unit}` : num;
}

function domainWithPadding(values: number[]) {
  if (!values.length) return [0, "auto"] as const;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.08 || (max || 1) * 0.08;
  return [Math.floor(min - pad), Math.ceil(max + pad)] as const;
}

export default function ChartBubble({
  xKey,
  yKey,
}: {
  xKey: keyof Battery;
  yKey: keyof Battery;
}) {
  const rows = batteries as Battery[];

  const data = useMemo(() => {
    return rows.map((b) => ({
      name: b.name,
      x: b[xKey] as number,
      y: b[yKey] as number,
      z: b.cycleLife_cycles as number,
      color: b.color,
    }));
  }, [rows, xKey, yKey]);

  const xVals = data.map((d) => d.x);
  const yVals = data.map((d) => d.y);

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {LABELS[xKey as string]?.label ?? xKey} vs {LABELS[yKey as string]?.label ?? yKey}
        </h3>
        <div className="text-sm text-gray-600">Size = Cycle Life</div>
      </div>

      <div className="w-full h-[460px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, bottom: 64, left: 96 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={domainWithPadding(xVals)}
              tick={{ fontSize: 12, fill: "#374151" }}
              tickFormatter={(v) => fmt(v as number, xKey)}
              tickCount={5}
              allowDecimals
            >
              <Label
                value={`${LABELS[xKey as string]?.label ?? xKey}${LABELS[xKey as string]?.unit ? ` (${LABELS[xKey as string]?.unit})` : ""}`}
                position="bottom"
                offset={36}
                style={{ fill: "#111827", fontSize: 12, fontWeight: 600 }}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="y"
              domain={domainWithPadding(yVals)}
              tick={{ fontSize: 12, fill: "#374151" }}
              tickFormatter={(v) => fmt(v as number, yKey)}
              tickCount={5}
              allowDecimals
            >
              <Label
                value={`${LABELS[yKey as string]?.label ?? yKey}${LABELS[yKey as string]?.unit ? ` (${LABELS[yKey as string]?.unit})` : ""}`}
                angle={-90}
                position="left"
                offset={0}
                style={{ fill: "#111827", fontSize: 12, fontWeight: 600 }}
              />
            </YAxis>

            <ZAxis type="number" dataKey="z" range={[60, 360]} name="Cycle Life" />

            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#E5E7EB" }}
              formatter={(value, _name, p) => {
                const k = (p && (p as any).dataKey) as "x" | "y" | "z";
                if (k === "x") return [fmt(value as number, xKey), LABELS[xKey as string]?.label ?? String(xKey)];
                if (k === "y") return [fmt(value as number, yKey), LABELS[yKey as string]?.label ?? String(yKey)];
                if (k === "z") return [`${nf0.format(value as number)} cycles`, "Cycle Life"];
                return [String(value), String(k)];
              }}
            />

            <Scatter data={data}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Hint: Larger bubbles = higher cycle life. Axis ranges auto-pad for readability.
      </p>
    </div>
  );
}
