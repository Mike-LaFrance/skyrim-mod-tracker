import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ModItemCard } from './components/ModItemCard';
import { ModTableView } from './components/ModTableView';
import { AddModModal } from './components/AddModModal';
import { EditModModal } from './components/EditModModal';
import { ImportExportModal } from './components/ImportExportModal';
import { UpdatesScannerModal } from './components/UpdatesScannerModal';
import { HelpCenterModal } from './components/HelpCenterModal';
import { NexusApiKeyModal } from './components/NexusApiKeyModal';
import { FilterState, SkyrimMod } from './types';
import {
  loadMods,
  saveMods,
  resetModsToDefault,
  cleanRenumber,
} from './utils/storage';
import { getStoredNexusApiKey } from './utils/nexusApi';
import { sound } from './utils/audio';
import { ShieldCheck, Compass } from 'lucide-react';

export function App() {
  const [mods, setMods] = useState<SkyrimMod[]>(() => loadMods());
  const [filters, setFilters] = useState<FilterState>(() => ({
    searchQuery: '',
    category: 'all',
    pluginType: 'all',
    status: 'all',
    sortBy: 'priority',
    sortOrder: 'asc',
    viewMode: 'cards',
  }));

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<SkyrimMod | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState(false);
  const [hasNexusApiKey, setHasNexusApiKey] = useState(() => Boolean(getStoredNexusApiKey()));

  // Sync to localStorage on every state change
  useEffect(() => {
    saveMods(mods);
  }, [mods]);

  // Priority & Load Order Handlers
  const handleMoveUp = (id: string) => {
    setMods((prev) => {
      const sorted = [...prev].sort((a, b) => a.priority - b.priority);
      const index = sorted.findIndex((m) => m.id === id);
      if (index <= 0) return prev;

      // Swap priorities with previous mod
      const prevMod = sorted[index - 1];
      const currentMod = sorted[index];

      const tempPriority = prevMod.priority;
      prevMod.priority = currentMod.priority;
      currentMod.priority = tempPriority;

      return [...sorted];
    });
  };

  const handleMoveDown = (id: string) => {
    setMods((prev) => {
      const sorted = [...prev].sort((a, b) => a.priority - b.priority);
      const index = sorted.findIndex((m) => m.id === id);
      if (index < 0 || index >= sorted.length - 1) return prev;

      // Swap priorities with next mod
      const nextMod = sorted[index + 1];
      const currentMod = sorted[index];

      const tempPriority = nextMod.priority;
      nextMod.priority = currentMod.priority;
      currentMod.priority = tempPriority;

      return [...sorted];
    });
  };

  const handleSetPriority = (id: string, newPriority: number) => {
    setMods((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, priority: newPriority } : m
      );
      return updated.sort((a, b) => a.priority - b.priority);
    });
  };

  const handleCleanRenumber = () => {
    setMods((prev) => cleanRenumber(prev));
  };

  // Status Toggles
  const handleToggleStatus = (id: string) => {
    setMods((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'active' ? 'disabled' : 'active' }
          : m
      )
    );
  };

  const handleEnableAll = () => {
    setMods((prev) => prev.map((m) => ({ ...m, status: 'active' })));
  };

  const handleDisableAll = () => {
    setMods((prev) => prev.map((m) => ({ ...m, status: 'disabled' })));
  };

  // Update Actions
  const handleMarkUpdated = (id: string) => {
    setMods((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, currentVersion: m.latestVersion, hasUpdate: false }
          : m
      )
    );
  };

  const handleUpdateAll = () => {
    setMods((prev) =>
      prev.map((m) =>
        m.hasUpdate
          ? { ...m, currentVersion: m.latestVersion, hasUpdate: false }
          : m
      )
    );
  };

  // Notes update
  const handleUpdateNotes = (id: string, notes: string) => {
    setMods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notes } : m))
    );
  };

  // Add / Edit / Delete Mod Handlers
  const handleAddMod = (newMod: SkyrimMod) => {
    setMods((prev) => {
      const updated = [...prev, newMod];
      return updated.sort((a, b) => a.priority - b.priority);
    });
  };

  const handleOpenEdit = (mod: SkyrimMod) => {
    setEditingMod(mod);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedMod: SkyrimMod) => {
    setMods((prev) =>
      prev.map((m) => (m.id === updatedMod.id ? updatedMod : m))
    );
  };

  const handleDeleteMod = (id: string) => {
    setMods((prev) => cleanRenumber(prev.filter((m) => m.id !== id)));
  };

  const handleResetDefaults = () => {
    const defaults = resetModsToDefault();
    setMods(defaults);
    sound.playChime();
  };

  const handleImportMods = (importedMods: SkyrimMod[]) => {
    setMods(importedMods);
  };

  // Filter & Sort Logic
  const filteredAndSortedMods = useMemo(() => {
    let result = [...mods];

    // Search Query Filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.author.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.notes.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.pluginType.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (filters.category !== 'all') {
      result = result.filter((m) => m.category === filters.category);
    }

    // Plugin Type Filter
    if (filters.pluginType !== 'all') {
      result = result.filter((m) => m.pluginType === filters.pluginType);
    }

    // Status Filter Chip
    if (filters.status === 'active') {
      result = result.filter((m) => m.status === 'active');
    } else if (filters.status === 'disabled') {
      result = result.filter((m) => m.status === 'disabled');
    } else if (filters.status === 'updates') {
      result = result.filter((m) => m.hasUpdate);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'priority':
          comparison = a.priority - b.priority;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'update':
          comparison = (b.hasUpdate ? 1 : 0) - (a.hasUpdate ? 1 : 0);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [mods, filters]);

  // Quick Metrics
  const activeCount = useMemo(() => mods.filter((m) => m.status === 'active').length, [mods]);
  const disabledCount = useMemo(() => mods.filter((m) => m.status === 'disabled').length, [mods]);
  const updatesCount = useMemo(() => mods.filter((m) => m.hasUpdate).length, [mods]);
  const nextPriority = useMemo(() => {
    if (mods.length === 0) return 0;
    return Math.max(...mods.map((m) => m.priority)) + 1;
  }, [mods]);

  return (
    <div className="min-h-screen flex flex-col bg-nordic-950 text-slate-200">
      {/* Top Application Header */}
      <Header
        totalMods={mods.length}
        activeMods={activeCount}
        disabledMods={disabledCount}
        updatesAvailable={updatesCount}
        hasNexusApiKey={hasNexusApiKey}
        onCheckUpdates={() => setIsScannerOpen(true)}
        onCleanRenumber={handleCleanRenumber}
        onEnableAll={handleEnableAll}
        onDisableAll={handleDisableAll}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onOpenAddMod={() => setIsAddModalOpen(true)}
        onResetDefaults={handleResetDefaults}
        onOpenHelpCenter={() => setIsHelpCenterOpen(true)}
        onOpenNexusApiKey={() => setIsNexusModalOpen(true)}
      />

      {/* Interactive Filter & View Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        totalFiltered={filteredAndSortedMods.length}
        totalMods={mods.length}
        activeCount={activeCount}
        disabledCount={disabledCount}
        updatesCount={updatesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-6">
        {filteredAndSortedMods.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-nordic-900/40 rounded-2xl border border-slate-800/80">
            <Compass className="w-12 h-12 text-slate-500 mx-auto animate-pulse-subtle" />
            <h3 className="text-xl font-cinzel font-semibold text-slate-300">No Skyrim Mods Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No active or disabled mods matched your current filter criteria. Try resetting search queries or category filters.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setFilters({
                  searchQuery: '',
                  category: 'all',
                  pluginType: 'all',
                  status: 'all',
                  sortBy: 'priority',
                  sortOrder: 'asc',
                  viewMode: filters.viewMode,
                });
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : filters.viewMode === 'cards' ? (
          <div className="space-y-3.5">
            {filteredAndSortedMods.map((mod, index) => (
              <ModItemCard
                key={mod.id}
                mod={mod}
                isFirst={index === 0}
                isLast={index === filteredAndSortedMods.length - 1}
                onToggleStatus={handleToggleStatus}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSetPriority={handleSetPriority}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteMod}
                onMarkUpdated={handleMarkUpdated}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>
        ) : (
          <ModTableView
            mods={filteredAndSortedMods}
            onToggleStatus={handleToggleStatus}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onSetPriority={handleSetPriority}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMod}
            onMarkUpdated={handleMarkUpdated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-nordic-950 py-5 text-center text-xs sm:text-sm text-slate-400">
        <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Skyrim Special Edition &middot; ModOrganizer2 Load Order Standard</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Compatible with SSE Engine Fixes, LOOT sorting conventions, and SKSE64.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddModModal
        isOpen={isAddModalOpen}
        nextPriority={nextPriority}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMod}
      />

      <EditModModal
        mod={editingMod}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMod(null);
        }}
        onSave={handleSaveEdit}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        mods={mods}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImportMods}
      />

      <UpdatesScannerModal
        isOpen={isScannerOpen}
        mods={mods}
        onClose={() => setIsScannerOpen(false)}
        onUpdateAll={handleUpdateAll}
        onUpdateSingle={handleMarkUpdated}
        onOpenNexusApiKeyModal={() => setIsNexusModalOpen(true)}
      />

      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
        onOpenNexusModal={() => {
          setIsHelpCenterOpen(false);
          setIsNexusModalOpen(true);
        }}
      />

      <NexusApiKeyModal
        isOpen={isNexusModalOpen}
        onClose={() => setIsNexusModalOpen(false)}
        onApiKeyUpdated={(hasKey) => setHasNexusApiKey(hasKey)}
      />
    </div>
  );
}

export default App;
