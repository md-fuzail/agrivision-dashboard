"use client";

import { useState, useMemo, useEffect, memo } from 'react';
import { X, Droplets, Thermometer, User, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Send, Activity, Settings } from 'lucide-react';
import { Farm, Alert, Task, HistoricalReading } from '../types';

const STATUS_CONFIG = {
  Critical: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-900', badgeText: 'text-red-700', icon: ShieldAlert, iconColor: 'text-red-600' },
  Attention: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', badgeText: 'text-amber-800', icon: AlertTriangle, iconColor: 'text-amber-600' },
  Healthy: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', badgeText: 'text-emerald-800', icon: CheckCircle2, iconColor: 'text-emerald-600' }
} as const;

interface ChartProps {
  data: HistoricalReading[];
  trend: number;
  currentMoisture: number;
}

const HistoricalChart = memo(function HistoricalChart({ data, trend, currentMoisture }: ChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; date: string; production: number; moisture: number } | null>(null);

  const { points, linePaths } = useMemo(() => {
    const height = 140;
    const width = 340;
    const padding = 20;

    const maxProd = Math.max(...data.map(d => d.production));
    const minProd = Math.min(...data.map(d => d.production)) * 0.9;
    const prodRange = maxProd - minProd || 1;

    const maxMoisture = Math.max(...data.map(d => d.soilMoisture));
    const minMoisture = Math.min(...data.map(d => d.soilMoisture)) * 0.8; 
    const moistRange = maxMoisture - minMoisture || 1;

    const pts = data.map((d, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const yProd = height - padding - ((d.production - minProd) / prodRange) * (height - padding * 2.5);
      const yMoist = height - padding - ((d.soilMoisture - minMoisture) / moistRange) * (height - padding * 2.5);
      
      return { x, yProd, yMoist, val: d.production, date: d.date, moisture: d.soilMoisture };
    });

    return {
      points: pts,
      linePaths: {
        prod: `M ${pts.map(p => `${p.x},${p.yProd}`).join(' L ')}`,
        moist: `M ${pts.map(p => `${p.x},${p.yMoist}`).join(' L ')}`
      }
    };
  }, [data]);

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-4 relative">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
          <Activity className="h-4 w-4 mr-1 text-emerald-600" /> Trend Analysis
        </h5>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold transition-all duration-200">
          {hoveredPoint ? hoveredPoint.date : 'Hover Points'}
        </span>
      </div>

      <div className="flex space-x-4 mb-2">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block leading-none mb-0.5">Production</span>
            <span className="text-sm font-extrabold text-emerald-700 transition-all duration-200 leading-none">
              {hoveredPoint ? `${hoveredPoint.production}t` : `${trend >= 0 ? '+' : ''}${trend}%`}
            </span>
          </div>
        </div>
        <div className="border-l border-gray-200 pl-4 flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block leading-none mb-0.5">Moisture</span>
            <span className="text-sm font-extrabold text-blue-700 transition-all duration-200 leading-none">
              {hoveredPoint ? `${hoveredPoint.moisture}%` : `${currentMoisture}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-[140px] w-full flex items-center justify-center">
        <svg viewBox="0 0 340 140" className="w-full h-full overflow-visible">
          <line x1="20" y1="120" x2="320" y2="120" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="20" y1="20" x2="320" y2="20" stroke="#f3f4f6" strokeWidth="1" />
          
          <path d={linePaths.moist} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none opacity-60" />
          <path d={linePaths.prod} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />

          {points.map((p, index) => (
            <g key={index} className="cursor-pointer">
              <circle cx={p.x} cy={p.yMoist} r={hoveredPoint?.index === index ? "4" : "2.5"} fill={hoveredPoint?.index === index ? "#2563eb" : "#60a5fa"} stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-200 pointer-events-none" />
              <circle cx={p.x} cy={p.yProd} r={hoveredPoint?.index === index ? "5" : "3.5"} fill={hoveredPoint?.index === index ? "#047857" : "#34d399"} stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-200 pointer-events-none" />
              <text x={p.x} y="138" textAnchor="middle" className={`text-[10px] font-bold font-sans pointer-events-none transition-colors ${hoveredPoint?.index === index ? 'fill-gray-800' : 'fill-gray-400'}`}>
                {p.date}
              </text>
              <rect
                x={p.x - (340 / data.length) / 2}
                y={0}
                width={340 / data.length}
                height={140}
                fill={hoveredPoint?.index === index ? "rgba(0,0,0,0.03)" : "transparent"}
                className="transition-colors duration-200"
                onMouseEnter={() => setHoveredPoint({ index, date: p.date, production: p.val, moisture: p.moisture })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
});

interface FarmDetailDrawerProps {
  farm: Farm | null;
  alerts: Alert[];
  tasks: Task[];
  onClose: () => void;
  onRepairIrrigation: (farmId: number) => void;
  onSprayFungicide: (farmId: number) => void;
  onToggleIrrigationPump: (farmId: number) => void;
  onResolveTask: (taskId: string, farmId: number) => void;
}

export default function FarmDetailDrawer({
  farm,
  alerts,
  tasks,
  onClose,
  onRepairIrrigation,
  onSprayFungicide,
  onToggleIrrigationPump,
  onResolveTask
}: FarmDetailDrawerProps) {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!farm) return null;

  const farmAlerts = alerts.filter(a => a.farmId === farm.id && !a.resolved);
  const farmTasks = tasks.filter(t => t.farmId === farm.id && !t.completed);
  const config = STATUS_CONFIG[farm.status];
  const StatusIcon = config.icon;

  const hasIrrigationAlert = farmAlerts.some(a => a.title.toLowerCase().includes('irrigation'));
  const hasDiseaseAlert = farmAlerts.some(a => a.title.toLowerCase().includes('disease'));

  const getTaskActionConfig = (taskTitle: string) => {
    const title = taskTitle.toLowerCase();
    if (title.includes('harvest')) return { label: 'Dispatch Combine Harvesters', icon: CheckCircle2, bg: 'bg-amber-500 hover:bg-amber-600' };
    if (title.includes('fertilizer')) return { label: 'Approve Fertilizer Restock', icon: Send, bg: 'bg-blue-600 hover:bg-blue-700' };
    if (title.includes('maintenance')) return { label: 'Schedule Maintenance Crew', icon: Settings, bg: 'bg-purple-600 hover:bg-purple-700' };
    if (title.includes('training')) return { label: 'Log Training Completion', icon: User, bg: 'bg-indigo-600 hover:bg-indigo-700' };
    if (title.includes('fence')) return { label: 'Dispatch Fence Repair Crew', icon: Settings, bg: 'bg-stone-600 hover:bg-stone-700' };
    return { label: 'Mark Task Complete', icon: CheckCircle2, bg: 'bg-gray-800 hover:bg-gray-900' };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div onClick={onClose} aria-label="Close details" className="absolute inset-0 bg-gray-950/40 backdrop-blur-xs transition-opacity cursor-pointer"></div>

      <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-gray-100">
          
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border ${config.bg} ${config.badgeText} ${config.border}`}>
                #{farm.id}
              </span>
              <div>
                <h4 id="drawer-title" className="text-base font-extrabold text-gray-950 font-sans">{farm.name}</h4>
                <p className="text-xs text-gray-500 font-medium">Zone manager: {farm.manager}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close panel" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200/50 hover:text-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className={`p-4 rounded-xl flex items-start space-x-3 border ${config.bg} ${config.border} ${config.text}`}>
              <StatusIcon className={`h-5 w-5 mt-0.5 shrink-0 ${config.iconColor}`} />
              <div>
                <h5 className="text-sm font-bold">Zone Status: {farm.status}</h5>
                <p className="text-xs mt-0.5 font-medium leading-relaxed opacity-90">
                  {farm.status === 'Critical' 
                    ? 'Immediate intervention required to prevent yield loss.' 
                    : farm.status === 'Attention' || farmTasks.length > 0 
                    ? (farmTasks.length > 0 ? `Pending Operation: ${farmTasks[0].title}` : 'Routine adjustments required.') 
                    : 'All parameters within optimal biological ranges.'}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Zone Profile</h5>
              <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 border border-gray-100 p-3.5 rounded-xl">
                {farm.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Moisture</span>
                  <p className={`text-xl font-extrabold ${farm.soilMoisture < 25 ? "text-red-600 animate-pulse" : "text-gray-900"}`}>
                    {farm.soilMoisture}%
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${farm.soilMoisture < 25 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-500"}`}>
                  <Droplets className="h-5 w-5" />
                </div>
              </div>

              <div className="border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Temp</span>
                  <p className="text-xl font-extrabold text-gray-900">{farm.temperature}°C</p>
                </div>
                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                  <Thermometer className="h-5 w-5" />
                </div>
              </div>
            </div>

            {(farm.status !== 'Healthy' || farmTasks.length > 0) && (
              <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-amber-500" /> Executive Interventions
                </h5>

                {hasIrrigationAlert && (
                  <button onClick={() => onRepairIrrigation(farm.id)} className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-lg transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 outline-none">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Authorize Irrigation Pipe Repair</span>
                  </button>
                )}

                {hasDiseaseAlert && (
                  <button onClick={() => onSprayFungicide(farm.id)} className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-lg transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 outline-none">
                    <Send className="h-4 w-4" />
                    <span>Deploy Aerial Crop-Dusting Drone</span>
                  </button>
                )}

                {farmTasks.length > 0 && !hasIrrigationAlert && !hasDiseaseAlert && (
                  <button 
                    onClick={() => onResolveTask(farmTasks[0].id, farm.id)} 
                    className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-white rounded-lg transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 outline-none ${getTaskActionConfig(farmTasks[0].title).bg}`}
                  >
                    {(() => {
                      const ActionIcon = getTaskActionConfig(farmTasks[0].title).icon;
                      return <ActionIcon className="h-4 w-4" />;
                    })()}
                    <span>{getTaskActionConfig(farmTasks[0].title).label}</span>
                  </button>
                )}

                {farm.status === "Attention" && farmTasks.length === 0 && (
                  <button onClick={() => onToggleIrrigationPump(farm.id)} className={`w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold rounded-lg transition-all border focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ${farm.irrigationActive ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent focus-visible:ring-emerald-500'}`}>
                    <Droplets className="h-4 w-4" />
                    <span>{farm.irrigationActive ? 'Deactivate Irrigation Pump' : 'Initiate Standard Watering Cycle'}</span>
                  </button>
                )}
              </div>
            )}

            <HistoricalChart data={farm.history} trend={farm.trend} currentMoisture={farm.soilMoisture} />

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Active Zone Incidents</h5>
              {farmAlerts.length === 0 && farmTasks.length === 0 ? (
                <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                  <p className="text-xs font-semibold text-gray-600">All Clear</p>
                  <p className="text-xs text-gray-400 mt-1">No pending tasks or alerts.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {farmAlerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-start space-x-2.5">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-red-950">{alert.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{alert.details}</p>
                      </div>
                    </div>
                  ))}
                  {farmTasks.map(task => (
                    <div key={task.id} className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl flex items-start space-x-2.5">
                      <FileText className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-950">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}