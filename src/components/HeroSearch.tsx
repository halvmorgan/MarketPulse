import React, { useState, useEffect } from 'react';
import { US_STATES, SUGGESTED_TOPICS } from '../data/samplePulses';
import { ENTIRE_US_LOCATION } from '../types';
import { Search, MapPin, Sparkles, Loader2, Clock } from 'lucide-react';
import { getGeneralHint } from '../utils/timeEstimate';

interface HeroSearchProps {
  currentTopic: string;
  currentLocation: string;
  onSearch: (topic: string, location: string) => void;
  isLoading: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentTopic,
  currentLocation,
  onSearch,
  isLoading,
}) => {
  const [topicInput, setTopicInput] = useState(currentTopic);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  useEffect(() => {
    setSelectedLocation(currentLocation);
  }, [currentLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onSearch(topicInput.trim(), selectedLocation);
  };

  const handleChipClick = (suggested: string) => {
    setTopicInput(suggested);
    onSearch(suggested, selectedLocation);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLoc = e.target.value;
    setSelectedLocation(newLoc);
    if (topicInput.trim()) {
      onSearch(topicInput.trim(), newLoc);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#070b19] via-[#0b142d] to-[#0a1024] pt-12 pb-14 border-b border-slate-800/80">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-20 right-10 w-[400px] h-[250px] bg-sky-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 1. Hero Headline & Subtitle */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] text-balance">
          What the public is asking, searching and watching — read for you.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
          Three live reads of the market. Open one before a call, before you post, or when you plan your week.
        </p>

        {/* 2. Input Row */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-4xl mx-auto bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-700/80 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            {/* Topic input */}
            <div className="relative flex-1 flex items-center min-w-0">
              <Search className="absolute left-3.5 w-5 h-5 text-slate-400 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter any topic (e.g., life insurance, roof replacement, divorce appraisal)"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none rounded-xl"
                disabled={isLoading}
              />
            </div>

            {/* Location selector */}
            <div className="relative flex items-center md:w-64 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-2">
              <label htmlFor="location-select" className="sr-only">Location</label>
              <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
              <select
                id="location-select"
                aria-label="Location"
                title="Location"
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full pl-9 pr-8 py-3 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-sm font-medium rounded-xl border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none truncate"
                disabled={isLoading}
              >
                <option value={ENTIRE_US_LOCATION} className="bg-slate-900 text-white font-semibold">
                  Entire United States
                </option>
                <option disabled className="bg-slate-800 text-slate-500">
                  ──────────────
                </option>
                {US_STATES.map((stateName) => (
                  <option key={stateName} value={stateName} className="bg-slate-900 text-white">
                    {stateName}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 text-slate-400 pointer-events-none text-xs">▼</span>
            </div>

            {/* Read the Market Button */}
            <button
              type="submit"
              disabled={isLoading || !topicInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reading Market...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Read the Market</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Run-time estimate hint before user clicks */}
        <div className="mt-2 text-xs text-slate-400/90 flex items-center justify-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{getGeneralHint()}</span>
        </div>

        {/* Quick topic test drive chips */}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Popular topics:</span>
          {SUGGESTED_TOPICS.map((suggested) => (
            <button
              key={suggested}
              type="button"
              onClick={() => handleChipClick(suggested)}
              className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
