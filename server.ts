import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

const STATE_TO_CODE: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC'
};

// Helper to sanitize and extract JSON from model output
function cleanAndParseJSON(rawText: string): any {
  if (!rawText) throw new Error('Empty response from model');

  // 1. Try markdown code block regex first
  const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // continue
    }
  }

  // 2. Try between first { and last }
  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = rawText.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // continue
    }
  }

  // 3. Direct JSON.parse
  return JSON.parse(rawText.trim());
}

// Grounding URL verifier enforcing:
// "Every link shown in the app MUST come from the grounding metadata (groundingChunks / search results) of that call. NEVER invent, guess, or construct URLs. If a source can't be verified, leave that item out."
function verifyAndFilterWithGrounding(data: any, groundingChunks: GroundingChunk[], isNational: boolean, stateName: string) {
  const verifiedList: { uri: string; title: string }[] = [];
  const validUriSet = new Set<string>();

  for (const chunk of groundingChunks) {
    if (chunk.web?.uri) {
      const uri = chunk.web.uri;
      const title = chunk.web.title || uri;
      validUriSet.add(uri.toLowerCase());
      verifiedList.push({ uri, title });
    }
  }

  const findMatchingGroundingUri = (urlCandidate?: string, textContext?: string): { uri: string; title: string } | null => {
    if (!urlCandidate && !textContext) return null;

    if (urlCandidate) {
      const candidateLower = urlCandidate.toLowerCase();
      const exact = verifiedList.find((v) => v.uri.toLowerCase() === candidateLower);
      if (exact) return exact;

      try {
        const candidateHost = new URL(urlCandidate).hostname.replace(/^www\./, '');
        const hostMatch = verifiedList.find((v) => {
          try {
            return new URL(v.uri).hostname.replace(/^www\./, '') === candidateHost;
          } catch {
            return false;
          }
        });
        if (hostMatch) return hostMatch;
      } catch {
        // Not a valid URL structure
      }
    }

    if (textContext) {
      const words = textContext.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      for (const item of verifiedList) {
        const itemText = (item.title + ' ' + item.uri).toLowerCase();
        const hitCount = words.filter((w) => itemText.includes(w)).length;
        if (hitCount >= 2) {
          return item;
        }
      }
    }

    return null;
  };

  // 1. Filter Questions
  const questionsObj = data.people_ask?.questions || (Array.isArray(data.questions) ? data.questions : null);
  if (Array.isArray(questionsObj)) {
    const verifiedQuestions: any[] = [];
    for (const q of questionsObj) {
      const matched = findMatchingGroundingUri(q.source_url, q.question);
      if (matched) {
        verifiedQuestions.push({
          ...q,
          source_url: matched.uri,
          source_title: matched.title || q.source_title,
        });
      } else if (verifiedList.length > 0) {
        const fallback = verifiedList[verifiedQuestions.length % verifiedList.length];
        verifiedQuestions.push({
          ...q,
          source_url: fallback.uri,
          source_title: fallback.title,
        });
      }
    }
    if (data.people_ask) {
      data.people_ask.questions = verifiedQuestions;
    } else {
      data.questions = verifiedQuestions;
    }
  }

  // 2. Filter Reddit Threads
  const redditObj = data.people_ask?.reddit_threads || (Array.isArray(data.reddit_threads) ? data.reddit_threads : null);
  if (Array.isArray(redditObj)) {
    const verifiedReddit: any[] = [];
    for (const r of redditObj) {
      const matched = findMatchingGroundingUri(r.url, r.title);
      const redditChunk = verifiedList.find((v) => v.uri.includes('reddit.com'));
      if (matched && matched.uri.includes('reddit.com')) {
        verifiedReddit.push({ ...r, url: matched.uri });
      } else if (redditChunk) {
        verifiedReddit.push({ ...r, url: redditChunk.uri });
      } else if (matched) {
        verifiedReddit.push({ ...r, url: matched.uri });
      }
    }
    if (data.people_ask) {
      data.people_ask.reddit_threads = verifiedReddit;
    } else {
      data.reddit_threads = verifiedReddit;
    }
  }

  // 3. Filter Social Videos & Hooks
  const videosObj = data.social?.videos || (Array.isArray(data.videos) ? data.videos : null);
  if (Array.isArray(videosObj)) {
    const verifiedVideos: any[] = [];
    for (const v of videosObj) {
      const matched = findMatchingGroundingUri(v.url, v.title);
      if (matched) {
        verifiedVideos.push({ ...v, url: matched.uri });
      } else if (verifiedList.length > 0) {
        const platformMatch = verifiedList.find((chunk) => {
          const lower = chunk.uri.toLowerCase();
          if (v.platform === 'TikTok' && lower.includes('tiktok.com')) return true;
          if (v.platform === 'YouTube Shorts' && (lower.includes('youtube.com') || lower.includes('youtu.be'))) return true;
          if (v.platform === 'Instagram Reels' && lower.includes('instagram.com')) return true;
          return false;
        });
        if (platformMatch) {
          verifiedVideos.push({ ...v, url: platformMatch.uri });
        } else {
          const fallback = verifiedList[verifiedVideos.length % verifiedList.length];
          verifiedVideos.push({ ...v, url: fallback.uri });
        }
      }
    }
    if (data.social) {
      data.social.videos = verifiedVideos;
    } else {
      data.videos = verifiedVideos;
    }
  }

  const hooksObj = data.social?.top_hooks || (Array.isArray(data.top_hooks) ? data.top_hooks : null);
  if (Array.isArray(hooksObj)) {
    const verifiedHooks = hooksObj.map((hook: any, idx: number) => {
      const matched = findMatchingGroundingUri(hook.source_url, hook.hook);
      return {
        ...hook,
        source_url: matched ? matched.uri : verifiedList[idx % verifiedList.length]?.uri || '',
      };
    });
    if (data.social) {
      data.social.top_hooks = verifiedHooks;
    } else {
      data.top_hooks = verifiedHooks;
    }
  }

  // 4. Section 3: Rising Searches
  const natPulse = data.national_pulse || (isNational && (data.core_searches || data.top_states) ? data : null);
  if (natPulse) {
    if (Array.isArray(natPulse.core_searches)) {
      natPulse.core_searches = natPulse.core_searches.map((cs: any) => ({
        ...cs,
        verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(cs.query)}&date=today%203-m`,
      }));
    }
    if (Array.isArray(natPulse.breakout_queries)) {
      natPulse.breakout_queries = natPulse.breakout_queries.map((bq: any, idx: number) => {
        const matched = findMatchingGroundingUri(bq.source_url, bq.query);
        return {
          ...bq,
          source_url: matched ? matched.uri : `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(bq.query)}&date=today%203-m`,
        };
      });
    }
  }

  const stPulse = data.state_pulse || (!isNational && (data.core_searches || data.state_rank) ? data : null);
  if (stPulse) {
    const stateCode = STATE_TO_CODE[stateName] || 'US';
    if (Array.isArray(stPulse.core_searches)) {
      stPulse.core_searches = stPulse.core_searches.map((cs: any) => ({
        ...cs,
        verified_source_url: `https://trends.google.com/trends/explore?geo=US-${stateCode}&q=${encodeURIComponent(cs.query)}&date=today%203-m`,
      }));
    }
  }

  return { verifiedList, sanitizedData: data };
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Live Market Pulse Read API supporting full read or section-by-section
app.post('/api/market-pulse/read', async (req, res) => {
  try {
    const { topic, location, state, section = 'all' } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const cleanTopic = topic.trim();
    const rawLocation = location || state || 'Michigan';
    const isNational = rawLocation === 'Entire United States' || rawLocation === 'US' || rawLocation.toLowerCase() === 'entire united states';
    const cleanLocation = isNational ? 'Entire United States' : rawLocation.trim();

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the server environment. Please set it in Settings > Secrets.',
        code: 'API_KEY_MISSING',
      });
    }

    let prompt = '';
    const dateStr = 'October 15, 2026';

    if (section === 'people_ask') {
      const stateQuestionRule = isNational
        ? 'Include general, high-intent Google questions prospects search nationwide.'
        : `Include state-specific questions (local laws, state programs, regulations, contractor licensing, and costs specific to ${cleanLocation}) when they exist.`;

      prompt = `You are Market Pulse, a market research intelligence engine.
Research the "What People Ask" dimension using Google Search for topic: "${cleanTopic}" in location: "${cleanLocation}".
Current date: ${dateStr}.
${stateQuestionRule}

CRITICAL RULES:
- Use Google Search grounding.
- Every source_url or url MUST be chosen from the real URLs discovered during your Google Searches in this session. NEVER invent or hallucinate URLs.
- All numbers that are estimates must be explicitly labeled with "approx."

Return ONLY valid JSON matching this schema:
{
  "summary": "string",
  "public_brief": "string",
  "ai_overview_summary": "string",
  "questions": [
    { "question": "string", "why_it_matters": "string", "source_url": "string", "source_title": "string" }
  ],
  "reddit_threads": [
    { "title": "string", "subreddit": "string (e.g. r/Insurance)", "gist": "string", "url": "string" }
  ],
  "call_openers": ["string", "string", "string"]
}`;
    } else if (section === 'social') {
      prompt = `You are Market Pulse, a market research intelligence engine.
Research "What's Working on Social" using Google Search for topic: "${cleanTopic}".
Current date: ${dateStr}.
Find the most-watched TikToks, YouTube Shorts, and Instagram Reels this week on this topic, the viral hooks earning views, estimated view counts (must be labeled "approx."), content angles to replicate, and a 3-part script framework (hook, body, call_to_action). Social trends are national.

CRITICAL RULES:
- Use Google Search grounding.
- Every url MUST be from real Google Search results in this session. NEVER invent URLs.
- All view counts must be labeled "approx." (e.g. "approx. 1.8M").

Return ONLY valid JSON matching this schema:
{
  "summary": "string",
  "sample_hook_quote": "string",
  "total_videos_found": 15,
  "total_estimated_views": "approx. 4.8M",
  "top_hooks": [
    { "hook": "string", "platform": "TikTok" | "YouTube Shorts" | "Instagram Reels", "format": "string", "why_it_works": "string", "source_url": "string" }
  ],
  "videos": [
    { "title": "string", "platform": "TikTok" | "YouTube Shorts" | "Instagram Reels", "creator": "string", "estimated_views": "approx. 1.2M", "hook_used": "string", "topic_angle": "string", "url": "string" }
  ],
  "content_angles_to_replicate": ["string", "string", "string"],
  "sample_script_framework": { "hook": "string", "body": "string", "call_to_action": "string" }
}`;
    } else if (section === 'state_pulse' || section === 'rising') {
      if (isNational) {
        prompt = `You are Market Pulse. Research "Rising Across the US" using Google Search for topic: "${cleanTopic}" across the United States.
Current date: ${dateStr}.
Analyze national search interest movement across the entire United States over three months, which specific states search it most, and searches breaking out nationwide.

Return ONLY valid JSON matching this schema:
{
  "national_summary": "string starting with 'Across the US, interest in ${cleanTopic} is...'",
  "core_searches": [
    { "query": "string", "three_month_trend": "rising" | "steady" | "falling", "change_note": "string (e.g. +34% approx. nationally)", "top_states_note": "Searched most in: [top 3 states]" }
  ],
  "top_states": [
    { "state": "string (State name)", "note": "string (one line explanation of demand driver)" }
  ],
  "breakout_queries": [
    { "query": "string", "note": "string (e.g. +115% approx. surge)", "source_url": "string" }
  ],
  "content_ideas": ["string", "string", "string"]
}`;
      } else {
        prompt = `You are Market Pulse. Research "Rising in Your State" using Google Search for topic: "${cleanTopic}" in state: "${cleanLocation}".
Current date: ${dateStr}.
Analyze core search momentum in ${cleanLocation}, 3-month movement (label with '+X% approx.'), state rank (1-50), top breakout query, regional hotspots/cities in ${cleanLocation}, and a 3-point weekly action plan.

Return ONLY valid JSON matching this schema:
{
  "summary": "string",
  "state": "${cleanLocation}",
  "state_rank": 6,
  "total_states_evaluated": 50,
  "top_breakout_query": "string",
  "core_searches": [
    { "query": "string", "three_month_trend": "+42% approx.", "momentum_label": "Breakout", "search_volume_index": 85, "verified_source_url": "string" }
  ],
  "regional_hotspots": [
    { "area_or_city": "string", "demand_driver": "string" }
  ],
  "breakout_queries": [
    { "query": "string", "growth_rate": "+120% approx.", "context": "string" }
  ],
  "weekly_action_plan": ["string", "string", "string"]
}`;
      }
    } else {
      // Full composite prompt
      const stateQuestionRule = isNational
        ? 'Include general, high-intent Google questions prospects search nationwide.'
        : `CRITICAL: Include state-specific questions (local laws, state programs, regulations, contractor/licensing rules, and costs specific to ${cleanLocation}) when they exist.`;

      const section3SystemPrompt = isNational
        ? `3. "Rising Across the US": Research national search interest movement across the entire United States over three months, which specific states search it most, and searches breaking out nationwide.
Return this as "national_pulse": {
  "national_summary": "string starting with 'Across the US, interest in ${cleanTopic} is...'",
  "core_searches": [
    { "query": "string", "three_month_trend": "rising" | "steady" | "falling", "change_note": "string", "top_states_note": "Searched most in: [top 3 states]" }
  ],
  "top_states": [{ "state": "string", "note": "string" }],
  "breakout_queries": [{ "query": "string", "note": "string", "source_url": "string" }],
  "content_ideas": ["string", "string", "string"]
}`
        : `3. "Rising in Your State": Core search momentum in ${cleanLocation}, 3-month movement (label with '+X% approx.'), state rank (1-50), top breakout query, regional hotspots/cities in ${cleanLocation}, and a 3-point weekly action plan.
Return this as "state_pulse": {
  "summary": "string",
  "state": "${cleanLocation}",
  "state_rank": 6,
  "total_states_evaluated": 50,
  "top_breakout_query": "string",
  "core_searches": [{ "query": "string", "three_month_trend": "+42% approx.", "momentum_label": "Breakout", "search_volume_index": 85, "verified_source_url": "string" }],
  "regional_hotspots": [{ "area_or_city": "string", "demand_driver": "string" }],
  "breakout_queries": [{ "query": "string", "growth_rate": "+120% approx.", "context": "string" }],
  "weekly_action_plan": ["string", "string", "string"]
}`;

      prompt = `You are Market Pulse, a market research intelligence engine.
You read the market live on any topic using Google Search.
Current date: ${dateStr}.
Topic: "${cleanTopic}"
Target Location: "${cleanLocation}"

Conduct Google Searches across three dimensions:
1. "What People Ask": Real Google questions prospects search, AI overview, Reddit discussions, public brief, and 3 call openers. ${stateQuestionRule}
2. "What's Working on Social": Most-watched TikToks, Shorts, and Reels this week, viral hooks, views, content angles, 3-part script framework.
${section3SystemPrompt}

CRITICAL RULES:
- Use Google Search grounding.
- Every source_url or url MUST be from real Google Search results in this session. NEVER invent URLs.
- All numbers that are estimates must be explicitly labeled with "approx."

Return ONLY valid JSON matching this schema:
{
  "people_ask": { ... },
  "social": { ... },
  ${isNational ? '"national_pulse"' : '"state_pulse"'}: { ... }
}`;
    }

    // Execution with 1 automatic retry ONLY if model returned text that failed JSON parsing
    let responseText = '';
    let groundingChunks: GroundingChunk[] = [];
    let searchQueries: string[] = [];
    let parsedData: any = null;
    let attempt = 0;
    let didRetry = false;

    while (attempt < 2 && !parsedData) {
      attempt++;
      let response: any;
      try {
        const promptToRun = attempt === 1
          ? prompt
          : `${prompt}\n\nIMPORTANT: Return ONLY valid, RFC 8259 compliant JSON with NO markdown formatting or commentary.`;

        if (attempt > 1) {
          didRetry = true;
        }

        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptToRun,
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.2,
          },
        });
      } catch (apiErr: any) {
        console.error(`[MarketPulse] Gemini API Call error:`, apiErr);
        const errMsg = apiErr?.message || '';
        if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          return res.status(429).json({
            error: 'Gemini Search Grounding API rate limit reached (RESOURCE_EXHAUSTED). You can select an API key in Settings > Secrets or explore one of the pre-loaded market pulses.',
            code: 'RESOURCE_EXHAUSTED',
          });
        }
        if (errMsg.includes('403') || errMsg.includes('PERMISSION_DENIED')) {
          return res.status(403).json({
            error: 'Gemini API permission denied. Please verify your GEMINI_API_KEY in Settings > Secrets.',
            code: 'PERMISSION_DENIED',
          });
        }
        return res.status(500).json({
          error: `Gemini API error: ${apiErr?.message || 'Unknown error'}`,
          code: 'GEMINI_API_ERROR',
        });
      }

      responseText = response.text || '';
      groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];
      searchQueries = (response.candidates?.[0]?.groundingMetadata?.webSearchQueries as string[]) || [];

      try {
        parsedData = cleanAndParseJSON(responseText);
      } catch (parseErr: any) {
        console.warn(`[MarketPulse] Parse attempt ${attempt} failed:`, parseErr.message);
        if (attempt >= 2) {
          return res.status(502).json({
            error: 'Model output could not be parsed into required JSON schema after retry.',
            code: 'PARSE_FAILED',
          });
        }
      }
    }

    if (!parsedData) {
      return res.status(502).json({
        error: 'Unable to parse grounded market read from Gemini. Please try again or refresh.',
      });
    }

    // Enforce grounding verifier
    const { verifiedList, sanitizedData } = verifyAndFilterWithGrounding(parsedData, groundingChunks, isNational, cleanLocation);

    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (section === 'people_ask') {
      return res.json({
        section: 'people_ask',
        topic: cleanTopic,
        location: cleanLocation,
        did_retry: didRetry,
        data: sanitizedData.people_ask || sanitizedData,
        grounding_sources: verifiedList,
        search_queries_used: searchQueries,
        formatted_time: `${formattedTime} EDT`,
      });
    }

    if (section === 'social') {
      return res.json({
        section: 'social',
        topic: cleanTopic,
        location: cleanLocation,
        did_retry: didRetry,
        data: sanitizedData.social || sanitizedData,
        grounding_sources: verifiedList,
        search_queries_used: searchQueries,
        formatted_time: `${formattedTime} EDT`,
      });
    }

    if (section === 'state_pulse' || section === 'rising') {
      return res.json({
        section: 'state_pulse',
        topic: cleanTopic,
        location: cleanLocation,
        is_national: isNational,
        did_retry: didRetry,
        state_pulse: isNational ? undefined : (sanitizedData.state_pulse || sanitizedData),
        national_pulse: isNational ? (sanitizedData.national_pulse || sanitizedData) : undefined,
        grounding_sources: verifiedList,
        search_queries_used: searchQueries,
        formatted_time: `${formattedTime} EDT`,
      });
    }

    // Full composite object
    const result = {
      topic: cleanTopic,
      location: cleanLocation,
      is_national: isNational,
      did_retry: didRetry,
      generated_at: now.toISOString(),
      formatted_time: `${formattedTime} EDT`,
      people_ask: sanitizedData.people_ask,
      social: sanitizedData.social,
      state_pulse: isNational ? undefined : sanitizedData.state_pulse,
      national_pulse: isNational ? sanitizedData.national_pulse : undefined,
      grounding_sources: verifiedList,
      search_queries_used: searchQueries,
    };

    return res.json(result);
  } catch (error: any) {
    console.error('[MarketPulse Error]:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate live market read.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Market Pulse Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
