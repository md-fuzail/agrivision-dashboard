"use client";

import { memo } from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { Alert } from '../types';

const SEVERITY_STYLES = {
  Critical: 'bg-red-50 text-red-700 border-red-100',
  Warning: 'bg-amber-50 text-amber-700 border-amber-100',
  Info: 'bg-blue-50 text-blue-700 border-blue-100'
} as const;

interface AlertItemProps {
  alert: Alert;
  onResolve: () => void;
  onSelectFarm: () => void;
}

const AlertItem = memo(function AlertItem({
  alert,
  onResolve,
  onSelectFarm
}: AlertItemProps) {
  const Icon = alert.severity === 'Critical' ? ShieldAlert 
             : alert.severity === 'Warning' ? AlertTriangle 
             : Info;

  return (
    <div className="flex items-start justify-between p-3.5 bg-white border border-gray-100 hover:border-red-200 rounded-xl shadow-2xs hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        
        <div className={clsx('p-1.5 rounded-lg border mt-0.5 shrink-0', SEVERITY_STYLES[alert.severity])}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline flex-wrap gap-x-2">
            <button
              onClick={onSelectFarm}
              aria-label={`View farm details for ${alert.farmName}`}
              className="group flex items-center text-xs font-bold text-gray-800 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1.5 py-0.5 -ml-1.5 transition-all"
            >
              <span>{alert.farmName}</span>
              <ExternalLink className="h-3 w-3 ml-1 text-gray-400 group-hover:text-red-600 transition-colors" />
            </button>
            <span className="text-[10px] font-semibold text-gray-400">
              • {alert.duration}
            </span>
          </div>

          <p className="text-sm font-bold text-gray-950 truncate mt-0.5" title={alert.title}>
            {alert.title}
          </p>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1" title={alert.details}>
            {alert.details}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2 shrink-0 ml-3">
        <span
          className={clsx('text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase', SEVERITY_STYLES[alert.severity])}
          title={`Severity level: ${alert.severity}`}
        >
          {alert.severity}
        </span>
        
        <button
          onClick={onResolve}
          aria-label={`Resolve alert: ${alert.title}`}
          className="flex items-center space-x-1 px-2 py-1 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-[10px] font-bold text-gray-600 hover:text-emerald-700 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Resolve</span>
        </button>
      </div>
    </div>
  );
});

AlertItem.displayName = 'AlertItem';

export default AlertItem;