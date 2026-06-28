"use client";

import { memo, useMemo } from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Province } from '../types';


interface AnimatedToggleProps<T extends string> {
  options: T[];
  value: T;
  onChange: (val: T) => void;
  displayMap?: Record<T, string>;
  ariaLabel: string;
}

function AnimatedToggle<T extends string>({ options, value, onChange, displayMap, ariaLabel }: AnimatedToggleProps<T>) {
  const index = options.indexOf(value);
  const widthPercentage = 100 / options.length;
  const translatePercentage = index * 100;

  return (
    <div 
      className="relative flex items-center bg-gray-100/80 rounded-xl border border-gray-200/50 p-1 w-full md:w-auto"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      <div 
        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-xs border border-gray-200/20 transition-transform duration-300 ease-out z-0"
        style={{ 
          width: `calc(${widthPercentage}% - 8px)`, 
          transform: `translateX(calc(${translatePercentage}% + 4px))` 
        }}
        aria-hidden="true"
      />
      
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          role="radio"
          aria-checked={value === opt}
          className={`relative z-10 flex-1 md:flex-none px-4 py-2 md:py-1.5 text-[11px] md:text-xs font-bold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            value === opt ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {displayMap ? displayMap[opt] : opt}
        </button>
      ))}
    </div>
  );
}

interface HeaderProps {
  currentProvince: Province | 'All';
  setCurrentProvince: (prov: Province | 'All') => void;
  totalAlerts: number;
}

const PROVINCES: (Province | 'All')[] = ['All', 'Province A', 'Province B'];
const PROVINCE_DISPLAY_MAP: Record<Province | 'All', string> = {
  'All': 'All Regions',
  'Province A': 'Province A',
  'Province B': 'Province B'
};

const Header = memo(function Header({
  currentProvince,
  setCurrentProvince,
  totalAlerts
}: HeaderProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(new Date());

  const scrollToCriticalAlerts = () => {
    const el = document.getElementById('dashboard-widgets-row');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex flex-col xl:flex-row xl:items-center justify-between space-y-4 xl:space-y-0 sticky top-0 z-30 shadow-2xs">
      
      <div className="flex items-center justify-between xl:justify-start xl:space-x-8">
        <div>
          <h2 className="text-lg md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
            Good morning, Director <span className="ml-2 text-xl md:text-2xl">👋</span>
          </h2>
          <p className="hidden md:block text-sm text-gray-500 mt-1 font-medium">
            Here is your daily operational briefing.
          </p>
        </div>

        <div className="xl:mt-0 flex items-center">
          {totalAlerts > 0 ? (
            <button 
              onClick={scrollToCriticalAlerts}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 shadow-2xs motion-safe:animate-pulse hover:bg-red-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shrink-0"
              aria-label={`${totalAlerts} critical alerts. Click to view details`}
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {totalAlerts} Alerts
            </button>
          ) : (
            <span 
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
              role="status"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Nominal
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 w-full xl:w-auto">
        <div 
          className="flex items-center text-[11px] md:text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full md:w-auto"
          title="Current operational date"
        >
          <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
          {formattedDate}
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="hidden md:flex bg-gray-50 p-2 rounded-xl border border-gray-100" title="Geographic Scope">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          
          <AnimatedToggle<Province | 'All'>
            options={PROVINCES}
            value={currentProvince}
            onChange={setCurrentProvince}
            displayMap={PROVINCE_DISPLAY_MAP}
            ariaLabel="Select geographic province"
          />
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;