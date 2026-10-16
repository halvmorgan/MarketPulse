import React, { useState, useEffect, useRef } from 'react';
import { MarketPulseResult, ActiveView, ENTIRE_US_LOCATION, STATE_TO_CODE } from './types';
import { SAMPLE_PULSES, getFallbackPulse } from './data/samplePulses';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { ThreeCardsGrid } from './components/ThreeCardsGrid';
import { HowTheyFitTogether } from './components/HowTheyFitTogether';
import { DetailPeopleAsk } from './components/DetailPeopleAsk';
import { DetailSocial } from './components/DetailSocial';
import { DetailStatePulse } from './components/DetailStatePulse';
import { GroundingSourcesDrawer } from './components/GroundingSourcesDrawer';
import { ProgressPanel, SectionProgressState } from './components/ProgressPanel';
import { SectionKey, getSectionEstimate, saveSectionDuration, formatExactDuration } from './utils/timeEstimate';
import { AlertCircle } from 'lucide-react';

const STORAGE_PREFIX = 'market_pulse_cache_';
const SECTION_PREFIX = 'market_pulse_sec_';
const LAST_LOCATION_KEY = 'market_pulse_last_location';

export default function App() {
  const [topic, setTopic] = useState<string>('Life Insurance');
  const [location, setLocation] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LAST_LOCATION_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'Michigan';
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [pulseData, setPulseData] = useState<MarketPulseResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSourcesDrawerOpen, setIsSourcesDrawerOpen] = useState<boolean>(false);

  // Run-time progress state
  const [showProgressPanel, setShowProgressPanel] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [allDoneSummary, setAllDoneSummary] = useState<string | null>(null);

  const [sections, setSections] = useState<Record<SectionKey, SectionProgressState>>({
    people_ask: {
      status: 'idle',
      initialEstimate: 45,
      currentEstimate: 45,
      remainingSec: 45,
    },
    social: {
      status: 'idle',
      initialEstimate: 60,
      currentEstimate: 60,
      remainingSec: 60,
    },
    rising: {
      status: 'idle',
      initialEstimate: 40,
      currentEstimate: 40,
      remainingSec: 40,
    },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const getLocationCode = (loc: string) => {
    if (loc === ENTIRE_US_LOCATION || loc.toLowerCase() === 'us' || loc.toLowerCase() === 'entire united states') {
      return 'us';
    }
    return (STATE_TO_CODE[loc] || loc.replace(/\s+/g, '_')).toLowerCase();
  };

  const getStorageKey = (t: string, loc: string) => {
    const locCode = getLocationCode(loc);
    return `${STORAGE_PREFIX}${t.trim().toLowerCase()}_${locCode}`;
  };

  const getSectionStorageKey = (t: string, loc: string, sec: SectionKey) => {
    const locCode = getLocationCode(loc);
    return `${SECTION_PREFIX}${t.trim().toLowerCase()}_${locCode}_${sec}`;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const formatCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' EDT';
  };

  // Execute a single section read with timing and retry tracking
  const runSectionFetch = async (
    targetTopic: string,
    targetLocation: string,
    secKey: SectionKey,
    isNationalTarget: boolean
  ) => {
    const sectionStart = performance.now();

    try {
      const response = await fetch('/api/market-pulse/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          location: targetLocation,
          section: secKey === 'rising' ? (isNationalTarget ? 'rising' : 'state_pulse') : secKey,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || `Server responded with ${response.status}`);
      }

      const durationSec = Math.max(1, Math.round((performance.now() - sectionStart) / 1000));
      saveSectionDuration(secKey, durationSec);

      // Check if server indicated a parse retry happened
      if (json.did_retry) {
        setSections((prev) => ({
          ...prev,
          [secKey]: {
            ...prev[secKey],
            status: 'retrying',
            currentEstimate: Math.round(prev[secKey].currentEstimate * 1.5),
          },
        }));
      }

      // Update section status to done
      setSections((prev) => ({
        ...prev,
        [secKey]: {
          ...prev[secKey],
          status: 'done',
          durationSec,
        },
      }));

      // Cache this individual section
      try {
        const secCacheKey = getSectionStorageKey(targetTopic, targetLocation, secKey);
        localStorage.setItem(secCacheKey, JSON.stringify({
          data: json.data || json.state_pulse || json.national_pulse,
          grounding_sources: json.grounding_sources || [],
          search_queries_used: json.search_queries_used || [],
          durationSec,
          formatted_time: json.formatted_time || formatCurrentTimestamp(),
        }));
      } catch {
        // ignore
      }

      // Fill in pulseData incrementally right away!
      setPulseData((prev) => {
        const base: MarketPulseResult = prev || {
          topic: targetTopic,
          location: targetLocation,
          is_national: isNationalTarget,
          generated_at: new Date().toISOString(),
          formatted_time: json.formatted_time || formatCurrentTimestamp(),
          people_ask: undefined as any,
          social: undefined as any,
          state_pulse: undefined,
          national_pulse: undefined,
          grounding_sources: [],
          search_queries_used: [],
        };

        const updated: MarketPulseResult = { ...base };
        if (secKey === 'people_ask') {
          updated.people_ask = json.data;
        } else if (secKey === 'social') {
          updated.social = json.data;
        } else if (secKey === 'rising') {
          if (isNationalTarget) {
            updated.national_pulse = json.national_pulse || json.data;
            updated.state_pulse = undefined;
          } else {
            updated.state_pulse = json.state_pulse || json.data;
            updated.national_pulse = undefined;
          }
        }

        if (json.grounding_sources && Array.isArray(json.grounding_sources)) {
          const currentUrls = new Set(updated.grounding_sources.map((s) => s.uri));
          const newSources = json.grounding_sources.filter((s: any) => !currentUrls.has(s.uri));
          updated.grounding_sources = [...updated.grounding_sources, ...newSources];
        }

        if (json.search_queries_used && Array.isArray(json.search_queries_used)) {
          const currentQ = new Set(updated.search_queries_used);
          const newQ = json.search_queries_used.filter((q: string) => !currentQ.has(q));
          updated.search_queries_used = [...updated.search_queries_used, ...newQ];
        }

        return updated;
      });

      return { success: true, durationSec };
    } catch (err: any) {
      console.error(`Error in section ${secKey}:`, err);

      // Mark error on that specific section
      setSections((prev) => ({
        ...prev,
        [secKey]: {
          ...prev[secKey],
          status: 'error',
          errorMessage: err.message || "Couldn't finish",
        },
      }));

      return { success: false, error: err };
    }
  };

  // Main readMarket controller with time estimates and caching
  const readMarket = async (searchTopic: string, searchLocation: string, forceRefresh = false) => {
    const cleanTopic = searchTopic.trim();
    const cleanLocation = searchLocation.trim();
    if (!cleanTopic) return;

    setTopic(cleanTopic);
    setLocation(cleanLocation);
    setErrorMessage(null);
    setAllDoneSummary(null);

    // Persist user's choice
    try {
      localStorage.setItem(LAST_LOCATION_KEY, cleanLocation);
    } catch {
      // ignore
    }

    const isNationalTarget = cleanLocation === ENTIRE_US_LOCATION || cleanLocation.toLowerCase() === 'us';

    // 1. Initial estimates for sections based on history + 10%
    const estPeople = getSectionEstimate('people_ask');
    const estSocial = getSectionEstimate('social');
    const estRising = getSectionEstimate('rising');

    // 2. Check cache for each section if not forcing refresh
    const cacheKeyFull = getStorageKey(cleanTopic, cleanLocation);
    let fullCached: MarketPulseResult | null = null;

    if (!forceRefresh) {
      try {
        const raw = localStorage.getItem(cacheKeyFull);
        if (raw) {
          fullCached = JSON.parse(raw);
        }
      } catch {
        // ignore
      }

      if (!fullCached) {
        const sampleKey = `${cleanTopic.toLowerCase()}:${cleanLocation.toLowerCase()}`;
        if (SAMPLE_PULSES[sampleKey]) {
          fullCached = SAMPLE_PULSES[sampleKey];
        }
      }
    }

    // Prepare initial section states
    const newSectionStates: Record<SectionKey, SectionProgressState> = {
      people_ask: {
        status: !forceRefresh && fullCached?.people_ask ? 'cached' : 'working',
        initialEstimate: estPeople,
        currentEstimate: estPeople,
        remainingSec: estPeople,
      },
      social: {
        status: !forceRefresh && fullCached?.social ? 'cached' : 'working',
        initialEstimate: estSocial,
        currentEstimate: estSocial,
        remainingSec: estSocial,
      },
      rising: {
        status: !forceRefresh && (fullCached?.state_pulse || fullCached?.national_pulse) ? 'cached' : 'working',
        initialEstimate: estRising,
        currentEstimate: estRising,
        remainingSec: estRising,
      },
    };

    setSections(newSectionStates);
    setShowProgressPanel(true);
    setElapsedSec(0);
    stopTimer();

    // If all are already cached
    const allAreCached = !forceRefresh && (
      newSectionStates.people_ask.status === 'cached' &&
      newSectionStates.social.status === 'cached' &&
      newSectionStates.rising.status === 'cached'
    );

    if (allAreCached && fullCached) {
      setPulseData(fullCached);
      // Briefly show instant cached status in progress panel, then collapse to one-line summary
      const finishTime = fullCached.formatted_time || formatCurrentTimestamp();
      setTimeout(() => {
        setAllDoneSummary(`✓ Complete · ${finishTime}`);
      }, 1200);
      return;
    }

    // Set pulseData base if some are cached
    if (fullCached) {
      setPulseData(fullCached);
    } else {
      // Start with placeholder or retain existing topic info
      setPulseData((prev) => ({
        topic: cleanTopic,
        location: cleanLocation,
        is_national: isNationalTarget,
        generated_at: new Date().toISOString(),
        formatted_time: formatCurrentTimestamp(),
        people_ask: prev?.people_ask as any,
        social: prev?.social as any,
        state_pulse: isNationalTarget ? undefined : prev?.state_pulse,
        national_pulse: isNationalTarget ? prev?.national_pulse : undefined,
        grounding_sources: prev?.grounding_sources || [],
        search_queries_used: prev?.search_queries_used || [],
      }));
    }

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    // Start 5-second interval timer
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setElapsedSec(elapsed);
    }, 5000);

    // Launch parallel fetches for uncached sections
    const tasks: Promise<any>[] = [];
    const keysToFetch: SectionKey[] = [];

    (Object.keys(newSectionStates) as SectionKey[]).forEach((key) => {
      if (newSectionStates[key].status === 'working') {
        keysToFetch.push(key);
        tasks.push(runSectionFetch(cleanTopic, cleanLocation, key, isNationalTarget));
      }
    });

    const results = await Promise.all(tasks);

    setIsLoading(false);
    setIsRefreshing(false);
    stopTimer();

    // Calculate completion summary
    const totalElapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const anyFailed = results.some((r) => !r.success);

    if (!anyFailed) {
      const summaryTime = formatExactDuration(totalElapsed);
      const summaryDate = formatCurrentTimestamp();
      setAllDoneSummary(`✓ Complete in ${summaryTime} · ${summaryDate}`);

      // Save complete pulse to cache
      setPulseData((latest) => {
        if (latest) {
          try {
            localStorage.setItem(cacheKeyFull, JSON.stringify(latest));
          } catch {
            // ignore
          }
        }
        return latest;
      });
    }
  };

  // Re-run only a single failed section without touching the other two
  const handleRetrySection = async (secKey: SectionKey) => {
    const isNationalTarget = location === ENTIRE_US_LOCATION || location.toLowerCase() === 'us';
    const est = getSectionEstimate(secKey);

    setSections((prev) => ({
      ...prev,
      [secKey]: {
        status: 'working',
        initialEstimate: est,
        currentEstimate: est,
        remainingSec: est,
        errorMessage: undefined,
      },
    }));

    // Restart timer if needed
    if (!timerRef.current) {
      startTimeRef.current = Date.now() - elapsedSec * 1000;
      timerRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setElapsedSec(elapsed);
      }, 5000);
    }

    const res = await runSectionFetch(topic, location, secKey, isNationalTarget);

    // Check if now all 3 are completed
    setSections((currentSections) => {
      const allDone = (Object.keys(currentSections) as SectionKey[]).every(
        (k) => currentSections[k].status === 'done' || currentSections[k].status === 'cached'
      );
      if (allDone) {
        stopTimer();
        const totalElapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        setAllDoneSummary(`✓ Complete in ${formatExactDuration(totalElapsed)} · ${formatCurrentTimestamp()}`);
      }
      return currentSections;
    });
  };

  // Initial load
  useEffect(() => {
    readMarket('Life Insurance', location, false);
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleRefresh = () => {
    readMarket(topic, location, true);
  };

  const isNational = location === ENTIRE_US_LOCATION || Boolean(pulseData?.is_national);

  const loadingSectionsMap = {
    people_ask: sections.people_ask.status === 'working' || sections.people_ask.status === 'retrying',
    social: sections.social.status === 'working' || sections.social.status === 'retrying',
    rising: sections.rising.status === 'working' || sections.rising.status === 'retrying',
  };

  return (
    <div className="min-h-screen bg-[#070b18] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Header */}
      <Header
        activeView={activeView}
        onNavigate={setActiveView}
        topic={topic}
        location={location}
        isNational={isNational}
        formattedTime={pulseData?.formatted_time}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenSources={() => setIsSourcesDrawerOpen(true)}
        sourcesCount={pulseData?.grounding_sources?.length || 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="max-w-5xl mx-auto px-4 mt-4">
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-md">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-amber-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View Routing */}
        {activeView === 'home' && (
          <>
            <HeroSearch
              currentTopic={topic}
              currentLocation={location}
              onSearch={(newTopic, newLocation) => readMarket(newTopic, newLocation, false)}
              isLoading={isLoading || isRefreshing}
            />

            {/* Run-Time Progress Panel */}
            {showProgressPanel && (
              <ProgressPanel
                topic={topic}
                location={location}
                isNational={isNational}
                elapsedSec={elapsedSec}
                sections={sections}
                onRetrySection={handleRetrySection}
                allDoneSummary={allDoneSummary}
              />
            )}

            {/* Three Cards Grid with Incremental Live Filling */}
            {pulseData && (
              <>
                <ThreeCardsGrid
                  data={pulseData}
                  onOpenCard={(view) => setActiveView(view)}
                  loadingSections={loadingSectionsMap}
                />

                <HowTheyFitTogether
                  onSelectStep={(view) => setActiveView(view)}
                  location={location}
                  isNational={isNational}
                />
              </>
            )}
          </>
        )}

        {activeView === 'people-ask' && pulseData && (
          <DetailPeopleAsk
            data={pulseData.people_ask}
            topic={pulseData.topic}
            location={pulseData.location}
            formattedTime={pulseData.formatted_time}
            onBack={() => setActiveView('home')}
            groundingSources={pulseData.grounding_sources}
          />
        )}

        {activeView === 'social' && pulseData && (
          <DetailSocial
            data={pulseData.social}
            topic={pulseData.topic}
            location={pulseData.location}
            formattedTime={pulseData.formatted_time}
            onBack={() => setActiveView('home')}
            groundingSources={pulseData.grounding_sources}
          />
        )}

        {activeView === 'state-pulse' && pulseData && (
          <DetailStatePulse
            stateData={pulseData.state_pulse}
            nationalData={pulseData.national_pulse}
            isNational={pulseData.is_national}
            topic={pulseData.topic}
            location={pulseData.location}
            formattedTime={pulseData.formatted_time}
            onBack={() => setActiveView('home')}
            groundingSources={pulseData.grounding_sources}
          />
        )}
      </main>

      {/* Verified Google Search Grounding Audit Modal */}
      <GroundingSourcesDrawer
        isOpen={isSourcesDrawerOpen}
        onClose={() => setIsSourcesDrawerOpen(false)}
        sources={pulseData?.grounding_sources || []}
        queries={pulseData?.search_queries_used || []}
        topic={topic}
        state={location}
        formattedTime={pulseData?.formatted_time}
      />
    </div>
  );
}
