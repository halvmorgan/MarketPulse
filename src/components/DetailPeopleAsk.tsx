import React, { useState } from 'react';
import { WhatPeopleAskData, GroundingSource } from '../types';
import { ArrowLeft, ExternalLink, Copy, Check, MessageSquare, PhoneCall, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

interface DetailPeopleAskProps {
  data: WhatPeopleAskData;
  topic: string;
  location: string;
  formattedTime?: string;
  onBack: () => void;
  groundingSources: GroundingSource[];
}

export const DetailPeopleAsk: React.FC<DetailPeopleAskProps> = ({
  data,
  topic,
  location,
  formattedTime,
  onBack,
  groundingSources,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyOpener = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What People Ask: <span className="text-amber-400">{topic}</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Read for: <strong className="text-slate-200">{location}</strong>
            {formattedTime && <span> · <span className="font-mono text-slate-300">{formattedTime}</span></span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Run before sales calls</span>
          </div>
        </div>
      </div>

      {/* 1. Big Bold Summary Paragraph */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20 border border-amber-500/30 shadow-lg">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-2">
          Executive Market Read
        </span>
        <p className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed text-balance">
          {data.summary}
        </p>
      </div>

      {/* 2. Public Brief & AI Overview Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Public Brief */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Public Brief (In Their Own Words)
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {data.public_brief}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            Synthesized from consumer inquiries & unprompted forum posts
          </div>
        </div>

        {/* AI Overview prospects see */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Google AI Overview Summary
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {data.ai_overview_summary}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            What prospects encounter first when searching Google for this topic
          </div>
        </div>
      </div>

      {/* 3. Call Openers: High-converting conversation starters */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Call Openers You Can Use Today
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Tested phrasing to open consultative sales calls
          </span>
        </div>

        <div className="space-y-3">
          {data.call_openers?.map((opener, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-amber-400 mt-0.5">
                  0{idx + 1}
                </span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  "{opener}"
                </p>
              </div>

              <button
                onClick={() => handleCopyOpener(opener, idx)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Copy opener to clipboard"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Real Google Questions with Verified Grounding Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Real Google Questions Prospects Search</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every item is verified against live Google Search grounding chunks
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data.questions?.length || 0} questions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.questions?.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {item.question}
                </h4>
                <div className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-400/90 font-semibold">Why it matters:</strong>{' '}
                  {item.why_it_matters}
                </div>
              </div>

              {item.source_url && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[200px]" title={item.source_title || item.source_url}>
                    {item.source_title || 'Verified Grounding Source'}
                  </span>
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
                  >
                    <span>View Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Reddit Threads with Verified Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FF4500]" />
              <span>Reddit Threads & Unfiltered Sentiment</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live discussion threads showing what people worry about behind closed doors
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data.reddit_threads?.length || 0} threads
          </span>
        </div>

        <div className="space-y-3">
          {data.reddit_threads?.map((thread, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FF4500]/15 text-[#FF6333] border border-[#FF4500]/25">
                    {thread.subreddit}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Verified Thread</span>
                </div>
                <h4 className="text-sm font-bold text-white hover:text-slate-200">
                  {thread.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400">Gist:</strong> {thread.gist}
                </p>
              </div>

              {thread.url && (
                <a
                  href={thread.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#FF4500]/80 hover:bg-[#FF4500] rounded-lg transition-colors"
                >
                  <span>Open Thread</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
