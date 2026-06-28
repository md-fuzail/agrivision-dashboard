"use client";

import { memo } from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Alert } from '../types';
import AlertItem from './AlertItem';
import EmptyState from './EmptyState';

interface CriticalAlertsListProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onSelectFarm: (farmId: number) => void;
}

const CriticalAlertsList = memo(function CriticalAlertsList({
  alerts,
  onResolveAlert,
  onSelectFarm
}: CriticalAlertsListProps) {
  
  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-red-50 p-2 rounded-lg border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-base font-bold text-gray-950">Critical Alerts</h3>
        </div>
        <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
          {activeAlerts.length} Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {activeAlerts.length === 0 ? (
          <EmptyState 
            icon={ShieldCheck}
            title="No Critical Alerts"
            description="All regional systems are operating nominally."
            iconColorClass="text-emerald-500"
          />
        ) : (
          activeAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onResolve={() => onResolveAlert(alert.id)}
              onSelectFarm={() => onSelectFarm(alert.farmId)}
            />
          ))
        )}
      </div>
    </div>
  );
});

CriticalAlertsList.displayName = 'CriticalAlertsList';

export default CriticalAlertsList;