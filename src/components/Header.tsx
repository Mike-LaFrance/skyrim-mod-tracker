import React, { useState } from 'react';
import {
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
  BookOpen,
  Key,
  ShieldCheck,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { PluginLimitGauge } from './PluginLimitGauge';
import { sound } from '../utils/audio';

interface HeaderProps {
  totalMods: number;
  activeMods: number;
  disabledMods: number;
  updatesAvailable: number;
  hasNexusApiKey: boolean;
  activeEsmEspCount: number;
  activeEslCount: number;
  conflictCount: number;
  activeProfileName: string;
  onCheckUpdates: () => void;
  onCleanRenumber: () => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  onOpenImportExport: () => void;
  onOpenAddMod: () => void;
  onResetDefaults: () => void;
  onOpenHelpCenter: () => void;
  onOpenNexusApiKey: () => void;
  onOpenDiagnostics: () => void;
  onOpenProfileManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalMods,
  activeMods,
  disabledMods,
  updatesAvailable,
  hasNexusApiKey,
  activeEsmEspCount,
  activeEslCount,
  conflictCount,
  activeProfileName,
  onCheckUpdates,
  onCleanRenumber,
  onEnableAll,
  onDisableAll,
  onOpenImportExport,
  onOpenAddMod,
  onResetDefaults,
  onOpenHelpCenter,
  onOpenNexusApiKey,
  onOpenDiagnostics,
  onOpenProfileManager,
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

      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-3.5">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-amber-500/25 via-nordic-800 to-nordic-900 border border-amber-500/50 shadow-gold-glow flex items-center justify-center flex-shrink-0">
              <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 transform -rotate-45" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-cinzel font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-200 drop-shadow">
                  SKYRIM LOAD ORDER TRACKER
                </h1>
                <span className="inline-block px-2 py-0.5 text-[11px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-950/70 border border-amber-600/50 rounded shadow-sm">
                  MO2 READY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mt-0.5">
                Special Edition & Anniversary Load Order Companion &middot; Nexus Update Auditor
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto justify-start xl:justify-end">
            {/* Profiles Switcher Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenProfileManager();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-nordic-800 hover:bg-nordic-750 border border-slate-700/80 text-slate-200 hover:text-amber-300 hover:border-amber-500/40 shadow-sm transition-all"
              title="Switch or manage loadout presets (Vanilla+, Survival, Graphics)"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="max-w-[120px] truncate">{activeProfileName}</span>
            </button>

            {/* Diagnostics Warning Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenDiagnostics();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                conflictCount > 0
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/50 animate-pulse-subtle'
                  : 'bg-nordic-800 border-slate-700/70 text-slate-300 hover:text-white'
              }`}
              title="Review load order conflicts, placement advisories & missing dependencies"
            >
              {conflictCount > 0 ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>Diagnostics</span>
              {conflictCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-nordic-950 text-[11px] font-bold font-mono">
                  {conflictCount}
                </span>
              )}
            </button>

            {/* Help & Codex Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenHelpCenter();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/50 text-amber-300 shadow-sm transition-all"
              title="Open Elder Scrolls Codex, Help Center & IONOS Deployment Guide"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Help & Codex</span>
            </button>

            {/* Nexus API Key Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenNexusApiKey();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                hasNexusApiKey
                  ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-nordic-800 border-slate-700/70 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
              }`}
              title="Configure Nexus Mods API Key for real-time version updates"
            >
              {hasNexusApiKey ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Key className="w-4 h-4 text-amber-400" />}
              <span>{hasNexusApiKey ? 'Nexus API Active' : 'Nexus API'}</span>
            </button>

            {/* Check Updates */}
            <button
              onClick={() => {
                sound.playClick();
                onCheckUpdates();
              }}
              className="group relative flex items-center space-x-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/50 hover:to-amber-500/40 border border-amber-500/40 text-amber-200 shadow-sm transition-all"
              title="Audit installed versions against latest Nexus releases"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Check Updates</span>
              {updatesAvailable > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-nordic-950 text-xs font-bold font-mono animate-pulse">
                  {updatesAvailable}
                </span>
              )}
            </button>

            {/* Clean Renumber */}
            <button
              onClick={() => {
                sound.playSwoosh();
                onCleanRenumber();
              }}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-nordic-800 hover:bg-nordic-750 border border-slate-700/70 text-slate-200 hover:text-white transition-colors"
              title="Re-index all load order priorities sequentially without gaps (#0000..#NNNN)"
            >
              <ListOrdered className="w-4 h-4 text-slate-400" />
              <span>Renumber</span>
            </button>

            {/* MO2 Import/Export */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenImportExport();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-nordic-800 hover:bg-nordic-750 border border-slate-700/70 text-slate-200 hover:text-white transition-colors"
              title="Import or Export ModOrganizer2 CSV / modlist format"
            >
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span>MO2</span>
            </button>

            {/* Add Mod */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAddMod();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Mod</span>
            </button>

            {/* Audio Mute Button */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-colors ${
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
              className="p-2 rounded-xl bg-nordic-800 hover:bg-red-950/40 border border-slate-700/60 hover:border-red-700/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Reset to Default Preset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon & Plugin Limit Gauge */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-nordic-900/90 border border-slate-800">
              <Boxes className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-xs">Total:</span>
              <span className="font-mono font-bold text-slate-100">{totalMods}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs">Active (+):</span>
              <span className="font-mono font-bold text-emerald-100">{activeMods}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs">Disabled (-):</span>
              <span className="font-mono font-bold text-rose-100">{disabledMods}</span>
            </div>

            {/* 254 Plugin Engine Limit Gauge */}
            <PluginLimitGauge
              activeEsmEspCount={activeEsmEspCount}
              activeEslCount={activeEslCount}
            />
          </div>

          {/* Quick Bulk Toggle Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-xs font-medium">Bulk State:</span>
            <button
              onClick={() => {
                sound.playToggle();
                onEnableAll();
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/60 transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={() => {
                sound.playToggle();
                onDisableAll();
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/60 transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
