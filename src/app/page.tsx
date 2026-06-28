"use client";

import React, { useState, useMemo } from 'react';
import { initialFarms, initialAlerts, initialTasks, initialTrends } from '../data';
import { Farm, Alert, Task, TrendMetric, Province, FarmStatus } from '../types';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MetricCards from '../components/MetricCards';
import CriticalAlertsList from '../components/CriticalAlertsList';
import AttentionNeededList from '../components/AttentionNeededList';
import PerformanceOverview from '../components/PerformanceOverview';
import FarmsGrid from '../components/FarmsGrid';
import FarmDetailDrawer from '../components/FarmDetailDrawer';
import DesignSpecView from '../components/DesignSpecView';
import { RefreshCw, Menu, Trees } from 'lucide-react';

/**
 * Custom Hook: Manages all dashboard state, filtering, and mutations.
 * Extracts business logic to maintain the Single Responsibility Principle in the UI component.
 */
function useDashboardState() {
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [trends, setTrends] = useState<TrendMetric[]>(initialTrends);
  
  const [currentProvince, setCurrentProvince] = useState<Province | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'attention' | 'healthy'>('all');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [resetAvailable, setResetAvailable] = useState<boolean>(false);

  // --- Core State Mutators ---
  
  const updateFarmState = (farmId: number, updates: Partial<Farm>) => {
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, ...updates } : f));
    setSelectedFarm(prev => prev?.id === farmId ? { ...prev, ...updates } : prev);
    setResetAvailable(true);
  };

  const handleResetData = () => {
    setFarms(structuredClone(initialFarms));
    setAlerts(structuredClone(initialAlerts));
    setTasks(structuredClone(initialTasks));
    setTrends(structuredClone(initialTrends));
    setSelectedFarm(null);
    setResetAvailable(false);
  };

  // --- Filtering & Derived State ---

  const regionalFarms = useMemo(() => {
    return currentProvince === 'All' ? farms : farms.filter(f => f.province === currentProvince);
  }, [farms, currentProvince]);

  const regionalAlerts = useMemo(() => {
    return currentProvince === 'All' ? alerts : alerts.filter(a => a.province === currentProvince);
  }, [alerts, currentProvince]);

  const regionalTasks = useMemo(() => {
    const regionalFarmIds = new Set(regionalFarms.map(f => f.id));
    return tasks.filter(t => regionalFarmIds.has(t.farmId));
  }, [tasks, regionalFarms]);

  const filteredFarms = useMemo(() => {
    if (filterStatus === 'critical') return regionalFarms.filter(f => f.status === 'Critical');
    if (filterStatus === 'healthy') return regionalFarms.filter(f => f.status === 'Healthy');
    if (filterStatus === 'attention') return regionalFarms.filter(f => tasks.some(t => t.farmId === f.id && !t.completed));
    return regionalFarms;
  }, [regionalFarms, filterStatus, tasks]);

  // --- KPI Calculations ---

  const activeAlertsCount = useMemo(() => regionalAlerts.filter(a => !a.resolved).length, [regionalAlerts]);
  const activeTasksCount = useMemo(() => regionalTasks.filter(t => !t.completed).length, [regionalTasks]);

  const overallHealthScore = useMemo(() => {
    const total = regionalFarms.length;
    if (total === 0) return 100;
    const critical = regionalFarms.filter(f => f.status === 'Critical').length;
    const attention = regionalFarms.filter(f => f.status === 'Attention').length;
    const score = ((total - critical - (attention * 0.3)) / total) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [regionalFarms]);

  const currentTrends = useMemo(() => {
    const totalCount = regionalFarms.length;
    if (totalCount === 0) return trends;

    const avgProductionTrend = Math.round(regionalFarms.reduce((sum, f) => sum + (f.trend || 0), 0) / totalCount);
    const avgRevenueTrend = Math.round(avgProductionTrend * 0.85);
    const avgMoisture = regionalFarms.reduce((sum, f) => sum + (f.soilMoisture || 40), 0) / totalCount;
    const waterUsageTrend = Math.round(40 - avgMoisture); 
    const healthyCount = regionalFarms.filter(f => f.status === 'Healthy').length;

    return trends.map((trend): TrendMetric => {
      switch (trend.id) {
        case 'trend-production':
          return { ...trend, value: `${avgProductionTrend >= 0 ? '+' : ''}${avgProductionTrend}%`, type: avgProductionTrend >= 0 ? 'increase' : 'decrease' };
        case 'trend-revenue':
          return { ...trend, value: `${avgRevenueTrend >= 0 ? '+' : ''}${avgRevenueTrend}%`, type: avgRevenueTrend >= 0 ? 'increase' : 'decrease' };
        case 'trend-water':
          return { ...trend, value: `${waterUsageTrend >= 0 ? '+' : ''}${waterUsageTrend}%`, type: waterUsageTrend >= 0 ? 'increase' : 'decrease' };
        case 'trend-healthy':
          return { ...trend, value: `${healthyCount} / ${totalCount}`, type: healthyCount >= (totalCount * 0.75) ? 'increase' : 'decrease' };
        default:
          return trend;
      }
    });
  }, [trends, regionalFarms]);

  // --- Action Handlers ---

  const handleToggleTask = (taskId: string) => {
    setResetAvailable(true);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleResolveAlert = (alertId: string) => {
    const targetAlert = alerts.find(a => a.id === alertId);
    if (!targetAlert) return;
    
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    
    const remaining = alerts.filter(a => a.farmId === targetAlert.farmId && a.id !== alertId && !a.resolved);
    if (remaining.length === 0) {
      updateFarmState(targetAlert.farmId, { status: 'Healthy' as FarmStatus });
    }
  };

  const handleResolveTask = (taskId: string, farmId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    updateFarmState(farmId, { status: 'Healthy' as FarmStatus });
  };

  const handleRepairIrrigation = (farmId: number) => {
    setAlerts(prev => prev.map(a => a.farmId === farmId && a.title.includes('Irrigation') ? { ...a, resolved: true } : a));
    updateFarmState(farmId, { status: 'Healthy' as FarmStatus, soilMoisture: 42 });
  };

  const handleSprayFungicide = (farmId: number) => {
    setAlerts(prev => prev.map(a => a.farmId === farmId && a.title.includes('Crop disease') ? { ...a, resolved: true } : a));
    updateFarmState(farmId, { status: 'Healthy' as FarmStatus });
  };

  const handleToggleIrrigationPump = (farmId: number) => {
    const targetFarm = farms.find(f => f.id === farmId);
    if (!targetFarm) return;
    
    const isNowActive = !targetFarm.irrigationActive;
    const newMoisture = isNowActive ? Math.min(45, targetFarm.soilMoisture + 8) : Math.max(25, targetFarm.soilMoisture - 5);
    
    updateFarmState(farmId, { irrigationActive: isNowActive, soilMoisture: newMoisture, lastUpdated: "Just now" });
  };

  return {
    state: {
      farms, alerts, tasks, trends, currentProvince, filterStatus, selectedFarm, resetAvailable, isMobileMenuOpen: false, activeTab: 'overview', activeView: 'dashboard' as const,
      regionalFarms, regionalAlerts, regionalTasks, filteredFarms, activeAlertsCount, activeTasksCount, overallHealthScore, currentTrends
    },
    actions: {
      setCurrentProvince, setFilterStatus, setSelectedFarm, handleResetData, handleToggleTask, handleResolveAlert, handleResolveTask, handleRepairIrrigation, handleSprayFungicide, handleToggleIrrigationPump
    }
  };
}

export default function Home() {
  const { state, actions } = useDashboardState();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div id="app-root-container" className="flex h-screen bg-[#fcfdfd] text-gray-900 overflow-hidden font-sans relative">
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-40 xl:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out xl:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { 
            setActiveTab(tab);
            setIsMobileMenuOpen(false); 
          }} 
          criticalAlertsCount={state.activeAlertsCount} 
        />
      </div>

      <div id="main-scrollable-content" className="flex-1 flex flex-col h-screen overflow-hidden w-full transition-all duration-300 xl:ml-20 2xl:ml-64">
        
        <div className="xl:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
              <Trees className="h-5 w-5 text-emerald-600" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">AgriVision</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Header 
          currentProvince={state.currentProvince} 
          setCurrentProvince={actions.setCurrentProvince}
          totalAlerts={state.activeAlertsCount} 
        />

        {activeTab === 'design-spec' ? <DesignSpecView /> : (
          <div className="flex-1 overflow-y-auto pb-12">
            
            {state.resetAvailable && (
              <div id="demo-reset-banner" className="mx-4 md:mx-8 mt-5 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold text-emerald-800 shadow-2xs gap-3 sm:gap-0">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 shrink-0"></span>
                  Telemetry updated. Reset to initial state available.
                </span>
                <button onClick={actions.handleResetData} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all text-[11px] w-full sm:w-auto justify-center">
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset States</span>
                </button>
              </div>
            )}
            
            <MetricCards 
              activeFilter={state.filterStatus} 
              onFilterChange={actions.setFilterStatus} 
              stats={{
                farmCount: state.regionalFarms.length,
                criticalAlerts: state.activeAlertsCount,
                pendingTasks: state.activeTasksCount,
                healthScore: state.overallHealthScore,
              }} 
            />

            {state.filterStatus === 'all' && (
              <div id="dashboard-widgets-row" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 py-2 mb-4">
                <div className="h-[360px] min-w-0">
                  <CriticalAlertsList 
                    alerts={state.regionalAlerts.filter(a => !a.resolved)} 
                    onResolveAlert={actions.handleResolveAlert} 
                    onSelectFarm={(id) => actions.setSelectedFarm(state.farms.find(f => f.id === id) || null)} 
                  />
                </div>
                <div className="h-[360px] min-w-0">
                  <AttentionNeededList 
                    tasks={state.regionalTasks} 
                    onToggleTask={actions.handleToggleTask} 
                    onSelectFarm={(id) => actions.setSelectedFarm(state.farms.find(f => f.id === id) || null)} 
                  />
                </div>
                <div className="h-[360px] min-w-0 lg:col-span-2 xl:col-span-1">
                  <PerformanceOverview trends={state.currentTrends} />
                </div>
              </div>
            )}

            <FarmsGrid 
              farms={state.filteredFarms} 
              onSelectFarm={(f) => actions.setSelectedFarm(f)} 
            />
          </div>
        )}
      </div>

      {state.selectedFarm && (
        <FarmDetailDrawer 
          farm={state.selectedFarm} 
          alerts={state.alerts} 
          tasks={state.tasks} 
          onClose={() => actions.setSelectedFarm(null)} 
          onRepairIrrigation={actions.handleRepairIrrigation} 
          onSprayFungicide={actions.handleSprayFungicide} 
          onToggleIrrigationPump={actions.handleToggleIrrigationPump} 
          onResolveTask={actions.handleResolveTask}
        />
      )}
    </div>
  );
}