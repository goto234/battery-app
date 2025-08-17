"use client";

import { useState } from "react";
import ControlsAxes from "@/components/ControlsAxes";
import ChartBubble from "@/components/ChartBubble";

export default function Home() {
  const [axes, setAxes] = useState<{ xKey: string; yKey: string }>({
    xKey: "energyDensity_Whkg",
    yKey: "cost_USDperkWh",
  });

  return (
    <main className="min-h-svh bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Battery Visualizer</h1>
          <p className="text-gray-600">Tweak axes; bubble size = cycle life. Tooltips show units.</p>
        </header>

        <div className="bg-white rounded-2xl shadow p-4">
          <ControlsAxes
            xKey={axes.xKey}
            yKey={axes.yKey}
            onChange={(patch) => setAxes((prev) => ({ ...prev, ...patch }))}
          />
        </div>

        <ChartBubble xKey={axes.xKey as any} yKey={axes.yKey as any} />
      </div>
    </main>
  );
}
