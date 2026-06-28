"use client";

import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconBg: string;
  pulse?: boolean;
  clickable: boolean;
  trendDir?: 'up' | 'down' | 'neutral';
  isActive: boolean;
  onClick: () => void;
}

const MetricCard = memo(function MetricCard({
  label, 
  value, 
  subtext, 
  icon: IconComponent, 
  iconBg, 
  pulse, 
  clickable, 
  trendDir, 
  isActive, 
  onClick
}: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      aria-pressed={isActive}
      className={`bg-white border p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl flex flex-row items-center justify-between transition-all duration-300 shadow-xs min-h-[110px] sm:min-h-[120px] md:h-[140px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        clickable ? 'cursor-pointer hover:shadow-md hover:border-emerald-300' : 'cursor-default opacity-90 pointer-events-none'
      } ${isActive ? 'ring-2 ring-emerald-500 border-transparent shadow-sm' : 'border-gray-100'}`}
    >
      <div className="space-y-1 h-full flex flex-col justify-center flex-1 min-w-0 pr-2">
        <p className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider text-gray-400 uppercase font-sans truncate">
          {label}
        </p>
        
        <div className="flex items-baseline space-x-1.5 sm:space-x-2">
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-950 font-sans tracking-tight truncate">
            {value}
          </span>
          
          {trendDir && (
            <span className={`text-[9px] md:text-[11px] font-bold flex items-center px-1 sm:px-1.5 py-0.5 rounded-md shrink-0 ${
              trendDir === 'up' ? 'text-emerald-600 bg-emerald-50' : 
              trendDir === 'down' ? 'text-red-600 bg-red-50' : 
              'text-gray-500 bg-gray-50'
            }`}>
              {trendDir === 'up' ? '↗' : trendDir === 'down' ? '↘' : '→'}
            </span>
          )}
        </div>
        
        <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-400 leading-tight min-h-[1.5em] line-clamp-2">
          {subtext}
        </p>
      </div>

      <div className={`p-2.5 sm:p-3 md:p-4 rounded-lg md:rounded-xl flex items-center justify-center relative shrink-0 ${iconBg}`}>
        {pulse && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500"></span>
          </span>
        )}
        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </div>
    </button>
  );
});

MetricCard.displayName = 'MetricCard';
export default MetricCard;