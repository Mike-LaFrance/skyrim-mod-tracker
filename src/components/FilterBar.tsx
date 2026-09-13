import React from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  Boxes,
} from 'lucide-react';
import {
  FilterState,
  MOD_CATEGORIES,
  PLUGIN_TYPES,
  SortField,
  StatusFilter,
  ViewMode,
} from '../types';
import { sound } from '../utils/audio';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  totalFiltered: number;
  totalMods: number;
  activeCount: number;
  disabledCount: number;
  updatesCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalFiltered,
  totalMods,
  activeCount,
  disabledCount,
  updatesCount,
}) => {
  const handleStatusClick = (status: StatusFilter) => {
    sound.playClick();
    onFilterChange({ status });
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sound.playClick();
    onFilterChange({ sortBy: e.target.value as SortField });
  };

  const handleToggleSortOrder = () => {
    sound.playClick();
    onFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  const handleViewModeToggle = (mode: ViewMode) => {
    sound.playClick();
    onFilterChange({ viewMode: mode });
  };

  return (
    <div className="bg-nordic-900/90 border-b border-slate-800 p-4 sticky top-[120px] sm:top-[128px] lg:top-[132px] z-30 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-4">
        {/* Row 1: Search Bar & Primary Dropdowns */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by title, author, description, technical notes, or tags..."
              className="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-nordic-950/90 border border-slate-700/80 focus:border-amber-500/80 rounded-xl text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all font-sans"
            />
            {filters.searchQuery && (
              <button
                onClick={() => {
                  sound.playClick();
                  onFilterChange({ searchQuery: '' });
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Dropdown */}
            <div className="relative min-w-[210px]">
              <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
              <select
                value={filters.category}
                onChange={(e) => {
                  sound.playClick();
                  onFilterChange({ category: e.target.value });
                }}
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-nordic-950/90 border border-slate-700/80 focus:border-amber-500/80 rounded-xl text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Categories ({totalMods})</option>
                {MOD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>

            {/* Plugin Type Dropdown */}
            <div className="relative min-w-[180px]">
              <Boxes className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
              <select
                value={filters.pluginType}
                onChange={(e) => {
                  sound.playClick();
                  onFilterChange({ pluginType: e.target.value });
                }}
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-nordic-950/90 border border-slate-700/80 focus:border-amber-500/80 rounded-xl text-xs sm:text-sm font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Plugin Types</option>
                {PLUGIN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Row 2: Status Filter Chips & Sort / View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleStatusClick('all')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filters.status === 'all'
                  ? 'bg-amber-500 text-nordic-950 shadow-gold-glow'
                  : 'bg-nordic-800 text-slate-300 hover:text-white hover:bg-nordic-750 border border-slate-700/60'
              }`}
            >
              All Mods ({totalMods})
            </button>

            <button
              onClick={() => handleStatusClick('active')}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filters.status === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-nordic-800 text-slate-300 hover:text-emerald-300 hover:bg-nordic-750 border border-slate-700/60'
              }`}
            >
              <span>Active (+)</span>
              <span className="font-mono text-xs opacity-90">({activeCount})</span>
            </button>

            <button
              onClick={() => handleStatusClick('disabled')}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filters.status === 'disabled'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-nordic-800 text-slate-300 hover:text-rose-300 hover:bg-nordic-750 border border-slate-700/60'
              }`}
            >
              <span>Disabled (-)</span>
              <span className="font-mono text-xs opacity-90">({disabledCount})</span>
            </button>

            <button
              onClick={() => handleStatusClick('updates')}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filters.status === 'updates'
                  ? 'bg-amber-600 text-amber-50 shadow-gold-glow'
                  : 'bg-nordic-800 text-slate-300 hover:text-amber-300 hover:bg-nordic-750 border border-slate-700/60'
              }`}
            >
              <span>Updates Available</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                updatesCount > 0 ? 'bg-amber-400 text-nordic-950 font-bold' : 'opacity-80'
              }`}>
                {updatesCount}
              </span>
            </button>
          </div>

          {/* Sort & View Mode Tools */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sorting Controls */}
            <div className="flex items-center space-x-2 bg-nordic-950/90 border border-slate-700/80 rounded-xl px-3 py-1.5">
              <span className="text-xs sm:text-sm text-slate-400 font-medium">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={handleSortFieldChange}
                className="bg-transparent text-xs sm:text-sm text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="priority" className="bg-nordic-900">Priority (#)</option>
                <option value="name" className="bg-nordic-900">Mod Name</option>
                <option value="category" className="bg-nordic-900">Category</option>
                <option value="update" className="bg-nordic-900">Update Status</option>
              </select>

              <button
                onClick={handleToggleSortOrder}
                className="p-1 text-slate-400 hover:text-amber-400 rounded transition-colors"
                title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-nordic-950/90 border border-slate-700/80 rounded-xl p-1">
              <button
                onClick={() => handleViewModeToggle('cards')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  filters.viewMode === 'cards'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Detailed Accordion Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => handleViewModeToggle('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  filters.viewMode === 'table'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Compact Desktop MO2 Table View"
              >
                <TableIcon className="w-4 h-4" />
                <span>MO2 Table</span>
              </button>
            </div>

            {/* Match Counter */}
            <div className="text-xs sm:text-sm text-slate-400 hidden xl:block font-mono">
              Showing <span className="text-amber-300 font-bold">{totalFiltered}</span> of {totalMods}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
