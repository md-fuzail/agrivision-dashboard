"use client";

import React, { memo, useId } from 'react';
import { 
  TrendingUp, 
  Percent, 
  Droplets, 
  Heart, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  LucideIcon
} from 'lucide-react';
import { TrendMetric } from '../types';


type TrendConfig = {
  icon: LucideIcon;
  color: string;
  bgClass: string;
  iconColor: string;
};

const TREND_CONFIGS: Record<string, TrendConfig> = {
  'trend-production': { 
    icon: Percent, 
    color: '#10b981', 
    bgClass: 'bg-emerald-50 border-emerald-100', 
    iconColor: 'text-emerald-600' 
  },
  'trend-revenue': { 
    icon: TrendingUp, 
    color: '#10b981', 
    bgClass: 'bg-emerald-50 border-emerald-100', 
    iconColor: 'text-emerald-600' 
  },
  'trend-water': { 
    icon: Droplets, 
    color: '#3b82f6', 
    bgClass: 'bg-blue-50 border-blue-100', 
    iconColor: 'text-blue-500' 
  },
  'trend-healthy': { 
    icon: Heart, 
    color: '#10b981', 
    bgClass: 'bg-emerald-50 border-emerald-100', 
    iconColor: 'text-emerald-500' 
  }
};

function getTrendConfig(id: string): TrendConfig {
  const config = TREND_CONFIGS[id];
  if (!config) {
    throw new Error(`Unknown trend metric ID: ${id}. Valid IDs are: ${Object.keys(TREND_CONFIGS).join(', ')}`);
  }
  return config;
}


interface SparklineProps {
  data: number[];
  color: string;
  name: string;
}

const Sparkline = memo(function Sparkline({ data, color, name }: SparklineProps) {
  const gradientId = useId();
  
  if (!data || data.length === 0) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const height = 30;
  const width = 100;
  
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  
  return (
    <div className="flex items-center w-full min-w-0">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="none"
        className="w-full overflow-visible h-[30px]"
        aria-label={`Trend chart for ${name}`}
        role="img"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L ${width},${height} L 0,${height} Z`} fill={`url(#${gradientId})`} stroke="none" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});


function getArrowColor(isPositive: boolean): string {
  return isPositive ? 'text-emerald-600' : 'text-red-500';
}

function getTrendDirection(type: 'increase' | 'decrease', isPositive: boolean): string {
  if (type === 'increase') {
    return isPositive ? 'Trending up' : 'Increased (negative)';
  }
  return isPositive ? 'Trending down (good)' : 'Trending down';
}


const MetricRow = memo(function MetricRow({ trend }: { trend: TrendMetric }) {
  const config = getTrendConfig(trend.id);
  const IconComponent = config.icon;
  
  return (
    <div
      id={`performance-row-${trend.id}`}
      className="flex items-center justify-between p-1.5 md:p-2 rounded-xl hover:bg-gray-50/50 transition-colors w-full min-w-0 gap-x-2 md:gap-x-4"
    >
      <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0 pr-1">
        <div className={`p-1.5 rounded-lg border shrink-0 ${config.bgClass}`}>
          <IconComponent className={`h-3.5 w-3.5 md:h-4.5 md:w-4.5 ${config.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[11px] md:text-sm font-bold text-gray-900 font-sans leading-tight line-clamp-2">
            {trend.name}
          </h4>
          {trend.subtext && (
            <p className="text-[9px] md:text-[10px] 2xl:text-[11px] text-gray-400 font-semibold leading-none mt-0.5 truncate">
              {trend.subtext}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-w-[40px] max-w-[200px] shrink">
        <Sparkline 
          data={trend.sparklineData} 
          color={config.color} 
          name={trend.name}
        />
      </div>

      <div className="text-right flex items-center space-x-0.5 md:space-x-1.5 shrink-0 pl-1">
        <span className="text-[11px] md:text-sm font-extrabold text-gray-950 font-sans">
          {trend.value}
        </span>
        {trend.type === 'increase' && (
          <ArrowUpRight 
            className={`h-3 w-3 md:h-4 md:w-4 shrink-0 ${getArrowColor(trend.isPositive)}`}
            aria-label={getTrendDirection('increase', trend.isPositive)}
          />
        )}
        {trend.type === 'decrease' && (
          <ArrowDownRight 
            className={`h-3 w-3 md:h-4 md:w-4 shrink-0 ${getArrowColor(trend.isPositive)}`}
            aria-label={getTrendDirection('decrease', trend.isPositive)}
          />
        )}
      </div>
    </div>
  );
});


interface PerformanceOverviewProps {
  trends: TrendMetric[];
}

export default function PerformanceOverview({ trends }: PerformanceOverviewProps) {
  const handleViewReport = () => {
    // TODO: Navigate to detailed report or open modal
    console.log('View report clicked');
  };

  return (
    <div id="performance-widget" className="bg-white border border-gray-100 rounded-2xl p-4 lg:p-4 2xl:p-6 shadow-xs flex flex-col h-full min-w-0 overflow-hidden">
      <div className="flex items-center justify-between pb-3 lg:pb-2 2xl:pb-4 border-b border-gray-50 mb-3 lg:mb-2 2xl:mb-4 shrink-0 min-w-0">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100 shrink-0">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
          </div>
          <h3 className="text-sm md:text-base font-bold text-gray-950 font-sans truncate">
            Performance Overview
          </h3>
        </div>
        <button 
          id="btn-view-report" 
          onClick={handleViewReport}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
          aria-label="View detailed performance report"
        >
          View report
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-2 lg:space-y-1.5 2xl:space-y-3 min-w-0 pb-1">
        {trends && trends.length > 0 ? (
          trends.map((trend) => (
            <MetricRow key={trend.id} trend={trend} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-xs font-semibold text-gray-400">
            No trend data available.
          </div>
        )}
      </div>
    </div>
  );
}