export function formatDueDate(dateString: string): string {
  // Handle special string cases from mock data
  if (dateString.toLowerCase() === 'today') {
    return '🔴 Due today';
  }
  
  if (dateString.toLowerCase() === 'tomorrow') {
    return '🟠 Due tomorrow';
  }

  // Handle ISO date strings (YYYY-MM-DD or timestamp)
  try {
    const dueDate = new Date(dateString);
    
    if (isNaN(dueDate.getTime())) {
      return '📅 Invalid date';
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    dueDate.setHours(0, 0, 0, 0); // Start of due date

    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const diffHours = diffTime / (1000 * 60 * 60);

    if (diffDays < 0) {
      return '⚠️ Overdue';
    }

    if (diffDays === 0) {
      return '🔴 Due today';
    }

    if (diffDays === 1) {
      return '🟠 Due tomorrow';
    }

    if (diffDays < 7) {
      return `📅 ${Math.floor(diffDays)}d away`;
    }

    return `📅 ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } catch {
    return '📅 Invalid date';
  }
}