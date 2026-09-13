import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  ListOrdered,
  CheckCircle2,
  XCircle,
  FileCode2,
  PlusCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Boxes,
  Compass,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  totalMods: number;
  activeMods: number;
  disabledMods: number;
  updatesAvailable: number;
  onCheckUpdates: () => void;
  onCleanRenumber: () => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  onOpenImportExport: () => void;
  onOpenAddMod: () => void;
  onResetDefaults: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalMods,
  activeMods,
  disabledMods,
  updatesAvailable,
  onCheckUpdates,
  onCleanRenumber,
  onEnableAll,
  onDisableAll,
  onOpenImportExport,
  onOpenAddMod,
  onResetDefaults,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const handleResetClick = () => {
    sound.playClick();
    if (window.confirm('Reset all mods and load order back to default Skyrim SE preset? This will overwrite custom edits.')) {
      onResetDefaults();
    }
  };

  return (
    <header className="relative border-b border-gold-500/20 bg-gradient-to-b from-nordic-900 via-nordic-850 to-nordic-900/90 shadow-2xl backdrop-blur-md sticky top-0 z-40">
      {/* Top ambient gold glow accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 via-nordic-800 to-nordic-900 border border-amber-500/40 shadow-gold-glow flex items-center justify-center">
              {/* Skyrim Dragon-inspired emblem */}
              <Compass className="w-7 h-7 text-amber-400 transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-cinzel font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-sm">
                  SKYRIM LOAD ORDER TRACKER
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-950/60 border border-amber-600/40 rounded">
                  MO2 READY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Special Edition & Anniversary Load Order Companion &middot; Nexus Update Auditor
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onCheckUpdates();
              }}
              className="group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/50 hover:to-amber-500/40 border border-amber-500/40 text-amber-200 shadow-sm transition-all"
              title="Audit installed versions against latest Nexus releases"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Check Updates</span>
              {updatesAvailable > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-nordic-950 text-[10px] font-bold font-mono animate-pulse">
                  {updatesAvailable}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sound.playSwoosh();
                onCleanRenumber();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-nordic-800 hover:bg-nordic-750 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Re-index all load order priorities sequentially without gaps (#0000..#NNNN)"
            >
              <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
              <span>Clean Renumber</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenImportExport();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-nordic-800 hover:bg-nordic-750 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Import or Export ModOrganizer2 CSV / modlist format"
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>MO2 Import/Export</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAddMod();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Mod</span>
            </button>

            {/* Audio Mute Button */}
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMuted
                  ? 'bg-red-950/40 border-red-800/50 text-red-400'
                  : 'bg-nordic-800 border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/40'
              }`}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetClick}
              className="p-1.5 rounded-lg bg-nordic-800 hover:bg-red-950/40 border border-slate-700/60 hover:border-red-700/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Reset to 60+ Default Skyrim SE Mods Preset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-nordic-900/90 border border-slate-800">
              <Boxes className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Total Mods:</span>
              <span className="font-mono font-bold text-slate-200">{totalMods}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active (+):</span>
              <span className="font-mono font-bold text-emerald-200">{activeMods}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-950/30 border border-rose-800/40 text-rose-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Disabled (-):</span>
              <span className="font-mono font-bold text-rose-200">{disabledMods}</span>
            </div>

            {updatesAvailable > 0 && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-600/40 text-amber-300 animate-pulse-subtle">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Updates:</span>
                <span className="font-mono font-bold text-amber-200">{updatesAvailable}</span>
              </div>
            )}
          </div>

          {/* Quick Bulk Toggle Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[11px]">Bulk State:</span>
            <button
              onClick={() => {
                sound.playToggle();
                onEnableAll();
              }}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/50 transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={() => {
                sound.playToggle();
                onDisableAll();
              }}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/50 transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
