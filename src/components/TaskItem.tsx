"use client";

import { memo } from 'react';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { Task } from '../types';
import { formatDueDate } from '../utils/formatting';

const PRIORITY_STYLES = {
  High: 'bg-red-50 text-red-700 border-red-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  Low: 'bg-blue-50 text-blue-700 border-blue-100'
} as const;

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onSelectFarm: () => void;
}

const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onSelectFarm
}: TaskItemProps) {
  const isCompleted = task.completed;

  return (
    <div
      className={clsx(
        'flex items-start justify-between p-3 border rounded-xl transition-all duration-200',
        isCompleted
          ? 'bg-gray-50/50 border-gray-100 opacity-60'
          : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-sm'
      )}
    >
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        <button
          onClick={onToggle}
          aria-label={isCompleted ? `Mark incomplete: ${task.title}` : `Mark complete: ${task.title}`}
          aria-pressed={isCompleted}
          className={clsx(
            'mt-0.5 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 rounded',
            isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-amber-500'
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 fill-emerald-50" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline flex-wrap gap-x-2">
            <button
              onClick={onSelectFarm}
              aria-label={`View farm details for ${task.farmName}`}
              className={clsx(
                'group flex items-center text-xs font-bold focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1.5 py-0.5 -ml-1.5 transition-all',
                isCompleted 
                  ? 'text-gray-400' 
                  : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'
              )}
            >
              <span>{task.farmName}</span>
              {!isCompleted && (
                <ExternalLink className="h-3 w-3 ml-1 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              )}
            </button>
            <span
              className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
              title={task.dueDate}
            >
              {formatDueDate(task.dueDate)}
            </span>
          </div>

          <p
            className={clsx(
              'text-sm font-bold truncate mt-0.5',
              isCompleted ? 'line-through text-gray-400' : 'text-gray-950'
            )}
            title={task.title}
          >
            {task.title}
          </p>

          {!isCompleted && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5" title={task.description}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      {!isCompleted && (
        <span
          className={clsx(
            'text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0 focus-visible:ring-2 focus-visible:ring-offset-1',
            PRIORITY_STYLES[task.priority]
          )}
          title={`Priority level: ${task.priority}`}
        >
          {task.priority}
        </span>
      )}
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;