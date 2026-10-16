import React from 'react';
import { RisingInStateData, RisingNationalData, GroundingSource, STATE_TO_CODE } from '../types';
import { ArrowLeft, ExternalLink, TrendingUp, MapPin, Calendar, Flame, Sparkles, Compass } from 'lucide-react';

interface DetailStatePulseProps {
  stateData?: RisingInStateData;
  nationalData?: RisingNationalData;
  isNational: boolean;
  topic: string;
  location: string;
  formattedTime?: string;
  onBack: () => void;
  groundingSources: GroundingSource[];
}

export const DetailStatePulse: React.FC<DetailStatePulseProps> = ({
  stateData,
  nationalData,
  isNational,
  topic,
  location,
  formattedTime,
  onBack,
}) => {
  const pageTitle = isNational ? 'Rising Across the US' : `Rising in ${location}`;
  const scheduleLabel = 'Run at start of week';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to All Reads</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {pageTitle}: <span className="text-emerald-400">{topic}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Read for: <strong className="text-slate-200">{location}</strong>
            {formattedTime && <span> · <span className="font-mono text-slate-300">{formattedTime}</span></span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{scheduleLabel}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NATIONWIDE MODE */}
      {/* ========================================================================= */}
      {isNational && nationalData && (
        <>
          {/* 1. Bold National Summary */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/20 border border-emerald-500/30 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2 font-mono">
              National Search Movement Brief
            </span>
            <p className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed text-balance">
              {nationalData.national_summary}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Coverage: United States (All 50 States + DC)</span>
              <span className="text-emerald-300 font-semibold">Google Trends 90-Day Trajectory</span>
            </div>
          </div>

          {/* 2. Core Searches: Same row structure, but with "Searched most in: [top 3 states]" */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Core Searches: 3-Month Trajectory</span>
              </h3>
              <span className="text-xs text-slate-400">
                National Google Trends index
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                  <tr>
                    <th className="px-5 py-3.5">Search Query</th>
                    <th className="px-5 py-3.5">3-Month Movement</th>
                    <th className="px-5 py-3.5">Change Note</th>
                    <th className="px-5 py-3.5">Top State Hotspots</th>
                    <th className="px-5 py-3.5 text-right">Trends Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {nationalData.core_searches?.map((item, idx) => {
                    const trendsUrl = item.verified_source_url || `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(item.query)}&date=today%203-m`;
                    const trendLower = item.three_month_trend.toLowerCase();
                    const isRising = trendLower.includes('rising') || trendLower.includes('+');
                    const isFalling = trendLower.includes('falling') || trendLower.includes('-');

                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white">
                          {item.query}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                            isRising
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isFalling
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.three_month_trend}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-slate-300">
                          {item.change_note}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-300">
                          <span className="font-semibold text-emerald-300/90">{item.top_states_note}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={trendsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                          >
                            <span>Trends (geo=US)</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. New section "Where It's Searched Most": top 5-10 states as ranked pill chips with one-line note */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Where It's Searched Most (Top Demand States)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Ranked by relative per-capita search index
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {nationalData.top_states?.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  {/* Ranked pill chip: 1. State, 2. State */}
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {idx + 1}. {st.state}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                    {st.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Breaking Out Nationwide: chips for rising queries with source links */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Breaking Out Nationwide
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {nationalData.breakout_queries?.map((bq, idx) => {
                const linkUrl = bq.source_url || `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(bq.query)}&date=today%203-m`;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-sm text-white leading-snug">
                          {bq.query}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0">
                          {bq.note}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-end">
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        <span>Explore Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Lead With This: 3 content or outreach ideas based on national trend */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Lead With This: 3 Content & Outreach Ideas
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nationalData.content_ideas?.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                >
                  <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">
                    Strategy 0{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {idea}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* STATE MODE (Keep exactly as it works now) */}
      {/* ========================================================================= */}
      {!isNational && stateData && (
        <>
          {/* 1. Big Bold Summary Paragraph */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/20 border border-emerald-500/30 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2 font-mono">
              State Search Movement Brief
            </span>
            <p className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed text-balance">
              {stateData.summary}
            </p>

            {/* State Ranking & Top Breakout Stat Line */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">National Demand Rank:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  #{stateData.state_rank} in US (Top Tier)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Top Breakout Search:</span>
                <strong className="text-white truncate font-semibold">{stateData.top_breakout_query}</strong>
              </div>
            </div>
          </div>

          {/* 2. Core Searches & 3-Month Trajectory Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Core Search Interest & 3-Month Velocity</span>
              </h3>
              <span className="text-xs text-slate-400">
                Google Trends relative index
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                  <tr>
                    <th className="px-5 py-3.5">Search Query</th>
                    <th className="px-5 py-3.5">3-Month Shift</th>
                    <th className="px-5 py-3.5">Momentum</th>
                    <th className="px-5 py-3.5 text-right">Volume Index</th>
                    <th className="px-5 py-3.5 text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {stateData.core_searches?.map((item, idx) => {
                    const stateCode = STATE_TO_CODE[location] || 'US';
                    const linkUrl = item.verified_source_url || `https://trends.google.com/trends/explore?geo=US-${stateCode}&q=${encodeURIComponent(item.query)}&date=today%203-m`;

                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white">
                          {item.query}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-emerald-400 tabular-nums">
                          {item.three_month_trend}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            item.momentum_label === 'Breakout'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.momentum_label === 'High Growth'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.momentum_label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-medium text-slate-300 tabular-nums">
                          <div className="flex items-center justify-end gap-2">
                            <span>{item.search_volume_index}/100</span>
                            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-emerald-400 rounded-full"
                                style={{ width: `${item.search_volume_index}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            <span>Trends ({stateCode})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Regional Hotspots in State & Breakout Queries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regional Hotspots */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Regional Hotspots in {location}
                </h3>
              </div>

              <div className="space-y-3">
                {stateData.regional_hotspots?.map((hotspot, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-xs font-bold text-emerald-300 block mb-1">
                      {hotspot.area_or_city}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hotspot.demand_driver}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakout Queries */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Breaking Out in {location}
                </h3>
              </div>

              <div className="space-y-3">
                {stateData.breakout_queries?.map((queryItem, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white">
                        {queryItem.query}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {queryItem.growth_rate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {queryItem.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Weekly Action Plan */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                When You Plan The Week: Strategic Action Plan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stateData.weekly_action_plan?.map((plan, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">
                    Action 0{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {plan}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
