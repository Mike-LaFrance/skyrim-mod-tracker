import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles,
  Cpu,
  Monitor,
  Swords,
  Mountain,
  Wand2,
  Sun,
  ShieldCheck,
  Music,
  Users,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { ConflictIssue, ModCategory, SkyrimMod } from '../types';
import { ModItemCard, getCategoryBadgeStyle } from './ModItemCard';
import { sound } from '../utils/audio';

interface CategoryGroupSectionProps {
  category: ModCategory;
  mods: SkyrimMod[];
  allModsCount: number;
  conflictMap: Map<string, ConflictIssue>;
  showBanners: boolean;
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
  dragTargetId?: string | null;
}

export const getCategoryIcon = (category: ModCategory) => {
  switch (category) {
    case 'Official Content':
      return <Shield className="w-5 h-5 text-amber-400" />;
    case 'Creation Club':
      return <Sparkles className="w-5 h-5 text-orange-400" />;
    case 'Framework & Engine':
      return <Cpu className="w-5 h-5 text-purple-400" />;
    case 'User Interface':
      return <Monitor className="w-5 h-5 text-sky-400" />;
    case 'Combat & Animations':
      return <Swords className="w-5 h-5 text-red-400" />;
    case 'Quests & New Lands':
      return <Mountain className="w-5 h-5 text-emerald-400" />;
    case 'Gameplay Overhaul':
      return <Wand2 className="w-5 h-5 text-rose-400" />;
    case 'Visuals & Shaders':
      return <Sun className="w-5 h-5 text-indigo-400" />;
    case 'Armor & Weapons':
      return <ShieldCheck className="w-5 h-5 text-yellow-400" />;
    case 'Audio & Music':
      return <Music className="w-5 h-5 text-teal-400" />;
    case 'Followers & NPCs':
      return <Users className="w-5 h-5 text-pink-400" />;
    case 'Utilities & Fixes':
      return <Wrench className="w-5 h-5 text-slate-400" />;
    default:
      return <HelpCircle className="w-5 h-5 text-gray-400" />;
  }
};

export const CategoryGroupSection: React.FC<CategoryGroupSectionProps> = ({
  category,
  mods,
  allModsCount,
  conflictMap,
  showBanners,
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
  dragTargetId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeCount = mods.filter((m) => m.status === 'active').length;
  const disabledCount = mods.length - activeCount;

  return (
    <div className="rounded-2xl border border-slate-800 bg-nordic-950/60 overflow-hidden shadow-lg transition-all">
      {/* Category Section Header */}
      <div
        onClick={() => {
          sound.playClick();
          setIsCollapsed(!isCollapsed);
        }}
        className="px-5 py-3.5 bg-gradient-to-r from-nordic-900 via-nordic-850 to-nordic-900 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-nordic-800/80 transition-colors select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-nordic-950 border border-slate-800 flex-shrink-0">
            {getCategoryIcon(category)}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-slate-100 tracking-wide">
                {category}
              </h3>
              <span className={`px-2 py-0.2 rounded-full text-xs font-mono font-bold border ${getCategoryBadgeStyle(category)}`}>
                {mods.length} {mods.length === 1 ? 'mod' : 'mods'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="text-emerald-400 font-semibold">{activeCount} active</span>
              {disabledCount > 0 && <span> &middot; <span className="text-rose-400">{disabledCount} disabled</span></span>}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            {isCollapsed ? 'Click to expand' : 'Click to collapse'}
          </span>
          <div className="p-1.5 rounded-lg bg-nordic-950 border border-slate-800 text-slate-400 hover:text-slate-200">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Cards List Inside Category Group */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 bg-nordic-900/30 animate-fadeIn">
          {mods.map((mod, index) => (
            <ModItemCard
              key={mod.id}
              mod={mod}
              isFirst={index === 0 && mod.priority === 0}
              isLast={index === mods.length - 1 && mod.priority === allModsCount - 1}
              conflictIssue={conflictMap.get(mod.id)}
              showBanners={showBanners}
              onToggleStatus={onToggleStatus}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onSetPriority={onSetPriority}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkUpdated={onMarkUpdated}
              onUpdateNotes={onUpdateNotes}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              isDragTarget={dragTargetId === mod.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
