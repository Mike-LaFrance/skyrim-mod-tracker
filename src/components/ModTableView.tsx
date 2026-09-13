import React, { useState } from 'react';
import {
  ExternalLink,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  DownloadCloud,
  Check,
} from 'lucide-react';
import { SkyrimMod } from '../types';
import { formatPriority } from '../utils/storage';
import { getCategoryBadgeStyle, getPluginTypeBadgeStyle } from './ModItemCard';
import { sound } from '../utils/audio';

interface ModTableViewProps {
  mods: SkyrimMod[];
  onToggleStatus: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onSetPriority: (id: string, newPriority: number) => void;
  onEdit: (mod: SkyrimMod) => void;
  onDelete: (id: string) => void;
  onMarkUpdated: (id: string) => void;
}

export const ModTableView: React.FC<ModTableViewProps> = ({
  mods,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  onSetPriority,
  onEdit,
  onDelete,
  onMarkUpdated,
}) => {
  const [editingPriorityId, setEditingPriorityId] = useState<string | null>(null);
  const [priorityInput, setPriorityInput] = useState('');

  const handlePrioritySubmit = (id: string) => {
    const val = parseInt(priorityInput, 10);
    if (!isNaN(val) && val >= 0) {
      sound.playSwoosh();
      onSetPriority(id, val);
    }
    setEditingPriorityId(null);
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-nordic-900/90 shadow-2xl">
      <table className="w-full min-w-[960px] text-left border-collapse">
        {/* Table Header mimicking ModOrganizer2 */}
        <thead>
          <tr className="border-b border-slate-800 bg-nordic-950 text-slate-300 font-mono uppercase tracking-wider text-xs sm:text-sm font-semibold">
            <th className="py-4 px-4 w-32 text-center">Priority</th>
            <th className="py-4 px-3 w-16 text-center">Status</th>
            <th className="py-4 px-5 font-sans font-bold text-slate-200">Mod Name</th>
            <th className="py-4 px-4">Category</th>
            <th className="py-4 px-4">Type</th>
            <th className="py-4 px-4">Version</th>
            <th className="py-4 px-4">Author</th>
            <th className="py-4 px-4">Size</th>
            <th className="py-4 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850 text-sm sm:text-base">
          {mods.map((mod, index) => {
            const isActive = mod.status === 'active';
            const isFirst = index === 0;
            const isLast = index === mods.length - 1;

            return (
              <tr
                key={mod.id}
                className={`group transition-colors ${
                  isActive
                    ? 'hover:bg-nordic-800/60'
                    : 'bg-nordic-950/50 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Priority with Reorder Controls */}
                <td className="py-3 sm:py-3.5 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex flex-col space-y-0.5">
                      <button
                        onClick={() => {
                          sound.playSwoosh();
                          onMoveUp(mod.id);
                        }}
                        disabled={isFirst}
                        className={`p-0.5 rounded text-slate-500 hover:text-amber-400 ${
                          isFirst ? 'opacity-10 cursor-not-allowed' : ''
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          sound.playSwoosh();
                          onMoveDown(mod.id);
                        }}
                        disabled={isLast}
                        className={`p-0.5 rounded text-slate-500 hover:text-amber-400 ${
                          isLast ? 'opacity-10 cursor-not-allowed' : ''
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {editingPriorityId === mod.id ? (
                      <input
                        type="number"
                        min="0"
                        value={priorityInput}
                        onChange={(e) => setPriorityInput(e.target.value)}
                        onBlur={() => handlePrioritySubmit(mod.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePrioritySubmit(mod.id);
                          if (e.key === 'Escape') setEditingPriorityId(null);
                        }}
                        autoFocus
                        className="w-16 px-1.5 py-0.5 text-xs sm:text-sm font-mono font-bold bg-nordic-950 border border-amber-400 text-amber-300 rounded text-center focus:outline-none shadow-gold-glow"
                      />
                    ) : (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setEditingPriorityId(mod.id);
                          setPriorityInput(mod.priority.toString());
                        }}
                        className="px-2 sm:px-2.5 py-1 rounded-lg bg-nordic-950/90 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/50 font-mono text-xs sm:text-sm font-bold text-amber-300 transition-colors"
                        title="Click to type exact priority index"
                      >
                        {formatPriority(mod.priority)}
                      </button>
                    )}
                  </div>
                </td>

                {/* Status Toggle (+) vs (-) */}
                <td className="py-3 sm:py-3.5 px-3 text-center">
                  <button
                    onClick={() => {
                      sound.playToggle();
                      onToggleStatus(mod.id);
                    }}
                    className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-sm sm:text-base font-black transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-500/35'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/60 hover:bg-rose-900/70'
                    }`}
                    title={isActive ? 'Active (+) - Click to Disable' : 'Disabled (-) - Click to Enable'}
                  >
                    {isActive ? '+' : '–'}
                  </button>
                </td>

                {/* Mod Name */}
                <td className="py-3 sm:py-3.5 px-5 font-semibold">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`truncate max-w-sm sm:max-w-md lg:max-w-xl ${
                        isActive ? 'text-slate-100' : 'text-slate-400 line-through'
                      }`}
                      title={mod.name}
                    >
                      {mod.name}
                    </span>
                    {mod.hasUpdate && (
                      <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-gold-glow" title="Update Available" />
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 sm:py-3.5 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeStyle(mod.category)}`}>
                    {mod.category}
                  </span>
                </td>

                {/* Type */}
                <td className="py-3 sm:py-3.5 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${getPluginTypeBadgeStyle(mod.pluginType)}`}>
                    {mod.pluginType}
                  </span>
                </td>

                {/* Version */}
                <td className="py-3 sm:py-3.5 px-4 font-mono text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300">v{mod.currentVersion}</span>
                    {mod.hasUpdate ? (
                      <button
                        onClick={() => {
                          sound.playChime();
                          onMarkUpdated(mod.id);
                        }}
                        className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-semibold transition-colors"
                        title={`Update to v${mod.latestVersion}`}
                      >
                        <DownloadCloud className="w-3 h-3" />
                        <span>v{mod.latestVersion}</span>
                      </button>
                    ) : (
                      <span title="Up to date">
                        <Check className="w-4 h-4 text-emerald-400/80" />
                      </span>
                    )}
                  </div>
                </td>

                {/* Author */}
                <td className="py-3 sm:py-3.5 px-4 text-slate-300 truncate max-w-[140px] text-xs sm:text-sm">
                  {mod.author}
                </td>

                {/* Size */}
                <td className="py-3 sm:py-3.5 px-4 font-mono text-slate-400 text-xs sm:text-sm">
                  {mod.fileSize}
                </td>

                {/* Actions */}
                <td className="py-3 sm:py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <a
                      href={mod.nexusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-nordic-800 transition-colors"
                      title="Open Nexus Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onEdit(mod);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-nordic-800 transition-colors"
                      title="Edit Mod"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        if (window.confirm(`Delete "${mod.name}" from your load order?`)) {
                          onDelete(mod.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                      title="Delete Mod"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
