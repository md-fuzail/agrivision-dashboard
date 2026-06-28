"use client";

import { useState, useMemo } from 'react';
import { LayoutGrid, List, Search, ShieldAlert } from 'lucide-react';
import { Farm } from '../types';
import FarmCard from './FarmCard';
import FarmRow from './FarmRow';

interface FarmsGridProps {
  farms: Farm[];
  onSelectFarm: (farm: Farm) => void;
}

type SortOption = 'id' | 'name' | 'trend' | 'moisture';

export default function FarmsGrid({ farms, onSelectFarm }: FarmsGridProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('id');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  // Performance Optimization: Memoize the search and sort
  const filteredFarms = useMemo(() => {
    return farms
      .filter((farm) => {
        const query = searchQuery.toLowerCase();
        if (!query) return true;
        return (
          farm.name.toLowerCase().includes(query) ||
          farm.cropType.toLowerCase().includes(query) ||
          farm.manager.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'trend': return b.trend - a.trend;
          case 'moisture': return a.soilMoisture - b.soilMoisture;
          default: return a.id - b.id;
        }
      });
  }, [farms, searchQuery, sortBy]);

  return (
    <div id="farms-at-glance-section" className="px-4 md:px-8 py-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-950 font-sans">Farms at a Glance</h3>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Showing {filteredFarms.length} operational zones
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search farms"
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-40 sm:w-56 transition-all"
            />
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 focus-within:ring-2 focus-within:ring-emerald-500">
            <label htmlFor="farm-sort-select" className="text-gray-400 mr-2 hidden sm:inline">Sort:</label>
            <select
              id="farm-sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-gray-800"
            >
              <option value="id">Index</option>
              <option value="name">A-Z</option>
              <option value="trend">Growth</option>
              <option value="moisture">Dry First</option>
            </select>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/50">
            <button
              onClick={() => setLayoutMode('grid')}
              aria-label="View as grid"
              aria-pressed={layoutMode === 'grid'}
              className={`p-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                layoutMode === 'grid' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              aria-label="View as list"
              aria-pressed={layoutMode === 'list'}
              className={`p-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                layoutMode === 'list' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredFarms.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-semibold text-gray-800">
            {searchQuery ? `No farms match "${searchQuery}"` : "No farms available"}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-5">
          {filteredFarms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} onClick={() => onSelectFarm(farm)} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-16">ID</th>
                  <th className="py-4 px-6">Farm / Crop</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Soil Moisture</th>
                  <th className="py-4 px-6">Temp</th>
                  <th className="py-4 px-6 text-right">Trend</th>
                  <th className="py-4 px-6 text-right w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-700">
                {filteredFarms.map((farm) => (
                  <FarmRow key={farm.id} farm={farm} onClick={() => onSelectFarm(farm)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}