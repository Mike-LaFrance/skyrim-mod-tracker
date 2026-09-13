import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Info,
} from 'lucide-react';
import {
  getStoredNexusApiKey,
  saveNexusApiKey,
  clearStoredNexusApiKey,
  validateNexusApiKey,
  NexusUserValidation,
} from '../utils/nexusApi';
import { sound } from '../utils/audio';

interface NexusApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyUpdated: (hasKey: boolean) => void;
}

export const NexusApiKeyModal: React.FC<NexusApiKeyModalProps> = ({
  isOpen,
  onClose,
  onApiKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<NexusUserValidation | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredNexusApiKey();
      setApiKey(stored);
      if (stored) {
        handleValidate(stored, false);
      } else {
        setValidationResult(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidate = async (keyToTest: string, playSound = true) => {
    if (!keyToTest.trim()) {
      setStatusMessage('Please enter an API key first.');
      return;
    }

    setIsValidating(true);
    setStatusMessage(null);

    const result = await validateNexusApiKey(keyToTest);
    setValidationResult(result);
    setIsValidating(false);

    if (result.valid) {
      saveNexusApiKey(keyToTest);
      onApiKeyUpdated(true);
      if (playSound) sound.playChime();
    } else {
      if (playSound) sound.playClick();
    }
  };

  const handleClearKey = () => {
    sound.playClick();
    clearStoredNexusApiKey();
    setApiKey('');
    setValidationResult(null);
    setStatusMessage('API Key removed.');
    onApiKeyUpdated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-nordic-900 border border-gold-500/40 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-800 bg-nordic-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Key className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">Nexus Mods API Key</h2>
              <p className="text-xs sm:text-sm text-slate-400">Connect your Nexus Mods account for live version audits</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Info Box */}
          <div className="bg-nordic-950/80 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-300 text-xs sm:text-sm">
              <p className="font-semibold text-slate-100">Where to get your Personal API Key:</p>
              <p className="leading-relaxed">
                Log into Nexus Mods, go to your <strong>Account Settings &rarr; API Tab</strong>, and scroll down to <strong>Personal API Key</strong>. Click "Generate" and paste the key here.
              </p>
              <a
                href="https://www.nexusmods.com/users/myaccount?tab=api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-semibold underline pt-1"
              >
                <span>Open Nexus Mods API Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-semibold text-xs sm:text-sm">
              Your Personal API Key:
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setStatusMessage(null);
                }}
                placeholder="Paste your 64+ character personal API key here..."
                className="flex-1 px-4 py-2.5 bg-nordic-950 border border-slate-700/90 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={() => handleValidate(apiKey, true)}
                disabled={isValidating || !apiKey.trim()}
                className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-nordic-950 shadow-gold-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Validate & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Validation Feedback */}
          {validationResult && (
            <div className="animate-fade-in">
              {validationResult.valid ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Nexus API Key Connected Successfully!</span>
                    </div>
                    {validationResult.isPremium && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-nordic-950">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 space-y-1 pl-7">
                    <p>Account User: <strong className="text-slate-100">{validationResult.name}</strong></p>
                    {validationResult.dailyRemaining !== undefined && (
                      <p className="font-mono text-slate-400">
                        Daily Requests Remaining: <strong className="text-emerald-400">{validationResult.dailyRemaining}</strong> / 10,000
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-1 text-rose-300 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Validation Notice</span>
                  </div>
                  <p className="leading-relaxed pl-6">{validationResult.error}</p>
                </div>
              )}
            </div>
          )}

          {statusMessage && (
            <p className="text-xs text-slate-400 italic">{statusMessage}</p>
          )}

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-nordic-950 border border-slate-800 text-slate-400 text-xs leading-relaxed space-y-1">
            <p className="font-semibold text-slate-300">Security & Privacy:</p>
            <p>
              Your key is saved only in your local web browser's storage (<code className="text-amber-300">localStorage</code>) and is never transmitted to any third-party servers. It is used exclusively to contact <code className="text-amber-300">api.nexusmods.com</code> directly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-nordic-950 flex items-center justify-between">
          {getStoredNexusApiKey() ? (
            <button
              onClick={handleClearKey}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/50 text-xs sm:text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Key</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl font-bold bg-nordic-800 hover:bg-nordic-750 text-slate-200 border border-slate-700 text-xs sm:text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
