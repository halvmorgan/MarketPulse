/**
 * Time estimation utilities for Market Pulse
 */

export type SectionKey = 'people_ask' | 'social' | 'rising';

const STORAGE_KEYS: Record<SectionKey, string> = {
  people_ask: 'market_pulse_history_people_ask',
  social: 'market_pulse_history_social',
  rising: 'market_pulse_history_rising',
};

const DEFAULT_ESTIMATES: Record<SectionKey, number> = {
  people_ask: 45,
  social: 60,
  rising: 40,
};

/**
 * Gets the historical runs for a section from localStorage
 */
export function getSectionHistory(section: SectionKey): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[section]);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((n) => typeof n === 'number' && n > 0);
      }
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Saves a measured run time (in seconds) to localStorage, keeping the last 10 runs
 */
export function saveSectionDuration(section: SectionKey, durationSec: number) {
  if (durationSec <= 0) return;
  try {
    const history = getSectionHistory(section);
    history.push(Math.round(durationSec));
    // Keep last 10 runs
    const trimmed = history.slice(-10);
    localStorage.setItem(STORAGE_KEYS[section], JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

/**
 * Calculates estimated run time for a section:
 * Average of saved runs + 10% padding, or fallback to defaults
 */
export function getSectionEstimate(section: SectionKey): number {
  const history = getSectionHistory(section);
  if (history.length === 0) {
    return DEFAULT_ESTIMATES[section];
  }
  const sum = history.reduce((acc, curr) => acc + curr, 0);
  const avg = sum / history.length;
  return Math.round(avg * 1.1);
}

/**
 * Formats seconds into friendly rounded text:
 * Under 1 minute: "about X sec" (rounded to nearest 5)
 * 1 minute or more: "about X min" or "about X min Y sec" (seconds rounded to nearest 5)
 */
export function formatFriendlyTime(seconds: number): string {
  if (seconds <= 0) {
    return 'about 5 sec';
  }
  // Round to nearest 5
  const rounded = Math.max(5, Math.round(seconds / 5) * 5);

  if (rounded < 60) {
    return `about ${rounded} sec`;
  }

  const mins = Math.floor(rounded / 60);
  const remSec = rounded % 60;
  if (remSec === 0) {
    return `about ${mins} min`;
  }
  return `about ${mins} min ${remSec} sec`;
}

/**
 * Formats exact duration for completion summary: e.g. "38 sec" or "1 min 12 sec"
 */
export function formatExactDuration(seconds: number): string {
  const sec = Math.max(1, Math.round(seconds));
  if (sec < 60) {
    return `${sec} sec`;
  }
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (remSec === 0) {
    return `${mins} min`;
  }
  return `${mins} min ${remSec} sec`;
}

/**
 * Formats elapsed time in "M:SS" (e.g. "0:45")
 */
export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Computes the general hint shown before running:
 * e.g. "Usually takes about 1 minute"
 */
export function getGeneralHint(): string {
  const est1 = getSectionEstimate('people_ask');
  const est2 = getSectionEstimate('social');
  const est3 = getSectionEstimate('rising');
  const maxEst = Math.max(est1, est2, est3);
  const friendly = formatFriendlyTime(maxEst);
  if (friendly === 'about 1 min') {
    return 'Usually takes about 1 minute';
  }
  return `Usually takes ${friendly}`;
}
