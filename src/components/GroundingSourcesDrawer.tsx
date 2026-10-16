import React from 'react';
import { GroundingSource } from '../types';
import { X, ShieldCheck, ExternalLink, Search, CheckCircle2 } from 'lucide-react';

interface GroundingSourcesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: GroundingSource[];
  queries: string[];
  topic: string;
  state: string;
  formattedTime?: string;
}

export const GroundingSourcesDrawer: React.FC<GroundingSourcesDrawerProps> = ({
  isOpen,
  onClose,
  sources,
  queries,
  topic,
  state,
  formattedTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Google Search Grounding Audit
              </h2>
              <p className="text-xs text-slate-400">
                Live web sources retrieved by Gemini for "{topic}" in {state}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Grounding guarantee info banner */}
          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 text-sky-200 text-xs leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Strict Grounding Protocol Active:</strong>
              Every link presented in Market Pulse is strictly extracted from real search chunks returned by Google Search grounding. Unverified URLs are filtered out by server-side verification.
            </div>
          </div>

          {/* Search Queries Used */}
          {queries && queries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search Queries Executed</span>
              </h3>
              <div className="space-y-1.5">
                {queries.map((q, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-xs text-slate-300">
                    "{q}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Sources List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Grounding Web Sources ({sources.length})
              </h3>
              {formattedTime && (
                <span className="text-[11px] font-mono text-slate-500">
                  Retrieved: {formattedTime}
                </span>
              )}
            </div>

            {sources.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No web sources were attached to this read.
              </p>
            ) : (
              <div className="space-y-2">
                {sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/50 hover:bg-slate-800/60 transition-all group"
                  >
                    <div className="truncate pr-3">
                      <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors truncate">
                        {source.title || source.uri}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                        {source.uri}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Google Search Grounding Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
