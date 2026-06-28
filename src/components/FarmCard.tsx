"use client";

import { memo } from 'react';
import { ArrowUpRight, ArrowDownRight, Droplets, Thermometer } from 'lucide-react';
import { Farm } from '../types';
import { getCropIcon, STATUS_STYLES } from '../utils/farmStyles';
import clsx from 'clsx';

interface FarmCardProps {
  farm: Farm;
  onClick: () => void;
}

const FarmCard = memo(function FarmCard({ farm, onClick }: FarmCardProps) {
  const CropIcon = getCropIcon(farm.cropType);
  const styles = STATUS_STYLES[farm.status];

  return (
    <button
      onClick={onClick}
      aria-label={`View details for ${farm.name}, Status: ${farm.status}`}
      className={clsx(
        "bg-white border rounded-[14px] p-4 shadow-xs hover:shadow-xl hover:scale-105 hover:z-10 transition-all duration-300 relative flex flex-col items-center text-center h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
        styles.cardBorder
      )}
    >
      <div className="absolute top-4 left-4 text-xs font-extrabold text-gray-400">
        #{farm.id}
      </div>

      <div className={clsx("mt-5 mb-3 h-12 w-12 rounded-full flex items-center justify-center border-2", styles.iconBox)}>
        <CropIcon className="h-5 w-5" />
      </div>

      <h4 className="text-sm font-extrabold text-gray-900 font-sans leading-tight w-full truncate">
        {farm.name}
      </h4>
      <p className="text-xs text-gray-500 font-medium mt-1 w-full truncate mb-4">
        {farm.cropType} • {farm.province}
      </p>

      <span className={clsx("text-[11px] font-bold px-4 py-1.5 rounded-full mb-3 tracking-wide", styles.badge)}>
        {farm.status}
      </span>

      <span className={clsx("text-sm font-extrabold flex items-center justify-center mb-4", farm.trend >= 0 ? 'text-[#3E7B50]' : 'text-red-600')}>
        {farm.trend >= 0 ? `+${farm.trend}%` : `${farm.trend}%`}
        {farm.trend >= 0 ? <ArrowUpRight className="h-4 w-4 ml-1" /> : <ArrowDownRight className="h-4 w-4 ml-1" />}
      </span>

      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 mb-2 w-full border-t border-gray-50 pt-3">
        <div className="flex items-center" title="Soil Moisture">
          <Droplets className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
          <span className={farm.soilMoisture < 25 ? "text-red-500 font-extrabold" : ""}>
            {farm.soilMoisture}% {farm.soilMoisture < 25 && <span className="sr-only">(Critical)</span>}
          </span>
        </div>
        <div className="flex items-center" title="Temperature">
          <Thermometer className="h-3.5 w-3.5 text-orange-400 mr-1.5" />
          <span>{farm.temperature}°C</span>
        </div>
      </div>
    </button>
  );
});

FarmCard.displayName = 'FarmCard';
export default FarmCard;