import React from 'react';
import { ActiveView } from '../types';
import { Compass, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  topic: string;
  location: string;
  isNational: boolean;
  formattedTime?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSources: () => void;
  sourcesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  topic,
  location,
  isNational,
  formattedTime,
  isRefreshing,
  onRefresh,
  onOpenSources,
  sourcesCount,
}) => {
  const section3NavLabel = isNational ? 'Rising Across the US' : `Rising in ${location}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090e1f]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Current Context */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 cursor-pointer"
            title="Return to Market Pulse Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                Market Pulse
              </span>
              <span className="text-[11px] font-medium text-slate-400 block leading-tight">
                Live Google Search Grounding
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links or Context Breadcrumb */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'home'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('people-ask')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'people-ask'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            What People Ask
          </button>
          <button
            onClick={() => onNavigate('social')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'social'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            What's Working on Social
          </button>
          <button
            onClick={() => onNavigate('state-pulse')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'state-pulse'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {section3NavLabel}
          </button>
        </div>

        {/* Zone 3: Actions & Timestamp */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeView !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={onOpenSources}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Inspect verified Google Search grounding sources"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>{sourcesCount} Verified Sources</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 border border-indigo-500/30 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
            title="Force a fresh live read with Google Search Grounding"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Reading Market...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar showing active research topic, location, and cache status */}
      <div className="bg-[#0c1328] border-t border-slate-800/60 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Active Topic:</span>
          <span className="font-semibold text-slate-200">{topic}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">Location:</span>
          <span className="font-semibold text-slate-200">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          {formattedTime && (
            <span>Read for: <strong className="text-slate-200">{location}</strong> · <span className="text-slate-300 font-mono">{formattedTime}</span></span>
          )}
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400/90 font-medium">Cached Locally</span>
        </div>
      </div>
    </header>
  );
};
