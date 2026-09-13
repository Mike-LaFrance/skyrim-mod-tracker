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
    <div className="bg-nordic-900/80 border-b border-slate-800 p-4 sticky top-[110px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Row 1: Search Bar & Primary Dropdowns */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by title, author, description, notes, or tags..."
              className="w-full pl-10 pr-9 py-2 bg-nordic-950/90 border border-slate-700/80 focus:border-amber-500/70 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all font-sans"
            />
            {filters.searchQuery && (
              <button
                onClick={() => {
                  sound.playClick();
                  onFilterChange({ searchQuery: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[200px]">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
            <select
              value={filters.category}
              onChange={(e) => {
                sound.playClick();
                onFilterChange({ category: e.target.value });
              }}
              className="w-full pl-9 pr-8 py-2 bg-nordic-950/90 border border-slate-700/80 focus:border-amber-500/70 rounded-lg text-xs font-medium text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Categories ({totalMods})</option>
              {MOD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
          </div>

          {/* Plugin Type Dropdown */}
          <div className="relative min-w-[170px]">
            <Boxes className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            <select
              value={filters.pluginType}
              onChange={(e) => {
                sound.playClick();
                onFilterChange({ pluginType: e.target.value });
              }}
              className="w-full pl-9 pr-8 py-2 bg-nordic-950/90 border border-slate-700/80 focus:border-amber-500/70 rounded-lg text-xs font-medium text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Plugin Types</option>
              {PLUGIN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
          </div>
        </div>

        {/* Row 2: Status Filter Chips & Sort / View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleStatusClick('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filters.status === 'all'
                  ? 'bg-amber-500 text-nordic-950 shadow-gold-glow'
                  : 'bg-nordic-800 text-slate-400 hover:text-slate-200 hover:bg-nordic-750 border border-slate-700/50'
              }`}
            >
              All Mods ({totalMods})
            </button>

            <button
              onClick={() => handleStatusClick('active')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filters.status === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-nordic-800 text-slate-400 hover:text-emerald-300 hover:bg-nordic-750 border border-slate-700/50'
              }`}
            >
              <span>Active (+)</span>
              <span className="font-mono text-[11px] opacity-80">({activeCount})</span>
            </button>

            <button
              onClick={() => handleStatusClick('disabled')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filters.status === 'disabled'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-nordic-800 text-slate-400 hover:text-rose-300 hover:bg-nordic-750 border border-slate-700/50'
              }`}
            >
              <span>Disabled (-)</span>
              <span className="font-mono text-[11px] opacity-80">({disabledCount})</span>
            </button>

            <button
              onClick={() => handleStatusClick('updates')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filters.status === 'updates'
                  ? 'bg-amber-600 text-amber-50 shadow-gold-glow'
                  : 'bg-nordic-800 text-slate-400 hover:text-amber-300 hover:bg-nordic-750 border border-slate-700/50'
              }`}
            >
              <span>Updates Available</span>
              <span className={`font-mono text-[11px] px-1.5 py-0.2 rounded-full ${
                updatesCount > 0 ? 'bg-amber-400 text-nordic-950 font-bold' : 'opacity-80'
              }`}>
                {updatesCount}
              </span>
            </button>
          </div>

          {/* Sort & View Mode Tools */}
          <div className="flex items-center gap-3">
            {/* Sorting Controls */}
            <div className="flex items-center space-x-1.5 bg-nordic-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1">
              <span className="text-[11px] text-slate-400">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={handleSortFieldChange}
                className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer pr-1"
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
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-nordic-950/90 border border-slate-700/80 rounded-lg p-0.5">
              <button
                onClick={() => handleViewModeToggle('cards')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filters.viewMode === 'cards'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Detailed Accordion Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => handleViewModeToggle('table')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filters.viewMode === 'table'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Compact Desktop MO2 Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MO2 Table</span>
              </button>
            </div>

            {/* Match Counter */}
            <div className="text-[11px] text-slate-400 hidden xl:block font-mono">
              Showing <span className="text-amber-300 font-bold">{totalFiltered}</span> of {totalMods}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
