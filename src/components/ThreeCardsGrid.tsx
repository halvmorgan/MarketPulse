import React from 'react';
import { MarketPulseResult, ActiveView } from '../types';
import { ArrowRight, Video, TrendingUp, Loader2 } from 'lucide-react';

interface ThreeCardsGridProps {
  data: MarketPulseResult;
  onOpenCard: (view: ActiveView) => void;
  loadingSections?: {
    people_ask?: boolean;
    social?: boolean;
    rising?: boolean;
  };
}

export const ThreeCardsGrid: React.FC<ThreeCardsGridProps> = ({
  data,
  onOpenCard,
  loadingSections = {},
}) => {
  const { people_ask, social, state_pulse, national_pulse, location, is_national } = data;

  const isCard1Loading = loadingSections.people_ask && !people_ask;
  const isCard2Loading = loadingSections.social && !social;
  const isCard3Loading = loadingSections.rising && !(is_national ? national_pulse : state_pulse);

  const questionsCount = people_ask?.questions?.length || 0;
  const redditCount = people_ask?.reddit_threads?.length || 0;
  const videosCount = social?.total_videos_found || social?.videos?.length || 0;
  const totalViews = social?.total_estimated_views || 'approx. 2.5M';
  const sampleHook = social?.sample_hook_quote || (social?.top_hooks?.[0]?.hook ? `"${social.top_hooks[0].hook}"` : '""');

  const breakoutQuery = is_national
    ? (national_pulse?.breakout_queries?.[0]?.query || national_pulse?.core_searches?.[0]?.query || 'National queries surging')
    : (state_pulse?.top_breakout_query || state_pulse?.core_searches?.[0]?.query || 'Local queries surging');

  const card3Title = is_national ? 'Rising Across the US' : 'Rising in Your State';
  const card3Description = is_national
    ? 'Search interest for the topic\'s core searches: how each moved nationally over three months, which states search it most, and the searches breaking out nationwide.'
    : `Search interest for the topic's core searches: how each moved over three months, where ${location} ranks, and the searches breaking out there.`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1: What People Ask */}
        <div className="flex flex-col justify-between bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/20 hover:shadow-amber-500/5 transition-all group">
          <div>
            {/* Top Row: Source icons + Schedule label */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center p-1.5" title="Google Search & AI Overviews">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.27-2.09 3.64-5.17 3.64-9.15z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.9H1.21v3.13C3.25 21.36 7.35 24 12 24z" />
                    <path fill="#FBBC05" d="M5.32 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.57H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.43l4.11-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.21 6.57l4.11 3.13c.94-2.81 3.58-4.95 6.68-4.95z" />
                  </svg>
                </div>
                <div className="w-7 h-7 rounded-md bg-[#FF4500]/15 flex items-center justify-center p-1.5" title="Reddit Communities">
                  <svg className="w-full h-full fill-[#FF4500]" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#FF4500" />
                    <path fill="#FFFFFF" d="M19.5 12c0-.8-.7-1.5-1.5-1.5-.4 0-.8.2-1.1.5-1.1-.8-2.7-1.3-4.4-1.4l.8-3.7 2.6.6c.1.6.6 1 1.2 1 .7 0 1.3-.6 1.3-1.3 0-.7-.6-1.3-1.3-1.3-.5 0-1 .3-1.2.8l-2.9-.6c-.2 0-.3.1-.4.3l-.9 4.2c-1.8.1-3.4.6-4.6 1.4-.3-.3-.7-.5-1.1-.5-.8 0-1.5.7-1.5 1.5 0 .6.3 1.1.8 1.3-.1.3-.1.6-.1.9 0 2.5 2.9 4.5 6.5 4.5s6.5-2 6.5-4.5c0-.3 0-.6-.1-.9.5-.2.8-.7.8-1.3zm-10.5 0c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm6.5 3c-.7.7-2 .8-2.5.8s-1.8-.1-2.5-.8c-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 .5.5 1.5.6 2.1.6.6 0 1.6-.1 2.1-.6.1-.1.3-.1.4 0 .1.1.1.3 0 .4zm-.5-2c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                  </svg>
                </div>
              </div>

              <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Run before sales calls
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              What People Ask
            </h2>
            <div className="w-10 h-0.5 bg-amber-400 mt-2 mb-3.5 rounded-full" />

            <p className="text-sm text-slate-300 leading-relaxed min-h-[44px]">
              Real Google questions, the AI overview prospects see, and the Reddit threads — with a short brief in the public's own words.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {isCard1Loading ? (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Reading live queries…</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400 font-mono tabular-nums">
                {questionsCount} questions · {redditCount} threads found
              </span>
            )}

            <button
              onClick={() => onOpenCard('people-ask')}
              disabled={isCard1Loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 rounded-lg border border-amber-500/30 transition-all cursor-pointer group-hover:border-amber-400/60"
            >
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: What's Working on Social */}
        <div className="flex flex-col justify-between bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/20 hover:shadow-pink-500/5 transition-all group">
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#000000] border border-slate-700 flex items-center justify-center p-1.5" title="TikTok, Reels & Shorts">
                  <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.82 4.48c1.37-1.37 1.84-3.23 1.84-5.07V8.5a8.21 8.21 0 0 0 4.83 1.57V6.69z" />
                  </svg>
                </div>
                <div className="w-7 h-7 rounded-md bg-[#FF0000]/15 flex items-center justify-center p-1.5" title="YouTube Shorts">
                  <Video className="w-4 h-4 text-red-500" />
                </div>
              </div>

              <span className="text-[11px] font-medium text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                Run weekly before filming
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              What's Working on Social
            </h2>
            <div className="w-10 h-0.5 bg-pink-500 mt-2 mb-3.5 rounded-full" />

            <p className="text-sm text-slate-300 leading-relaxed">
              The most-watched TikTok, YouTube Shorts and Instagram Reels on this topic this week — the hooks and topics earning the views.
            </p>

            {sampleHook && !isCard2Loading && (
              <div className="mt-3.5 p-3 rounded-lg bg-pink-950/20 border border-pink-500/20 text-xs italic text-pink-200/90 leading-relaxed">
                {sampleHook}
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {isCard2Loading ? (
              <div className="flex items-center gap-2 text-xs text-pink-400 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Reading viral hooks…</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400 font-mono tabular-nums">
                {videosCount} videos · {totalViews}
              </span>
            )}

            <button
              onClick={() => onOpenCard('social')}
              disabled={isCard2Loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 disabled:opacity-40 rounded-lg border border-pink-500/30 transition-all cursor-pointer group-hover:border-pink-400/60"
            >
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: Rising in Your State / Rising Across the US */}
        <div className="flex flex-col justify-between bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/20 hover:shadow-emerald-500/5 transition-all group">
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center p-1.5" title="Google Search Trends">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Run at start of week
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {card3Title}
            </h2>
            <div className="w-10 h-0.5 bg-emerald-400 mt-2 mb-3.5 rounded-full" />

            <p className="text-sm text-slate-300 leading-relaxed min-h-[44px]">
              {card3Description}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {isCard3Loading ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Reading search velocity…</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400 font-mono truncate max-w-[210px]" title={`Top breakout: ${breakoutQuery}`}>
                Top breakout: <span className="text-emerald-300">{breakoutQuery}</span>
              </span>
            )}

            <button
              onClick={() => onOpenCard('state-pulse')}
              disabled={isCard3Loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 rounded-lg border border-emerald-500/30 transition-all cursor-pointer group-hover:border-emerald-400/60"
            >
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
