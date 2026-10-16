import React, { useState } from 'react';
import { WhatsWorkingSocialData, GroundingSource } from '../types';
import { ArrowLeft, ExternalLink, Video, Sparkles, Copy, Check, Clapperboard, Lightbulb } from 'lucide-react';

interface DetailSocialProps {
  data: WhatsWorkingSocialData;
  topic: string;
  location: string;
  formattedTime?: string;
  onBack: () => void;
  groundingSources: GroundingSource[];
}

export const DetailSocial: React.FC<DetailSocialProps> = ({
  data,
  topic,
  location,
  formattedTime,
  onBack,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyScript = () => {
    const fullScript = `HOOK:\n${data.sample_script_framework?.hook || ''}\n\nBODY:\n${data.sample_script_framework?.body || ''}\n\nCALL TO ACTION:\n${data.sample_script_framework?.call_to_action || ''}`;
    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

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
            What's Working on Social: <span className="text-pink-400">{topic}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Read for: <strong className="text-slate-200">{location}</strong>
            {formattedTime && <span> · <span className="font-mono text-slate-300">{formattedTime}</span></span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium">
            <Video className="w-3.5 h-3.5" />
            <span>Run weekly before filming</span>
          </div>
        </div>
      </div>

      {/* 1. Big Bold Summary Paragraph */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-pink-950/20 border border-pink-500/30 shadow-lg">
        <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 block mb-2">
          Weekly Social Intelligence
        </span>
        <p className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed text-balance">
          {data.summary}
        </p>

        {/* Aggregate Stat Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400 font-mono">
          <div>
            <span>Analyzed: </span>
            <strong className="text-slate-200">{data.total_videos_found} videos</strong>
          </div>
          <div>
            <span>Aggregate Reach: </span>
            <strong className="text-pink-300">{data.total_estimated_views}</strong>
          </div>
        </div>
      </div>

      {/* 2. Top Viral Hooks Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Top Performing Hooks Earning Views</span>
          </h3>
          <span className="text-xs text-slate-400">
            Field-tested opening 3 seconds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.top_hooks?.map((hookItem, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                    {hookItem.platform}
                  </span>
                  <span className="text-[11px] font-mono text-pink-400 font-medium">
                    {hookItem.format}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-100 italic leading-snug">
                  "{hookItem.hook}"
                </p>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400">Why it works:</strong> {hookItem.why_it_works}
                </p>
              </div>

              {hookItem.source_url && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                  <a
                    href={hookItem.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sample Script Framework (Hook + Body + CTA) */}
      {data.sample_script_framework && (
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-pink-400" />
              <h3 className="text-base font-bold text-white">
                Turnkey Script Framework (Film Your Own Take)
              </h3>
            </div>

            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-all cursor-pointer"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Script</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1.5 font-mono">
                01. The Hook (0:00 - 0:04)
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                "{data.sample_script_framework.hook}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1.5 font-mono">
                02. The Body (0:05 - 0:45)
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.sample_script_framework.body}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 font-mono">
                03. Call To Action (0:46 - 0:60)
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {data.sample_script_framework.call_to_action}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Video Examples & Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-pink-400" />
            <span>Most-Watched Video Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400">
            Verified posts linked directly from search grounding
          </span>
        </div>

        <div className="space-y-3">
          {data.videos?.map((vid, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                    {vid.platform}
                  </span>
                  <span className="text-xs text-slate-400">@{vid.creator}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-pink-400 font-semibold">{vid.estimated_views}</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {vid.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400">Hook Used:</strong> "{vid.hook_used}"
                </p>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-500">Angle:</strong> {vid.topic_angle}
                </p>
              </div>

              {vid.url && (
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-pink-600/80 hover:bg-pink-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Watch Post</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Content Angles to Replicate */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Content Angles to Replicate
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          {data.content_angles_to_replicate?.map((angle, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
              <span>{angle}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
