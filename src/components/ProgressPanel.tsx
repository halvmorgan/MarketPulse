import React from 'react';
import { SectionKey, formatFriendlyTime, formatExactDuration, formatElapsed } from '../utils/timeEstimate';
import { RefreshCw } from 'lucide-react';

export type SectionStatus = 'idle' | 'working' | 'retrying' | 'done' | 'cached' | 'error';

export interface SectionProgressState {
  status: SectionStatus;
  initialEstimate: number;
  currentEstimate: number;
  remainingSec: number;
  durationSec?: number;
  errorMessage?: string;
}

interface ProgressPanelProps {
  topic: string;
  location: string;
  isNational: boolean;
  elapsedSec: number;
  sections: Record<SectionKey, SectionProgressState>;
  onRetrySection: (section: SectionKey) => void;
  allDoneSummary: string | null;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  topic,
  location,
  isNational,
  elapsedSec,
  sections,
  onRetrySection,
  allDoneSummary,
}) => {
  // When all done, collapse or replace into a short one-line summary that fades into the card layout smoothly
  if (allDoneSummary) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-6 transition-all duration-700 animate-fade-in">
        <div className="py-2.5 px-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{allDoneSummary}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">All 3 reads ready</span>
        </div>
      </div>
    );
  }

  // Calculate overall remaining time: LONGEST remaining section since all three run in parallel
  const activeRemainingList: number[] = [];
  let isAnyOverdue = false;
  let allCompleted = true;

  (Object.keys(sections) as SectionKey[]).forEach((key) => {
    const s = sections[key];
    if (s.status === 'working' || s.status === 'retrying') {
      allCompleted = false;
      const rem = s.currentEstimate - elapsedSec;
      if (rem <= 0) {
        isAnyOverdue = true;
        activeRemainingList.push(5); // slow creeping progress
      } else {
        activeRemainingList.push(rem);
      }
    } else if (s.status === 'idle') {
      allCompleted = false;
      activeRemainingList.push(s.currentEstimate);
    }
  });

  if (allCompleted) {
    return null;
  }

  const maxRemaining = activeRemainingList.length > 0 ? Math.max(...activeRemainingList) : 0;

  // Calculate overall progress percentage
  // Creep slowly past 90% if overdue, never reach 100% until the section is actually done
  let progressPct = 0;
  const maxInitialEst = Math.max(
    sections.people_ask.currentEstimate,
    sections.social.currentEstimate,
    sections.rising.currentEstimate
  );

  if (isAnyOverdue || elapsedSec >= maxInitialEst) {
    const overdueTime = Math.max(0, elapsedSec - maxInitialEst);
    // Asymptotic creep from 90% towards 98%
    progressPct = Math.min(98, 90 + (overdueTime / (overdueTime + 25)) * 8);
  } else {
    progressPct = Math.min(90, Math.round((elapsedSec / Math.max(1, maxInitialEst)) * 90));
  }

  const friendlyOverallTime = formatFriendlyTime(maxRemaining);
  const capitalizedFriendlyTime = friendlyOverallTime.charAt(0).toUpperCase() + friendlyOverallTime.slice(1);

  const overallTimeText = isAnyOverdue && maxRemaining <= 5
    ? 'Taking a little longer than usual — still working…'
    : `${capitalizedFriendlyTime} left`;

  const section3Name = isNational ? 'Rising Across the US' : `Rising in ${location}`;

  const renderSectionStatus = (key: SectionKey, title: string) => {
    const s = sections[key];
    const rem = s.currentEstimate - elapsedSec;
    const isPastEst = rem <= 0;

    let icon = <span className="text-slate-400 font-bold">•</span>;
    if (s.status === 'done' || s.status === 'cached') {
      icon = <span className="text-emerald-400 font-bold">✓</span>;
    } else if (s.status === 'error') {
      icon = <span className="text-rose-400 font-bold">✗</span>;
    }

    return (
      <div key={key} className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60 last:border-b-0">
        <div className="flex items-center gap-2 flex-wrap">
          {icon}
          <span className="text-slate-200 font-medium">{title}</span>
          <span className="text-slate-600">—</span>

          {s.status === 'cached' && (
            <span className="text-emerald-400 font-medium">Loaded from today's read — instant</span>
          )}

          {s.status === 'done' && (
            <span className="text-emerald-400 font-medium">
              Done in {formatExactDuration(s.durationSec || 0)}
            </span>
          )}

          {s.status === 'working' && (
            <span className="text-slate-300">
              {isPastEst ? (
                <span className="text-amber-300 italic">Taking a little longer than usual — still working…</span>
              ) : (
                <span>Working… ({formatFriendlyTime(rem)} left)</span>
              )}
            </span>
          )}

          {s.status === 'retrying' && (
            <span className="text-amber-300">
              {isPastEst ? (
                <span className="italic">Taking a little longer than usual — still working…</span>
              ) : (
                <span>Retrying… ({formatFriendlyTime(rem)} left)</span>
              )}
            </span>
          )}

          {s.status === 'idle' && (
            <span className="text-slate-500">Queued… ({formatFriendlyTime(s.initialEstimate)})</span>
          )}

          {s.status === 'error' && (
            <span className="text-rose-400 font-medium">Couldn't finish</span>
          )}
        </div>

        {/* Try again link for failed section */}
        {s.status === 'error' && (
          <button
            type="button"
            onClick={() => onRetrySection(key)}
            className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Try again</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6 transition-all duration-300">
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl space-y-3.5">
        {/* Progress Header: Reading the market on '[topic]' for [Location]… */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="text-sm font-semibold text-white">
            Reading the market on <span className="text-indigo-400">"{topic}"</span> for <span className="text-slate-200">{location}</span>…
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="text-slate-400">Elapsed: {formatElapsed(elapsedSec)}</span>
          </div>
        </div>

        {/* Overall time line + thin progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>{overallTimeText}</span>
            <span className="font-mono text-slate-500 text-[11px]">{Math.round(progressPct)}%</span>
          </div>

          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out shadow-xs shadow-indigo-500/50"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Small status row per section */}
        <div className="pt-2 border-t border-slate-800/80 space-y-0.5">
          {renderSectionStatus('people_ask', 'What People Ask')}
          {renderSectionStatus('social', "What's Working on Social")}
          {renderSectionStatus('rising', section3Name)}
        </div>
      </div>
    </div>
  );
};
