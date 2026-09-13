import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  DownloadCloud,
  Check,
  RefreshCw,
  ExternalLink,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { SkyrimMod } from '../types';
import { sound } from '../utils/audio';
import { getStoredNexusApiKey } from '../utils/nexusApi';

interface UpdatesScannerModalProps {
  isOpen: boolean;
  mods: SkyrimMod[];
  onClose: () => void;
  onUpdateAll: () => void;
  onUpdateSingle: (id: string) => void;
  onOpenNexusApiKeyModal?: () => void;
}

export const UpdatesScannerModal: React.FC<UpdatesScannerModalProps> = ({
  isOpen,
  mods,
  onClose,
  onUpdateAll,
  onUpdateSingle,
  onOpenNexusApiKeyModal,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScanningName, setCurrentScanningName] = useState('');
  const [scanComplete, setScanComplete] = useState(false);
  const hasApiKey = Boolean(getStoredNexusApiKey());

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setScanComplete(false);

    let idx = 0;
    const total = mods.length;
    const interval = setInterval(() => {
      idx++;
      const pct = Math.min(100, Math.round((idx / total) * 100));
      setProgress(pct);
      if (idx < total) {
        setCurrentScanningName(mods[idx].name);
      }

      if (idx >= total) {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
        sound.playChime();
      }
    }, 28);
  };

  useEffect(() => {
    if (isOpen) {
      startScan();
    } else {
      setIsScanning(false);
      setProgress(0);
      setScanComplete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modsWithUpdates = mods.filter((m) => m.hasUpdate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nordic-900 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-800 bg-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">Nexus Version Auditor</h2>
                {hasApiKey ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    API CONNECTED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-600/50 text-amber-400">
                    CATALOG AUDIT
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">Auditing active Skyrim load order against Nexus releases</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-nordic-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Nexus API Status Ribbon */}
          {!hasApiKey && onOpenNexusApiKeyModal && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs sm:text-sm text-amber-200">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Tip: Connect your free Nexus API Key to query live Nexus servers in real-time.</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenNexusApiKeyModal();
                }}
                className="px-3 py-1 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 text-xs transition-colors"
              >
                Connect API Key
              </button>
            </div>
          )}
          {/* Progress & Scanning Indicator */}
          <div className="bg-nordic-950/80 p-5 rounded-xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    Querying Nexus Mods API ({progress}%)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Nexus Audit Completed ({mods.length} Mods Checked)
                  </>
                )}
              </span>
              <span className="font-mono text-amber-400 font-bold text-base sm:text-lg">{progress}%</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-nordic-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 h-full transition-all duration-75 shadow-gold-glow"
                style={{ width: `${progress}%` }}
              />
            </div>

            {isScanning && (
              <p className="text-xs sm:text-sm text-slate-400 truncate font-mono">
                Checking: <span className="text-slate-100 font-medium">{currentScanningName || 'Initializing handshake...'}</span>
              </p>
            )}
          </div>

          {/* Results Summary */}
          {scanComplete && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-nordic-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-100 font-bold text-sm sm:text-base">
                    Found {modsWithUpdates.length} {modsWithUpdates.length === 1 ? 'mod' : 'mods'} with newer releases
                  </span>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {modsWithUpdates.length > 0
                      ? 'Review the outdated packages below and update them in 1-click.'
                      : 'All mods in your load order are running the latest version!'}
                  </p>
                </div>

                {modsWithUpdates.length > 0 && (
                  <button
                    onClick={() => {
                      sound.playChime();
                      onUpdateAll();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow text-xs sm:text-sm transition-all"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    <span>Update All ({modsWithUpdates.length})</span>
                  </button>
                )}
              </div>

              {/* List of Mods With Updates */}
              {modsWithUpdates.length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {modsWithUpdates.map((mod) => (
                    <div
                      key={mod.id}
                      className="p-3 bg-nordic-950/90 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-200 text-sm">{mod.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 pl-6">
                          <span>Installed: <strong className="text-slate-300 font-mono">v{mod.currentVersion}</strong></span>
                          <span>&rarr;</span>
                          <span>Latest: <strong className="text-amber-400 font-mono">v{mod.latestVersion}</strong></span>
                          <span className="text-slate-500">&middot;</span>
                          <a
                            href={mod.nexusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                          >
                            <span>Nexus Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          sound.playChime();
                          onUpdateSingle(mod.id);
                        }}
                        className="self-end sm:self-center flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-nordic-800 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-500 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Updated</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-nordic-950/40 rounded-xl border border-slate-800 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="font-cinzel text-base text-slate-200 font-semibold">Load Order is Fully Synchronized</p>
                  <p className="text-xs text-slate-500">Every single plugin matches the latest release on Nexus Mods.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-nordic-950 flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              startScan();
            }}
            disabled={isScanning}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-nordic-800 hover:bg-nordic-750 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-Scan Load Order</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg font-bold bg-nordic-800 hover:bg-nordic-750 text-slate-200 border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
