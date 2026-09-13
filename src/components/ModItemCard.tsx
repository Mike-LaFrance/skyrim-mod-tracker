import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  AlertCircle,
  DownloadCloud,
  FileText,
  User,
  HardDrive,
  StickyNote,
} from 'lucide-react';
import { ModCategory, SkyrimMod } from '../types';
import { formatPriority } from '../utils/storage';
import { sound } from '../utils/audio';

interface ModItemCardProps {
  mod: SkyrimMod;
  isFirst: boolean;
  isLast: boolean;
  onToggleStatus: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onSetPriority: (id: string, newPriority: number) => void;
  onEdit: (mod: SkyrimMod) => void;
  onDelete: (id: string) => void;
  onMarkUpdated: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const getCategoryBadgeStyle = (category: ModCategory): string => {
  switch (category) {
    case 'Official Content':
      return 'bg-amber-950/50 text-amber-300 border-amber-600/40';
    case 'Creation Club':
      return 'bg-orange-950/50 text-orange-300 border-orange-600/40';
    case 'Framework & Engine':
      return 'bg-purple-950/50 text-purple-300 border-purple-600/40';
    case 'User Interface':
      return 'bg-sky-950/50 text-sky-300 border-sky-600/40';
    case 'Combat & Animations':
      return 'bg-red-950/50 text-red-300 border-red-600/40';
    case 'Quests & New Lands':
      return 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40';
    case 'Gameplay Overhaul':
      return 'bg-rose-950/50 text-rose-300 border-rose-600/40';
    case 'Visuals & Shaders':
      return 'bg-indigo-950/50 text-indigo-300 border-indigo-600/40';
    case 'Armor & Weapons':
      return 'bg-yellow-950/50 text-yellow-300 border-yellow-600/40';
    case 'Audio & Music':
      return 'bg-teal-950/50 text-teal-300 border-teal-600/40';
    case 'Followers & NPCs':
      return 'bg-pink-950/50 text-pink-300 border-pink-600/40';
    case 'Utilities & Fixes':
      return 'bg-slate-800 text-slate-300 border-slate-600/40';
    default:
      return 'bg-gray-800 text-gray-300 border-gray-600/40';
  }
};

export const getPluginTypeBadgeStyle = (pluginType: string): string => {
  switch (pluginType) {
    case 'DLC':
      return 'bg-amber-900/60 text-amber-200 border-amber-500/40';
    case 'ESM Master':
      return 'bg-blue-900/60 text-blue-200 border-blue-500/40';
    case 'ESL Light':
      return 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40';
    case 'SKSE Plugin':
      return 'bg-purple-900/60 text-purple-200 border-purple-500/40';
    case 'Creation Club':
      return 'bg-orange-900/60 text-orange-200 border-orange-500/40';
    case 'Asset Archive':
      return 'bg-teal-900/60 text-teal-200 border-teal-500/40';
    default:
      return 'bg-slate-800/80 text-slate-300 border-slate-600/40';
  }
};

export const ModItemCard: React.FC<ModItemCardProps> = ({
  mod,
  isFirst,
  isLast,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  onSetPriority,
  onEdit,
  onDelete,
  onMarkUpdated,
  onUpdateNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [priorityInput, setPriorityInput] = useState(mod.priority.toString());
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(mod.notes);

  const isActive = mod.status === 'active';

  const handlePrioritySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(priorityInput, 10);
    if (!isNaN(val) && val >= 0) {
      sound.playSwoosh();
      onSetPriority(mod.id, val);
    } else {
      setPriorityInput(mod.priority.toString());
    }
    setIsEditingPriority(false);
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    navigator.clipboard.writeText(mod.nexusUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveNotes = () => {
    sound.playClick();
    onUpdateNotes(mod.id, notesDraft);
    setIsEditingNotes(false);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isActive
          ? 'bg-nordic-900/90 border-slate-800 hover:border-amber-500/40 hover:shadow-nordic-glow'
          : 'bg-nordic-950/60 border-slate-900/80 opacity-70 hover:opacity-90'
      }`}
    >
      {/* Main Card Header / Collapsed View */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Section: Priority, Status Toggle & Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Reorder Buttons (Up/Down) */}
          <div className="flex flex-col space-y-0.5">
            <button
              onClick={() => {
                sound.playSwoosh();
                onMoveUp(mod.id);
              }}
              disabled={isFirst}
              className={`p-0.5 rounded text-slate-400 hover:text-amber-400 hover:bg-nordic-800 transition-colors ${
                isFirst ? 'opacity-20 cursor-not-allowed' : ''
              }`}
              title="Move Mod Up in Load Order"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playSwoosh();
                onMoveDown(mod.id);
              }}
              disabled={isLast}
              className={`p-0.5 rounded text-slate-400 hover:text-amber-400 hover:bg-nordic-800 transition-colors ${
                isLast ? 'opacity-20 cursor-not-allowed' : ''
              }`}
              title="Move Mod Down in Load Order"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-digit Priority Badge with Direct Click-to-Edit */}
          <div className="relative">
            {isEditingPriority ? (
              <form onSubmit={handlePrioritySubmit}>
                <input
                  type="number"
                  min="0"
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  onBlur={() => handlePrioritySubmit()}
                  autoFocus
                  className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold bg-nordic-950 border-2 border-amber-400 text-amber-300 rounded text-center focus:outline-none"
                />
              </form>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsEditingPriority(true);
                  setPriorityInput(mod.priority.toString());
                }}
                className="px-2 py-1 rounded bg-nordic-950/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 font-mono text-xs font-bold text-amber-300 transition-all cursor-pointer"
                title="Click to type exact priority index directly"
              >
                {formatPriority(mod.priority)}
              </button>
            )}
          </div>

          {/* MO2 Style Status Toggle: Active (+) vs Disabled (-) */}
          <button
            onClick={() => {
              sound.playToggle();
              onToggleStatus(mod.id);
            }}
            className={`flex items-center justify-center w-7 h-7 rounded-lg font-mono text-sm font-black transition-all ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                : 'bg-rose-950/50 text-rose-400 border border-rose-800/50 hover:bg-rose-900/60'
            }`}
            title={isActive ? 'Active Plugin (+) - Click to Disable' : 'Disabled Plugin (-) - Click to Enable'}
          >
            {isActive ? '+' : '–'}
          </button>

          {/* Mod Title & Quick Tags */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                onClick={() => {
                  sound.playClick();
                  setIsExpanded(!isExpanded);
                }}
                className={`font-semibold text-sm sm:text-base cursor-pointer hover:text-amber-300 transition-colors truncate ${
                  isActive ? 'text-slate-100' : 'text-slate-400 line-through'
                }`}
                title={mod.name}
              >
                {mod.name}
              </h2>

              {/* Version & Update Flag */}
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-nordic-950/80 border border-slate-700/60 text-slate-300">
                v{mod.currentVersion}
              </span>

              {mod.hasUpdate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playChime();
                    onMarkUpdated(mod.id);
                  }}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 text-amber-300 animate-pulse-subtle transition-all"
                  title={`Update available: v${mod.latestVersion}. Click to mark updated.`}
                >
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Update: v{mod.latestVersion}</span>
                </button>
              )}
            </div>

            {/* Sub-line metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryBadgeStyle(mod.category)}`}>
                {mod.category}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getPluginTypeBadgeStyle(mod.pluginType)}`}>
                {mod.pluginType}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                {mod.author}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Expand & Action Controls */}
        <div className="flex items-center space-x-1.5 self-end md:self-center">
          <button
            onClick={() => {
              sound.playClick();
              onEdit(mod);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-nordic-800 transition-colors"
            title="Edit Mod Metadata"
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Delete Mod"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-nordic-800 hover:bg-nordic-750 text-xs text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <span>{isExpanded ? 'Less' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mod Details & Nexus Integration Dropdown */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-nordic-950/40 rounded-b-xl space-y-4 animate-fade-in text-xs">
          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              In-Game Overview & Description
            </h3>
            <p className="text-slate-300 leading-relaxed bg-nordic-900/60 p-3 rounded-lg border border-slate-800">
              {mod.description}
            </p>
          </div>

          {/* Nexus Integration & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Version Tracking */}
            <div className="bg-nordic-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Version Status
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-300">Installed: v{mod.currentVersion}</span>
                <span className="font-mono text-amber-300">Nexus: v{mod.latestVersion}</span>
              </div>
              {mod.hasUpdate ? (
                <button
                  onClick={() => {
                    sound.playChime();
                    onMarkUpdated(mod.id);
                  }}
                  className="w-full mt-1.5 py-1 px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 flex items-center justify-center space-x-1 transition-colors"
                >
                  <DownloadCloud className="w-3 h-3" />
                  <span>Mark as Updated (v{mod.latestVersion})</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1 text-emerald-400 text-[11px] pt-1">
                  <Check className="w-3 h-3" />
                  <span>Up to date</span>
                </div>
              )}
            </div>

            {/* Author & File Size */}
            <div className="bg-nordic-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Package Details
              </span>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Author: <strong className="text-slate-200">{mod.author}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archive Size: <span className="font-mono text-slate-200">{mod.fileSize}</span></span>
              </div>
            </div>

            {/* Official Nexus Link & Copy */}
            <div className="bg-nordic-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Official Nexus / Bethesda Link
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href={mod.nexusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors"
                >
                  <span>Open Nexus Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded bg-nordic-800 hover:bg-nordic-750 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy Nexus URL to Clipboard"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Editable User Compatibility & LOOT Notes */}
          <div className="bg-nordic-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                <span>Compatibility Flags & LOOT Sorting Rules</span>
              </div>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEditingNotes(true);
                    setNotesDraft(mod.notes);
                  }}
                  className="text-amber-400 hover:text-amber-300 text-[11px] underline"
                >
                  Edit Notes
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="text-slate-400 hover:text-slate-200 text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-2 py-0.5 rounded bg-amber-500 text-nordic-950 font-bold text-[11px] hover:bg-amber-400"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={2}
                className="w-full p-2 bg-nordic-950 border border-amber-500/60 rounded text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs font-sans"
                placeholder="Add LOOT rules, MCM settings, or load order instructions..."
              />
            ) : (
              <p className="text-slate-300 italic text-xs">
                {mod.notes || 'No compatibility notes entered. Click "Edit Notes" to add custom flags.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
