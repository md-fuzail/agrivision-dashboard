"use client";

import { memo, ElementType } from 'react';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  iconColorClass?: string; 
}

const EmptyState = memo(function EmptyState({
  icon: Icon,
  title,
  description,
  iconColorClass = "text-gray-400"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
      <Icon className={`h-12 w-12 mb-3 opacity-80 ${iconColorClass}`} />
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;