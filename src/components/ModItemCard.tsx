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
  GripVertical,
  AlertTriangle,
} from 'lucide-react';
import { ConflictIssue, ModCategory, PREDEFINED_TAGS, SkyrimMod } from '../types';
import { formatPriority } from '../utils/storage';
import { sound } from '../utils/audio';

interface ModItemCardProps {
  mod: SkyrimMod;
  isFirst: boolean;
  isLast: boolean;
  conflictIssue?: ConflictIssue;
  showBanners?: boolean;
  onToggleStatus: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onSetPriority: (id: string, newPriority: number) => void;
  onEdit: (mod: SkyrimMod) => void;
  onDelete: (id: string) => void;
  onMarkUpdated: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: string) => void;
  isDragTarget?: boolean;
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

export const getTagColorStyle = (tagName: string): string => {
  const found = PREDEFINED_TAGS.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
  return found ? found.color : 'border-slate-700 bg-slate-800/60 text-slate-300';
};

export const ModItemCard: React.FC<ModItemCardProps> = ({
  mod,
  isFirst,
  isLast,
  conflictIssue,
  showBanners = true,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  onSetPriority,
  onEdit,
  onDelete,
  onMarkUpdated,
  onUpdateNotes,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragTarget,
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
      draggable={true}
      onDragStart={(e) => onDragStart?.(e, mod.id)}
      onDragOver={(e) => onDragOver?.(e, mod.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop?.(e, mod.id)}
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${
        isDragTarget
          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
          : isActive
          ? conflictIssue
            ? 'bg-nordic-900/95 border-amber-500/50 hover:border-amber-400'
            : 'bg-nordic-900/90 border-slate-800 hover:border-amber-500/40 hover:shadow-nordic-glow'
          : 'bg-nordic-950/60 border-slate-900/80 opacity-70 hover:opacity-90'
      }`}
    >
      {/* Optional Cinematic Artwork Banner Header */}
      {showBanners && mod.imageUrl && (
        <div className="relative h-16 sm:h-20 w-full overflow-hidden bg-nordic-950 border-b border-slate-800/60">
          <img
            src={mod.imageUrl}
            alt={mod.name}
            className="w-full h-full object-cover object-center opacity-40 hover:opacity-60 transition-opacity duration-300 transform scale-105"
            onError={(e) => {
              // Hide banner if image fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nordic-900 via-nordic-900/60 to-transparent" />
        </div>
      )}

      {/* Main Card Header / Collapsed View */}
      <div className="p-3.5 sm:p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Section: Drag handle, Priority, Status Toggle & Title */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 w-full md:w-auto flex-1 min-w-0">
          {/* Drag Handle */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-amber-400 transition-colors flex-shrink-0"
            title="Drag to reorder mod priority"
          >
            <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Reorder Buttons (Up/Down) */}
          <div className="flex flex-col space-y-0.5 flex-shrink-0">
            <button
              onClick={() => {
                sound.playSwoosh();
                onMoveUp(mod.id);
              }}
              disabled={isFirst}
              className={`p-0.5 rounded text-slate-400 hover:text-amber-400 hover:bg-nordic-800 transition-colors ${
                isFirst ? 'opacity-20 cursor-not-allowed' : ''
              }`}
              title="Move Up in Load Order"
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
              title="Move Down in Load Order"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-digit Priority Badge with Direct Click-to-Edit */}
          <div className="relative flex-shrink-0">
            {isEditingPriority ? (
              <form onSubmit={handlePrioritySubmit}>
                <input
                  type="number"
                  min="0"
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  onBlur={() => handlePrioritySubmit()}
                  autoFocus
                  className="w-18 px-1.5 py-1 text-xs sm:text-sm font-mono font-bold bg-nordic-950 border-2 border-amber-400 text-amber-300 rounded-lg text-center focus:outline-none shadow-gold-glow"
                />
              </form>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsEditingPriority(true);
                  setPriorityInput(mod.priority.toString());
                }}
                className="px-2 sm:px-2.5 py-1 rounded-lg bg-nordic-950/95 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/60 font-mono text-xs sm:text-sm font-bold text-amber-300 transition-all cursor-pointer shadow-sm"
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
            className={`flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-sm sm:text-base font-black transition-all ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-500/35 shadow-sm'
                : 'bg-rose-950/60 text-rose-400 border border-rose-800/60 hover:bg-rose-900/70'
            }`}
            title={isActive ? 'Active Plugin (+) - Click to Disable' : 'Disabled Plugin (-) - Click to Enable'}
          >
            {isActive ? '+' : '–'}
          </button>

          {/* Mod Title, Version, Tags & Conflict Flag */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2
                onClick={() => {
                  sound.playClick();
                  setIsExpanded(!isExpanded);
                }}
                className={`font-bold text-sm sm:text-lg cursor-pointer hover:text-amber-300 transition-colors truncate tracking-wide ${
                  isActive ? 'text-slate-100' : 'text-slate-400 line-through'
                }`}
                title={mod.name}
              >
                {mod.name}
              </h2>

              {/* Version & Update Flag */}
              <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-nordic-950/90 border border-slate-700/70 text-slate-300">
                v{mod.currentVersion}
              </span>

              {mod.hasUpdate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playChime();
                    onMarkUpdated(mod.id);
                  }}
                  className="flex items-center space-x-1 px-2 py-0.2 rounded-full text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 text-amber-300 animate-pulse-subtle transition-all"
                  title={`Update available: v${mod.latestVersion}. Click to mark updated.`}
                >
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Update: v{mod.latestVersion}</span>
                </button>
              )}

              {/* Conflict Diagnostic Warning Badge */}
              {conflictIssue && (
                <div
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 border border-amber-500/60 text-amber-300"
                  title={`${conflictIssue.title}: ${conflictIssue.message}`}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Order Advisory</span>
                </div>
              )}
            </div>

            {/* Sub-line metadata & Custom Tags */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-slate-400">
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-medium border ${getCategoryBadgeStyle(mod.category)}`}>
                {mod.category}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[11px] font-mono border ${getPluginTypeBadgeStyle(mod.pluginType)}`}>
                {mod.pluginType}
              </span>
              <span className="text-slate-300 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                {mod.author}
              </span>

              {/* Custom Tags */}
              {mod.tags && mod.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {mod.tags.map((t) => (
                    <span
                      key={t}
                      className={`px-1.5 py-0.2 rounded text-[11px] font-mono border ${getTagColorStyle(t)}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Expand & Action Controls */}
        <div className="flex items-center space-x-1.5 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onEdit(mod);
            }}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-nordic-800 transition-colors"
            title="Edit Mod Metadata & Tags"
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
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            title="Delete Mod"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-nordic-800 hover:bg-nordic-750 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/70 transition-colors"
          >
            <span>{isExpanded ? 'Less' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mod Details & Nexus Integration Dropdown */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-slate-800/80 bg-nordic-950/60 rounded-b-xl space-y-3.5 text-xs sm:text-sm animate-fade-in">
          {/* Conflict Advisory Alert Box */}
          {conflictIssue && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{conflictIssue.title}</span>
              </div>
              <p className="text-slate-300">{conflictIssue.message}</p>
              <p className="text-amber-200/90 font-medium">
                <strong>Fix:</strong> {conflictIssue.recommendation}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              In-Game Overview & Description
            </h3>
            <p className="text-slate-200 leading-relaxed bg-nordic-900/70 p-3 rounded-xl border border-slate-800">
              {mod.description}
            </p>
          </div>

          {/* Nexus Integration & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Version Tracking */}
            <div className="bg-nordic-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Version Status
              </span>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-mono text-slate-300">Installed: v{mod.currentVersion}</span>
                <span className="font-mono text-amber-300">Nexus: v{mod.latestVersion}</span>
              </div>
              {mod.hasUpdate ? (
                <button
                  onClick={() => {
                    sound.playChime();
                    onMarkUpdated(mod.id);
                  }}
                  className="w-full mt-1.5 py-1 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-semibold flex items-center justify-center space-x-1.5 transition-colors text-xs"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Mark as Updated</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Up to date</span>
                </div>
              )}
            </div>

            {/* Author & File Size */}
            <div className="bg-nordic-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs sm:text-sm">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Package Details
              </span>
              <div className="flex items-center space-x-2 text-slate-200">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Author: <strong className="text-slate-100">{mod.author}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-200">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archive Size: <span className="font-mono text-slate-100">{mod.fileSize}</span></span>
              </div>
            </div>

            {/* Official Nexus Link & Copy */}
            <div className="bg-nordic-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Official Nexus Link
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href={mod.nexusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors"
                >
                  <span>Open Nexus Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-nordic-800 hover:bg-nordic-750 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy Nexus URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Editable User Compatibility & LOOT Notes */}
          <div className="bg-nordic-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                <span>Compatibility Notes & LOOT Rules</span>
              </div>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEditingNotes(true);
                    setNotesDraft(mod.notes);
                  }}
                  className="text-amber-400 hover:text-amber-300 text-xs font-semibold underline"
                >
                  Edit Notes
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-nordic-950 font-bold text-xs hover:bg-amber-400 transition-colors"
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
                className="w-full p-2.5 bg-nordic-950 border border-amber-500/70 rounded-xl text-slate-100 focus:outline-none text-xs font-sans"
                placeholder="Add LOOT rules, MCM settings, or load order instructions..."
              />
            ) : (
              <p className="text-slate-200 italic text-xs leading-relaxed">
                {mod.notes || 'No compatibility notes entered. Click "Edit Notes" to add custom flags.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
