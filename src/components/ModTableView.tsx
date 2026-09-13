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
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-nordic-900/80 shadow-2xl">
      <table className="w-full text-left text-xs border-collapse">
        {/* Table Header mimicking ModOrganizer2 */}
        <thead>
          <tr className="border-b border-slate-800 bg-nordic-950/90 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
            <th className="py-3 px-3 w-28 text-center">Priority</th>
            <th className="py-3 px-2 w-14 text-center">Status</th>
            <th className="py-3 px-4 font-sans font-semibold">Mod Name</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Type</th>
            <th className="py-3 px-3">Version</th>
            <th className="py-3 px-3">Author</th>
            <th className="py-3 px-3">Size</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850">
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
                    : 'bg-nordic-950/40 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Priority with Reorder Controls */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center justify-center space-x-1.5">
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          sound.playSwoosh();
                          onMoveUp(mod.id);
                        }}
                        disabled={isFirst}
                        className={`text-slate-500 hover:text-amber-400 ${
                          isFirst ? 'opacity-10 cursor-not-allowed' : ''
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          sound.playSwoosh();
                          onMoveDown(mod.id);
                        }}
                        disabled={isLast}
                        className={`text-slate-500 hover:text-amber-400 ${
                          isLast ? 'opacity-10 cursor-not-allowed' : ''
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
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
                        className="w-14 px-1 py-0.5 text-[11px] font-mono font-bold bg-nordic-950 border border-amber-400 text-amber-300 rounded text-center focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setEditingPriorityId(mod.id);
                          setPriorityInput(mod.priority.toString());
                        }}
                        className="px-1.5 py-0.5 rounded bg-nordic-950/80 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/40 font-mono text-[11px] font-bold text-amber-300 transition-colors"
                        title="Click to type exact priority index"
                      >
                        {formatPriority(mod.priority)}
                      </button>
                    )}
                  </div>
                </td>

                {/* Status Toggle (+) vs (-) */}
                <td className="py-2.5 px-2 text-center">
                  <button
                    onClick={() => {
                      sound.playToggle();
                      onToggleStatus(mod.id);
                    }}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded font-mono text-xs font-black transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                        : 'bg-rose-950/50 text-rose-400 border border-rose-800/50 hover:bg-rose-900/60'
                    }`}
                    title={isActive ? 'Active (+) - Click to Disable' : 'Disabled (-) - Click to Enable'}
                  >
                    {isActive ? '+' : '–'}
                  </button>
                </td>

                {/* Mod Name */}
                <td className="py-2.5 px-4 font-medium">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`truncate max-w-xs sm:max-w-md ${
                        isActive ? 'text-slate-200' : 'text-slate-400 line-through'
                      }`}
                      title={mod.name}
                    >
                      {mod.name}
                    </span>
                    {mod.hasUpdate && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Update Available" />
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="py-2.5 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryBadgeStyle(mod.category)}`}>
                    {mod.category}
                  </span>
                </td>

                {/* Type */}
                <td className="py-2.5 px-3">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border ${getPluginTypeBadgeStyle(mod.pluginType)}`}>
                    {mod.pluginType}
                  </span>
                </td>

                {/* Version */}
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-300">v{mod.currentVersion}</span>
                    {mod.hasUpdate ? (
                      <button
                        onClick={() => {
                          sound.playChime();
                          onMarkUpdated(mod.id);
                        }}
                        className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[10px] transition-colors"
                        title={`Update to v${mod.latestVersion}`}
                      >
                        <DownloadCloud className="w-2.5 h-2.5" />
                        <span>v{mod.latestVersion}</span>
                      </button>
                    ) : (
                      <span title="Up to date">
                        <Check className="w-3 h-3 text-emerald-400/80" />
                      </span>
                    )}
                  </div>
                </td>

                {/* Author */}
                <td className="py-2.5 px-3 text-slate-400 truncate max-w-[120px]">
                  {mod.author}
                </td>

                {/* Size */}
                <td className="py-2.5 px-3 font-mono text-slate-400">
                  {mod.fileSize}
                </td>

                {/* Actions */}
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <a
                      href={mod.nexusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-amber-300 rounded hover:bg-nordic-800 transition-colors"
                      title="Open Nexus Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onEdit(mod);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-nordic-800 transition-colors"
                      title="Edit Mod"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        if (window.confirm(`Delete "${mod.name}" from your load order?`)) {
                          onDelete(mod.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-950/30 transition-colors"
                      title="Delete Mod"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
