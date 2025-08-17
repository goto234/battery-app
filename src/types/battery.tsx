// src/types/battery.ts
export interface Battery {
    name: string;
    energyDensity_Whkg: number;
    cycleLife_cycles: number;
    chargeTime_hours: number;
    selfDischarge_pctPerMonth: number;
    safety_rating10: number;
    cost_INRperkWh: number;
    tempRange_spanC: number;
    color: string;
    applications: string;
    marketShare: string;
    efficiency_pct: number;
    powerDensity_Wkg: number;
    depthOfDischarge_pct: number;
    operatingTemp_min: number;
    operatingTemp_max: number;
    indianManufacturers: string;
    advantages: string;
    disadvantages: string;
  }
  
  export type MetricKey = keyof Pick<Battery, 
    | 'energyDensity_Whkg'
    | 'cycleLife_cycles'
    | 'chargeTime_hours'
    | 'selfDischarge_pctPerMonth'
    | 'safety_rating10'
    | 'cost_INRperkWh'
    | 'tempRange_spanC'
    | 'efficiency_pct'
    | 'powerDensity_Wkg'
    | 'depthOfDischarge_pct'
  >;
  
  export interface ChartConfig {
    xAxis: MetricKey;
    yAxis: MetricKey;
    bubbleSize: MetricKey;
    chartType: 'bubble' | 'scatter' | 'bar' | 'radar' | 'comparison';
  }
  
  export interface FilterConfig {
    costRange: [number, number];
    cycleLifeRange: [number, number];
    applications: string[];
    safetyMin: number;
    efficiencyMin: number;
  }
  
  export interface WeightedCriteria {
    energyDensity: number;
    cycleLife: number;
    cost: number;
    safety: number;
    chargeTime: number;
    efficiency: number;
  }
  
  export interface TCOInput {
    usagePattern: 'daily' | 'weekly' | 'occasional';
    dailyEnergyKWh: number;
    electricityRateINR: number;
    years: number;
    replacementCost: number;
    maintenanceCostPerYear: number;
  }
  
  export interface RecommendationResult {
    battery: Battery;
    score: number;
    reasons: string[];
    tradeoffs: string[];
  }