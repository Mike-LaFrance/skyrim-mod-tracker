import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, Upload, FileCode2, Info } from 'lucide-react';
import { SkyrimMod } from '../types';
import { exportToMO2Format, importFromMO2Text } from '../utils/storage';
import { sound } from '../utils/audio';

interface ImportExportModalProps {
  isOpen: boolean;
  mods: SkyrimMod[];
  onClose: () => void;
  onImport: (importedMods: SkyrimMod[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  mods,
  onClose,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const exportedText = useMemo(() => exportToMO2Format(mods), [mods]);

  if (!isOpen) return null;

  const handleCopyExport = () => {
    sound.playClick();
    navigator.clipboard.writeText(exportedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    sound.playClick();
    const blob = new Blob([exportedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modlist_skyrim_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePerformImport = () => {
    if (!importText.trim()) {
      setImportError('Please paste your ModOrganizer2 text or CSV format before importing.');
      return;
    }

    try {
      sound.playChime();
      const result = importFromMO2Text(importText, mods);
      if (result.length === 0) {
        setImportError('Could not recognize any valid mod entries in the pasted text.');
        return;
      }
      onImport(result);
      onClose();
    } catch (err) {
      setImportError(`Failed to parse modlist: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nordic-900 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-800 bg-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileCode2 className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">ModOrganizer2 Import & Export</h2>
              <p className="text-xs sm:text-sm text-slate-400">Standard MO2 CSV load order synchronization</p>
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-nordic-950/60 px-6">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('export');
            }}
            className={`py-3.5 px-5 font-semibold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export MO2 List ({mods.length} Mods)</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('import');
            }}
            className={`py-3.5 px-5 font-semibold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'import'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import MO2 Modlist</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-slate-300 text-sm">
                  Copy or download your complete active/disabled load order in MO2 format:
                </span>
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={handleCopyExport}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-nordic-800 hover:bg-nordic-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-nordic-950 font-bold transition-all shadow-gold-glow text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              {/* Code preview area */}
              <div className="bg-nordic-950 border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-300 max-h-96 overflow-y-auto leading-relaxed whitespace-pre select-all">
                {exportedText}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-nordic-950/80 p-3 rounded-lg border border-slate-800 flex items-start space-x-2 text-slate-300">
                <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Paste your ModOrganizer2 export CSV or <code>modlist.txt</code>. Existing mods in the catalog will preserve their rich descriptions, Nexus links, and notes. Unknown mods will be registered automatically with inferred categories and types.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Paste ModOrganizer2 Raw Text or CSV:
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    setImportError(null);
                  }}
                  rows={10}
                  placeholder={`#Mod_Priority,#Mod_Status,#Mod_Name\n"0000","+","DLC: HearthFires"\n"0001","+","SkyUI"\n"0002","-","CACO"`}
                  className="w-full p-3 bg-nordic-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {importError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs">
                  {importError}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 bg-nordic-800 hover:bg-nordic-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePerformImport}
                  className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow flex items-center space-x-1.5 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Parse & Import Load Order</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
