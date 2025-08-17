// src/store/batteryStore.ts
import { create } from 'zustand';
import { Battery, ChartConfig, FilterConfig, WeightedCriteria } from '@/types/battery';
import batteriesData from '@/data/batteries-enhanced.json';

interface BatteryStore {
  // Data
  batteries: Battery[];
  filteredBatteries: Battery[];
  
  // UI State
  theme: 'light' | 'dark';
  chartConfig: ChartConfig;
  filterConfig: FilterConfig;
  selectedBatteries: string[];
  weightedCriteria: WeightedCriteria;
  presentationMode: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setChartConfig: (config: Partial<ChartConfig>) => void;
  setFilterConfig: (config: Partial<FilterConfig>) => void;
  toggleBatterySelection: (name: string) => void;
  setWeightedCriteria: (criteria: Partial<WeightedCriteria>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setPresentationMode: (mode: boolean) => void;
  getShareableState: () => string;
  loadShareableState: (state: string) => void;
}

const defaultFilters: FilterConfig = {
  costRange: [0, 50000],
  cycleLifeRange: [0, 15000],
  applications: [],
  safetyMin: 0,
  efficiencyMin: 0,
};

const defaultWeights: WeightedCriteria = {
  energyDensity: 0.2,
  cycleLife: 0.2,
  cost: 0.2,
  safety: 0.2,
  chargeTime: 0.1,
  efficiency: 0.1,
};

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  batteries: batteriesData as Battery[],
  filteredBatteries: batteriesData as Battery[],
  
  theme: 'light',
  chartConfig: {
    xAxis: 'energyDensity_Whkg',
    yAxis: 'cost_INRperkWh',
    bubbleSize: 'cycleLife_cycles',
    chartType: 'bubble',
  },
  filterConfig: defaultFilters,
  selectedBatteries: [],
  weightedCriteria: defaultWeights,
  presentationMode: false,
  
  setTheme: (theme) => set({ theme }),
  
  setChartConfig: (config) => set((state) => ({
    chartConfig: { ...state.chartConfig, ...config }
  })),
  
  setFilterConfig: (config) => set((state) => ({
    filterConfig: { ...state.filterConfig, ...config }
  })),
  
  toggleBatterySelection: (name) => set((state) => ({
    selectedBatteries: state.selectedBatteries.includes(name)
      ? state.selectedBatteries.filter(n => n !== name)
      : [...state.selectedBatteries, name]
  })),
  
  setWeightedCriteria: (criteria) => set((state) => ({
    weightedCriteria: { ...state.weightedCriteria, ...criteria }
  })),
  
  applyFilters: () => set((state) => {
    const filtered = state.batteries.filter(battery => {
      const { costRange, cycleLifeRange, applications, safetyMin, efficiencyMin } = state.filterConfig;
      
      if (battery.cost_INRperkWh < costRange[0] || battery.cost_INRperkWh > costRange[1]) return false;
      if (battery.cycleLife_cycles < cycleLifeRange[0] || battery.cycleLife_cycles > cycleLifeRange[1]) return false;
      if (battery.safety_rating10 < safetyMin) return false;
      if (battery.efficiency_pct < efficiencyMin) return false;
      
      if (applications.length > 0) {
        const batteryApps = battery.applications.toLowerCase();
        const hasApp = applications.some(app => batteryApps.includes(app.toLowerCase()));
        if (!hasApp) return false;
      }
      
      return true;
    });
    
    return { filteredBatteries: filtered };
  }),
  
  resetFilters: () => set({
    filterConfig: defaultFilters,
    filteredBatteries: get().batteries,
  }),
  
  setPresentationMode: (mode) => set({ presentationMode: mode }),
  
  getShareableState: () => {
    const state = get();
    const shareData = {
      chart: state.chartConfig,
      filter: state.filterConfig,
      weights: state.weightedCriteria,
      selected: state.selectedBatteries,
    };
    return btoa(JSON.stringify(shareData));
  },
  
  loadShareableState: (encodedState) => {
    try {
      const shareData = JSON.parse(atob(encodedState));
      set({
        chartConfig: shareData.chart || get().chartConfig,
        filterConfig: shareData.filter || defaultFilters,
        weightedCriteria: shareData.weights || defaultWeights,
        selectedBatteries: shareData.selected || [],
      });
      get().applyFilters();
    } catch (e) {
      console.error('Failed to load shared state:', e);
    }
  },
}));