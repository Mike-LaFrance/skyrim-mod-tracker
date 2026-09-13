import React, { useState } from 'react';
import { Gauge, Info, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface PluginLimitGaugeProps {
  activeEsmEspCount: number;
  activeEslCount: number;
}

export const PluginLimitGauge: React.FC<PluginLimitGaugeProps> = ({
  activeEsmEspCount,
  activeEslCount,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const maxEsmEsp = 254;
  const maxEsl = 4096;
  const percentage = Math.min(100, Math.round((activeEsmEspCount / maxEsmEsp) * 100));

  // Determine status severity
  const isCritical = activeEsmEspCount >= 245;
  const isWarning = activeEsmEspCount >= 200 && activeEsmEspCount < 245;

  const statusColor = isCritical
    ? 'text-red-400 border-red-500/40 bg-red-950/40'
    : isWarning
    ? 'text-amber-400 border-amber-500/40 bg-amber-950/40'
    : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';

  const barColor = isCritical
    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
    : isWarning
    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          setShowExplanation(!showExplanation);
        }}
        className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer text-xs sm:text-sm font-mono ${statusColor}`}
        title="Skyrim SE Engine Plugin Limit (Click for details)"
      >
        <div className="flex items-center space-x-1.5">
          <Gauge className="w-4 h-4" />
          <span className="font-semibold text-slate-200">Engine Cap:</span>
        </div>

        {/* Mini progress bar */}
        <div className="flex items-center space-x-2">
          <div className="w-14 sm:w-20 h-2 bg-nordic-900 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className={`h-full transition-all duration-500 ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="font-bold">
            {activeEsmEspCount}
            <span className="text-slate-400 font-normal">/{maxEsmEsp}</span>
          </span>
        </div>

        <span className="hidden xl:inline-block text-slate-400">|</span>

        {/* ESL Count */}
        <div className="hidden xl:flex items-center space-x-1 text-cyan-400">
          <span className="text-slate-400 text-xs">ESL:</span>
          <span className="font-bold">{activeEslCount}</span>
          <span className="text-slate-400 text-[11px]">/{maxEsl}</span>
        </div>

        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200 transition-colors" />
      </button>

      {/* Interactive Explanation Modal / Popover */}
      {showExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-nordic-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <Gauge className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-cinzel font-bold text-amber-200">
                  Skyrim Engine Plugin Limit
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowExplanation(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-3.5 rounded-xl bg-nordic-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Active ESM & ESP Plugins:</span>
                  <span className={`font-mono font-bold text-base ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeEsmEspCount} / 254
                  </span>
                </div>
                <div className="w-full h-2.5 bg-nordic-900 rounded-full overflow-hidden border border-slate-700">
                  <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }} />
                </div>
                <p className="text-xs text-slate-400">
                  Slots <code className="text-amber-300">0x00</code> through <code className="text-amber-300">0xFD</code> are reserved for full plugins. Slot <code className="text-amber-300">0xFE</code> is the light container, and <code className="text-amber-300">0xFF</code> is dynamic saved game memory.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-200">Active ESL (Light Plugins):</span>
                  <span className="font-mono font-bold text-base text-cyan-300">
                    {activeEslCount} / 4,096
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  ESL-flagged plugins share index <code className="text-cyan-300">0xFE</code> and do <strong className="text-slate-200">NOT</strong> count toward the 254 limit!
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-200">Tip for Large Load Orders:</strong> In ModOrganizer2 or SSEEdit, check your ESP plugins for ESL-flag capability. Flagging small weapon, armor, and patch mods as ESL allows thousands of mods to run safely without game engine crashes.
                  </p>
                </div>
                {isCritical && (
                  <div className="flex items-start space-x-2 text-red-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Danger!</strong> You have {activeEsmEspCount} active full plugins. Crossing 254 will trigger instant game crashes on startup.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowExplanation(false);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-nordic-950 font-bold text-sm transition-all shadow-gold-glow"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
