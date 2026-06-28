import { Wheat, Sun, Sprout, Nut, Orbit } from 'lucide-react';
import { FarmStatus } from '../types';

export const getCropIcon = (crop: string) => {
  switch (crop.toLowerCase()) {
    case 'wheat': return Wheat;
    case 'sunflowers': return Sun;
    case 'canola': return Orbit;
    case 'potatoes': return Nut;
    default: return Sprout;
  }
};

export const STATUS_STYLES: Record<FarmStatus, { badge: string; iconBox: string; cardBorder: string }> = {
  Critical: { 
    badge: 'bg-red-50 text-red-700', 
    iconBox: 'bg-red-50/50 border-red-100 text-red-600',
    cardBorder: 'border-red-100 hover:border-red-300'
  },
  Attention: { 
    badge: 'bg-amber-100/50 text-amber-800', 
    iconBox: 'bg-amber-50/50 border-amber-100 text-amber-600',
    cardBorder: 'border-amber-100 hover:border-amber-300'
  },
  Healthy: { 
    badge: 'bg-[#FDF8E8] text-[#3E7B50]', 
    iconBox: 'bg-emerald-50/30 border-emerald-50 text-emerald-600',
    cardBorder: 'border-gray-100 hover:border-emerald-300'
  }
};