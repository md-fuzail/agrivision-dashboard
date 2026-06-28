"use client";

import { memo } from 'react';
import { Droplets } from 'lucide-react';
import { Farm } from '../types';
import { getCropIcon, STATUS_STYLES } from '../utils/farmStyles';
import clsx from 'clsx';

interface FarmRowProps {
  farm: Farm;
  onClick: () => void;
}

const FarmRow = memo(function FarmRow({ farm, onClick }: FarmRowProps) {
  const CropIcon = getCropIcon(farm.cropType);
  const styles = STATUS_STYLES[farm.status];

  return (
    <tr className="hover:bg-gray-50/40 transition-colors border-b border-gray-50 last:border-0">
      <td className="py-4 px-6 text-center">
        <span className="text-xs font-bold text-gray-400">#{farm.id}</span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className={clsx("p-2 rounded-lg border", styles.iconBox)}>
            <CropIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-gray-950 text-sm">{farm.name}</p>
            <p className="text-xs text-gray-400 font-medium">{farm.cropType}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-gray-500 font-medium">{farm.province}</td>
      <td className="py-4 px-6">
        <span className={clsx("text-[11px] font-bold px-2.5 py-1 rounded-full", styles.badge)}>
          {farm.status}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-1.5 text-sm text-gray-700">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span className={farm.soilMoisture < 25 ? "text-red-600 font-extrabold" : ""}>
            {farm.soilMoisture}%
          </span>
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600 font-medium">{farm.temperature}°C</td>
      <td className="py-4 px-6 text-right">
        <span className={clsx("inline-flex items-center text-xs font-extrabold", farm.trend >= 0 ? 'text-emerald-600' : 'text-red-500')}>
          {farm.trend >= 0 ? '+' : ''}{farm.trend}%
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <button
          onClick={onClick}
          aria-label={`View details for ${farm.name}`}
          className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-xs font-bold text-gray-700 hover:text-emerald-700 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Details
        </button>
      </td>
    </tr>
  );
});

FarmRow.displayName = 'FarmRow';
export default FarmRow;