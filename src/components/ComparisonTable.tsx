// src/components/ComparisonTable.tsx
"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useBatteryStore } from "@/store/batteryStore";
import { formatValue, METRIC_INFO, exportToCSV } from "@/utils/calculations";
import { ChevronUp, ChevronDown, Download } from "lucide-react";
import type { Battery, MetricKey } from "@/types/battery";

export default function ComparisonTable() {
  const {
    filteredBatteries,
    selectedBatteries,
    toggleBatterySelection,
  } = useBatteryStore();

  const [sortBy, setSortBy] = useState<keyof Battery>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [compareMode, setCompareMode] = useState(false);

  const metrics: { key: MetricKey; highlight: boolean }[] = [
    { key: "energyDensity_Whkg", highlight: true },
    { key: "cycleLife_cycles", highlight: true },
    { key: "cost_INRperkWh", highlight: true },
    { key: "safety_rating10", highlight: true },
    { key: "efficiency_pct", highlight: false },
    { key: "chargeTime_hours", highlight: false },
    { key: "selfDischarge_pctPerMonth", highlight: false },
    { key: "powerDensity_Wkg", highlight: false },
    { key: "depthOfDischarge_pct", highlight: false },
    { key: "tempRange_spanC", highlight: false },
  ];

  const handleSort = (key: keyof Battery) => {
    if (sortBy === key) {
      setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedBatteries = useMemo(() => {
    const arr = [...filteredBatteries];
    return arr.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      // Nullish guards first
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortOrder === "asc" ? 1 : -1;
      if (bVal == null) return sortOrder === "asc" ? -1 : 1;

      // String vs number compare
      if (typeof aVal === "string" || typeof bVal === "string") {
        const res = String(aVal).localeCompare(String(bVal));
        return sortOrder === "asc" ? res : -res;
      }
      const res = (aVal as number) - (bVal as number);
      return sortOrder === "asc" ? res : -res;
    });
  }, [filteredBatteries, sortBy, sortOrder]);

  const displayBatteries = useMemo(() => {
    if (compareMode && selectedBatteries.length > 0) {
      const sel = new Set(selectedBatteries);
      return sortedBatteries.filter((b) => sel.has(b.name));
    }
    return sortedBatteries;
  }, [compareMode, selectedBatteries, sortedBatteries]);

  // Header checkbox (select visible rows) with indeterminate state
  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);
  const allVisibleSelected =
    displayBatteries.length > 0 &&
    displayBatteries.every((b) => selectedBatteries.includes(b.name));
  const anyVisibleSelected = displayBatteries.some((b) =>
    selectedBatteries.includes(b.name)
  );

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        !allVisibleSelected && anyVisibleSelected;
    }
  }, [allVisibleSelected, anyVisibleSelected]);

  const bulkToggleVisible = (targetChecked: boolean) => {
    displayBatteries.forEach((b) => {
      const isSelected = selectedBatteries.includes(b.name);
      if (targetChecked && !isSelected) toggleBatterySelection(b.name);
      if (!targetChecked && isSelected) toggleBatterySelection(b.name);
    });
  };

  const handleExportCSV = () => {
    const csv = displayBatteries.length
      ? exportToCSV(displayBatteries)
      : exportToCSV(sortedBatteries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "battery_comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Battery Comparison Table
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setCompareMode((v) => !v)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              compareMode
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            {compareMode
              ? `Comparing ${selectedBatteries.length}`
              : "Compare Mode"}
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-300 dark:border-slate-600">
              {compareMode && (
                <th className="px-4 py-3 text-left align-middle">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    aria-label="Select all visible"
                    checked={allVisibleSelected}
                    onChange={(e) => bulkToggleVisible(e.currentTarget.checked)}
                    className="rounded"
                  />
                </th>
              )}

              <th
                className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Battery
                  {sortBy === "name" &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>

              {metrics.map(({ key, highlight }) => {
                const info = METRIC_INFO[key] ?? { label: key, unit: "" };
                return (
                  <th
                    key={key}
                    className={`px-4 py-3 text-left font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      highlight
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => handleSort(key as keyof Battery)}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      {info.label}
                      {sortBy === (key as unknown as keyof Battery) &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                    <div className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {info.unit || ""}
                    </div>
                  </th>
                );
              })}

              <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                Applications
              </th>
            </tr>
          </thead>

          <tbody>
            {displayBatteries.map((battery) => (
              <tr
                key={battery.name}
                className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                  selectedBatteries.includes(battery.name)
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                {compareMode && (
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedBatteries.includes(battery.name)}
                      onChange={() => toggleBatterySelection(battery.name)}
                      className="rounded"
                      aria-label={`Select ${battery.name}`}
                    />
                  </td>
                )}

                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: battery.color }}
                      title={battery.name}
                    />
                    <div className="flex flex-col">
                      <span className="text-slate-800 dark:text-slate-100">
                        {battery.name}
                      </span>
                      {/* Optional: show market share or other subtext */}
                      {battery.marketShare && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Market share: {battery.marketShare}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {metrics.map(({ key }) => {
                  const raw = (battery as any)[key] as number | string | null;
                  const displayed =
                    raw == null || raw === ""
                      ? "—"
                      : typeof raw === "number"
                      ? formatValue(raw, key)
                      : String(raw);

                  return (
                    <td key={key} className="px-4 py-3">
                      <span className="whitespace-nowrap">{displayed}</span>
                    </td>
                  );
                })}

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(battery.applications || "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((app) => (
                        <span
                          key={app}
                          className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {app}
                        </span>
                      ))}
                    {!battery.applications?.trim() && (
                      <span className="text-slate-500 dark:text-slate-400">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayBatteries.length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 py-10">
            No batteries match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
