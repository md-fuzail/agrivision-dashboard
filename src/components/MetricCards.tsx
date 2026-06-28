"use client";

import { memo } from 'react';
import { Home, AlertTriangle, ClipboardList, TrendingUp, LucideIcon } from 'lucide-react';
import MetricCard from './MetricCard';

export type FilterStatus = 'all' | 'critical' | 'attention' | 'healthy';

interface MetricCardsProps {
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  stats: {
    criticalAlerts: number;
    pendingTasks: number;
    healthScore: number;
    farmCount: number;
    healthTrend?: 'up' | 'down' | 'neutral';
  };
}

type CardConfig = {
  id: FilterStatus;
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconBg: string;
  pulse?: boolean;
  clickable: boolean;
  trendDir?: 'up' | 'down' | 'neutral';
};

const MetricCards = memo(function MetricCards({
  activeFilter,
  onFilterChange,
  stats
}: MetricCardsProps) {

  const cards: CardConfig[] = [
    { 
      id: 'all', 
      label: 'Total Farms', 
      value: stats.farmCount.toString(), 
      subtext: 'Across 2 provinces', 
      icon: Home, 
      iconBg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20', 
      clickable: true 
    },
    { 
      id: 'critical', 
      label: 'Critical Alerts', 
      value: stats.criticalAlerts.toString(), 
      subtext: stats.criticalAlerts > 0 ? 'Require immediate action' : 'All systems clear', 
      icon: AlertTriangle, 
      iconBg: stats.criticalAlerts > 0 ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-gray-200/50 text-gray-400 border border-gray-200', 
      pulse: stats.criticalAlerts > 0, 
      clickable: stats.criticalAlerts > 0 
    },
    { 
      id: 'attention', 
      label: 'Pending Tasks', 
      value: stats.pendingTasks.toString(), 
      subtext: stats.pendingTasks > 0 ? 'Need your attention' : 'All tasks completed', 
      icon: ClipboardList, 
      iconBg: stats.pendingTasks > 0 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-gray-200/50 text-gray-400 border border-gray-200', 
      clickable: stats.pendingTasks > 0 
    },
    { 
      id: 'healthy', 
      label: 'Overall Health', 
      value: `${stats.healthScore}%`, 
      subtext: stats.healthScore >= 75 ? 'Good status' : 'Needs observation', 
      icon: TrendingUp, 
      iconBg: 'bg-teal-500/10 text-teal-600 border border-teal-500/20', 
      trendDir: stats.healthTrend || 'up',
      clickable: true 
    }
  ];

  return (
    <div id="metrics-grid" className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-6">
      {cards.map((card) => (
        <MetricCard
          key={card.id}
          {...card}
          isActive={activeFilter === card.id}
          onClick={() => card.clickable && onFilterChange(card.id)}
        />
      ))}
    </div>
  );
});

MetricCards.displayName = 'MetricCards';
export default MetricCards;