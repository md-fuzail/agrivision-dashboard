"use client";

import { memo } from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

interface AttentionNeededListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onSelectFarm: (farmId: number) => void;
}

const AttentionNeededList = memo(function AttentionNeededList({
  tasks,
  onToggleTask,
  onSelectFarm
}: AttentionNeededListProps) {
  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
            <ClipboardList className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-gray-950">Attention Needed</h3>
        </div>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
          {activeTasks.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {activeTasks.length === 0 ? (
  <EmptyState 
    icon={CheckCircle2}
    title="No Attention Items"
    description="Everything scheduled is fully up to date!"
    iconColorClass="text-emerald-500"
  />
) : (
          activeTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onSelectFarm={() => onSelectFarm(task.farmId)}
            />
          ))
        )}
      </div>
    </div>
  );
});

AttentionNeededList.displayName = 'AttentionNeededList';

export default AttentionNeededList;