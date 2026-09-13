import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ConflictIssue, ConflictSeverity } from '../types';
import { sound } from '../utils/audio';

interface ConflictDiagnosticsModalProps {
  isOpen: boolean;
  issues: ConflictIssue[];
  onClose: () => void;
}

export const ConflictDiagnosticsModal: React.FC<ConflictDiagnosticsModalProps> = ({
  isOpen,
  issues,
  onClose,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | ConflictSeverity>('all');

  if (!isOpen) return null;

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const advisoryCount = issues.filter((i) => i.severity === 'advisory').length;

  const filteredIssues =
    severityFilter === 'all'
      ? issues
      : issues.filter((i) => i.severity === severityFilter);

  const getSeverityBadge = (severity: ConflictSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-500/40 bg-red-950/60 text-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Critical Order Conflict</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-500/40 bg-amber-950/60 text-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Placement Warning</span>
          </span>
        );
      case 'advisory':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border border-cyan-500/40 bg-cyan-950/60 text-cyan-300">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compatibility Advisory</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-nordic-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-nordic-950/70">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border ${issues.length > 0 ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'}`}>
              {issues.length > 0 ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-cinzel font-bold text-slate-100">
                Load Order Diagnostics & Compatibility
              </h2>
              <p className="text-xs text-slate-400">
                Rule engine evaluating mod placement, engine limits, and required patches
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Metrics Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-nordic-950/40 border-b border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sound.playClick();
                setSeverityFilter('all');
              }}
              className={`px-3 py-1 rounded-md transition-all font-medium ${severityFilter === 'all' ? 'bg-slate-700 text-slate-100 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({issues.length})
            </button>
            {criticalCount > 0 && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSeverityFilter('critical');
                }}
                className={`px-3 py-1 rounded-md transition-all font-medium ${severityFilter === 'critical' ? 'bg-red-500/30 text-red-300 font-bold' : 'text-red-400 hover:text-red-300'}`}
              >
                Critical ({criticalCount})
              </button>
            )}
            {warningCount > 0 && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSeverityFilter('warning');
                }}
                className={`px-3 py-1 rounded-md transition-all font-medium ${severityFilter === 'warning' ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-amber-400 hover:text-amber-300'}`}
              >
                Warnings ({warningCount})
              </button>
            )}
            {advisoryCount > 0 && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSeverityFilter('advisory');
                }}
                className={`px-3 py-1 rounded-md transition-all font-medium ${severityFilter === 'advisory' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-cyan-400 hover:text-cyan-300'}`}
              >
                Advisories ({advisoryCount})
              </button>
            )}
          </div>

          <span className="text-slate-500 font-mono">LOOT Standard v1.2</span>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 custom-scrollbar">
          {issues.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-slate-200">
                All Load Order Diagnostics Clear!
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No priority sequence conflicts, missing SKSE dependencies, or overlapping master errors were detected among your active plugins.
              </p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No issues matching severity &quot;{severityFilter}&quot;.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-xl bg-nordic-950/70 border border-slate-800/90 space-y-2.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      {getSeverityBadge(issue.severity)}
                      <span className="font-semibold text-slate-200 text-sm">
                        {issue.modName}
                      </span>
                    </div>
                    <h4 className="text-sm font-cinzel font-bold text-amber-200 pt-0.5">
                      {issue.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {issue.message}
                </p>

                <div className="p-2.5 rounded-lg bg-nordic-900 border border-slate-800 text-xs text-amber-300/90 flex items-start space-x-2">
                  <span className="font-bold text-amber-400 flex-shrink-0">Recommendation:</span>
                  <span>{issue.recommendation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-nordic-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>
            {issues.length} {issues.length === 1 ? 'diagnostic issue' : 'diagnostic issues'} flagged
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-nordic-950 font-bold text-sm transition-all shadow-gold-glow"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
