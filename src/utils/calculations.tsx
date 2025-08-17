// src/utils/calculations.ts
import { Battery, TCOInput, WeightedCriteria } from '@/types/battery';

export const METRIC_INFO = {
  energyDensity_Whkg: { label: 'Energy Density', unit: 'Wh/kg', format: 0, higher: true },
  cycleLife_cycles: { label: 'Cycle Life', unit: 'cycles', format: 0, higher: true },
  chargeTime_hours: { label: 'Charge Time', unit: 'hours', format: 1, higher: false },
  selfDischarge_pctPerMonth: { label: 'Self-Discharge', unit: '%/month', format: 1, higher: false },
  safety_rating10: { label: 'Safety Rating', unit: '/10', format: 1, higher: true },
  cost_INRperkWh: { label: 'Cost', unit: '₹/kWh', format: 0, higher: false },
  tempRange_spanC: { label: 'Temperature Range', unit: '°C', format: 0, higher: true },
  efficiency_pct: { label: 'Efficiency', unit: '%', format: 0, higher: true },
  powerDensity_Wkg: { label: 'Power Density', unit: 'W/kg', format: 0, higher: true },
  depthOfDischarge_pct: { label: 'Depth of Discharge', unit: '%', format: 0, higher: true },
};

export function formatValue(value: number, metric: keyof typeof METRIC_INFO): string {
  const info = METRIC_INFO[metric];
  if (!info) return value.toString();
  
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: info.format,
    minimumFractionDigits: 0,
  });
  
  return `${formatter.format(value)}${info.unit ? ` ${info.unit}` : ''}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateTCO(battery: Battery, input: TCOInput): {
  initialCost: number;
  operatingCost: number;
  maintenanceCost: number;
  replacementCost: number;
  totalCost: number;
  costPerKWh: number;
  paybackPeriod?: number;
} {
  const { dailyEnergyKWh, electricityRateINR, years, replacementCost, maintenanceCostPerYear } = input;
  
  // Initial cost based on battery capacity needed
  const batteryCapacityNeeded = dailyEnergyKWh / (battery.depthOfDischarge_pct / 100);
  const initialCost = batteryCapacityNeeded * battery.cost_INRperkWh;
  
  // Operating cost (charging efficiency losses)
  const yearlyEnergyKWh = dailyEnergyKWh * 365;
  const chargingLosses = yearlyEnergyKWh * (1 - battery.efficiency_pct / 100);
  const operatingCost = chargingLosses * electricityRateINR * years;
  
  // Maintenance cost
  const maintenanceCost = maintenanceCostPerYear * years;
  
  // Replacement cost based on cycle life
  const cyclesPerYear = input.usagePattern === 'daily' ? 365 : 
                        input.usagePattern === 'weekly' ? 52 : 12;
  const batteryLifeYears = battery.cycleLife_cycles / cyclesPerYear;
  const replacementsNeeded = Math.max(0, Math.floor(years / batteryLifeYears) - 1);
  const totalReplacementCost = replacementsNeeded * (replacementCost || initialCost * 0.8);
  
  const totalCost = initialCost + operatingCost + maintenanceCost + totalReplacementCost;
  const totalEnergyDelivered = yearlyEnergyKWh * years;
  const costPerKWh = totalCost / totalEnergyDelivered;
  
  // Payback period (compared to lead-acid baseline)
  const leadAcidCostPerKWh = 10400; // Lead-acid reference
  const savings = (leadAcidCostPerKWh - battery.cost_INRperkWh) * batteryCapacityNeeded;
  const paybackPeriod = savings > 0 ? initialCost / (savings / years) : undefined;
  
  return {
    initialCost,
    operatingCost,
    maintenanceCost,
    replacementCost: totalReplacementCost,
    totalCost,
    costPerKWh,
    paybackPeriod,
  };
}

export function calculateBatteryScore(battery: Battery, weights: WeightedCriteria): number {
  // Normalize all metrics to 0-1 scale
  const normalized = {
    energyDensity: battery.energyDensity_Whkg / 300, // Max 300 Wh/kg
    cycleLife: battery.cycleLife_cycles / 12500, // Max 12500 cycles
    cost: 1 - (battery.cost_INRperkWh / 40000), // Inverse, max 40000 ₹/kWh
    safety: battery.safety_rating10 / 10,
    chargeTime: 1 - (battery.chargeTime_hours / 12), // Inverse, max 12 hours
    efficiency: battery.efficiency_pct / 100,
  };
  
  // Calculate weighted score
  let score = 0;
  score += normalized.energyDensity * weights.energyDensity;
  score += normalized.cycleLife * weights.cycleLife;
  score += normalized.cost * weights.cost;
  score += normalized.safety * weights.safety;
  score += normalized.chargeTime * weights.chargeTime;
  score += normalized.efficiency * weights.efficiency;
  
  return score * 100; // Convert to percentage
}

export function recommendBattery(
  batteries: Battery[],
  application: string,
  weights: WeightedCriteria
): Battery[] {
  // Filter batteries suitable for application
  const suitable = batteries.filter(b => 
    b.applications.toLowerCase().includes(application.toLowerCase())
  );
  
  // Score and sort
  const scored = suitable.map(battery => ({
    battery,
    score: calculateBatteryScore(battery, weights),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, 3).map(s => s.battery);
}

export function exportToCSV(batteries: Battery[]): string {
  const headers = Object.keys(batteries[0]).join(',');
  const rows = batteries.map(b => Object.values(b).join(','));
  return [headers, ...rows].join('\n');
}

export function generateShareableURL(state: string): string {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseURL}?state=${encodeURIComponent(state)}`;
}