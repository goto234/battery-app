export type CriterionKey =
  | "energyDensity_Whkg"
  | "cycleLife_cycles"
  | "chargeTime_hours"
  | "selfDischarge_pctPerMonth"
  | "safety_rating10"
  | "cost_USDperkWh"
  | "tempRange_spanC";

export const CRITERIA: { key: CriterionKey; label: string; unit?: string }[] = [
  { key: "energyDensity_Whkg",        label: "Energy Density",     unit: "Wh/kg" },
  { key: "cycleLife_cycles",          label: "Cycle Life",          unit: "cycles" },
  { key: "chargeTime_hours",          label: "Charge Time",         unit: "h" },
  { key: "selfDischarge_pctPerMonth", label: "Self-Discharge",      unit: "%/mo" },
  { key: "safety_rating10",           label: "Safety",              unit: "/10" },
  { key: "cost_USDperkWh",            label: "Cost",                unit: "USD/kWh" },
  { key: "tempRange_spanC",           label: "Temp Range",          unit: "°C span" },
];

export const LABELS = Object.fromEntries(
  CRITERIA.map(c => [c.key, { label: c.label, unit: c.unit ?? "" }])
) as Record<CriterionKey, { label: string; unit: string }>;
