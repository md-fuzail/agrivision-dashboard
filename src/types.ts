export type Province = 'Province A' | 'Province B';
export type FarmStatus = 'Healthy' | 'Attention' | 'Critical';
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Alert {
  id: string;
  farmId: number;
  farmName: string;
  province: Province;
  title: string;
  severity: AlertSeverity;
  timestamp: string;
  duration: string;
  details: string;
  resolved: boolean;
}

export interface Task {
  id: string;
  farmId: number;
  farmName: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  assignedTo: string;
  description: string;
}

export interface HistoricalReading {
  date: string;
  production: number;
  waterUsage: number;
  soilMoisture: number;
}

export interface Farm {
  id: number;
  name: string;
  province: Province;
  status: FarmStatus;
  trend: number; // percentage change, e.g., +10, -8
  cropType: string;
  manager: string;
  temperature: number;
  soilMoisture: number;
  waterUsage: number; // in liters/day or similar metric
  irrigationActive: boolean;
  lastUpdated: string;
  description: string;
  history: HistoricalReading[];
}

 
export type TrendMetricId = 
  | 'trend-production' 
  | 'trend-revenue' 
  | 'trend-water' 
  | 'trend-healthy';
 
export interface TrendMetric {
  id: TrendMetricId;
  name: string;
  subtext?: string;
  value: string;
  type: 'increase' | 'decrease';
  sparklineData: number[]; 
  isPositive: boolean; 
  timePeriod?: string;
}