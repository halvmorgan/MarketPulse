import React from 'react';
import { ActiveView } from '../types';
import { Video, PhoneCall, Calendar, ShieldCheck } from 'lucide-react';

interface HowTheyFitTogetherProps {
  onSelectStep: (view: ActiveView) => void;
  location: string;
  isNational: boolean;
}

export const HowTheyFitTogether: React.FC<HowTheyFitTogetherProps> = ({
  onSelectStep,
  location,
  isNational,
}) => {
  const step3Description = isNational
    ? "See what's rising across the US and lead your content with it."
    : `See what's rising in ${location} and lead your content with it.`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Operating Rhythm
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            How They Fit Together
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 01 */}
          <button
            onClick={() => onSelectStep('social')}
            className="flex flex-col text-left p-5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-pink-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold font-mono text-pink-400">
                01
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
              Before you post
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Check what's working on social, then film your own take on the pattern.
            </p>
          </button>

          {/* Step 02 */}
          <button
            onClick={() => onSelectStep('people-ask')}
            className="flex flex-col text-left p-5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold font-mono text-amber-400">
                02
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Before you call
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Search the topic in What People Ask and open with the question they're most likely holding.
            </p>
          </button>

          {/* Step 03 */}
          <button
            onClick={() => onSelectStep('state-pulse')}
            className="flex flex-col text-left p-5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold font-mono text-emerald-400">
                03
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              When you plan the week
            </h4>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              {step3Description}
            </p>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            All three are research. Nothing is posted anywhere and no one is contacted.
          </span>
        </div>
      </div>
    </section>
  );
};
