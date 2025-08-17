// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useBatteryStore } from '@/store/batteryStore';
import Header from '@/components/Header';
import ChartContainer from '@/components/ChartContainer';
import FilterPanel from '@/components/FilterPanel';
import ComparisonTable from '@/components/ComparisonTable';
import RecommendationEngine from '@/components/RecommendationEngine';
import TCOCalculator from '@/components/TCOCalculator';
import ExportControls from '@/components/ExportControls';
import PresentationMode from '@/components/PresentationMode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Battery, ChartCircle, Calculator, Filter, 
  Lightbulb, Table, Presentation, Moon, Sun 
} from 'lucide-react';

export default function Home() {
  const { theme, setTheme, presentationMode, loadShareableState } = useBatteryStore();
  const [activeTab, setActiveTab] = useState('visualize');

  useEffect(() => {
    // Load shared state from URL if present
    const params = new URLSearchParams(window.location.search);
    const sharedState = params.get('state');
    if (sharedState) {
      loadShareableState(sharedState);
    }

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, loadShareableState]);

  if (presentationMode) {
    return <PresentationMode />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 transition-all duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <Header />
        
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-700 group-hover:rotate-12 transition-transform" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" />
            )}
          </button>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg">
              <TabsTrigger value="visualize" className="flex items-center gap-2">
                <ChartCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Visualize</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
              <TabsTrigger value="recommend" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Recommend</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">TCO</span>
              </TabsTrigger>
              <TabsTrigger value="filter" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </TabsTrigger>
              <TabsTrigger value="present" className="flex items-center gap-2">
                <Presentation className="w-4 h-4" />
                <span className="hidden sm:inline">Present</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualize" className="space-y-6 animate-fadeIn">
              <ChartContainer />
              <ExportControls />
            </TabsContent>

            <TabsContent value="compare" className="animate-fadeIn">
              <ComparisonTable />
            </TabsContent>

            <TabsContent value="recommend" className="animate-fadeIn">
              <RecommendationEngine />
            </TabsContent>

            <TabsContent value="calculator" className="animate-fadeIn">
              <TCOCalculator />
            </TabsContent>

            <TabsContent value="filter" className="animate-fadeIn">
              <FilterPanel />
            </TabsContent>

            <TabsContent value="present" className="animate-fadeIn">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                  Presentation Mode
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Enter presentation mode for a clean, distraction-free view perfect for conferences and meetings.
                </p>
                <button
                  onClick={() => useBatteryStore.getState().setPresentationMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Enter Presentation Mode
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}