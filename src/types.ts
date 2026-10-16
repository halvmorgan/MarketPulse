/**
 * Market Pulse types for all three live market reads
 */

export const ENTIRE_US_LOCATION = 'Entire United States';

export type USState =
  | 'Alabama' | 'Alaska' | 'Arizona' | 'Arkansas' | 'California' | 'Colorado'
  | 'Connecticut' | 'Delaware' | 'Florida' | 'Georgia' | 'Hawaii' | 'Idaho'
  | 'Illinois' | 'Indiana' | 'Iowa' | 'Kansas' | 'Kentucky' | 'Louisiana'
  | 'Maine' | 'Maryland' | 'Massachusetts' | 'Michigan' | 'Minnesota' | 'Mississippi'
  | 'Missouri' | 'Montana' | 'Nebraska' | 'Nevada' | 'New Hampshire' | 'New Jersey'
  | 'New Mexico' | 'New York' | 'North Carolina' | 'North Dakota' | 'Ohio' | 'Oklahoma'
  | 'Oregon' | 'Pennsylvania' | 'Rhode Island' | 'South Carolina' | 'South Dakota'
  | 'Tennessee' | 'Texas' | 'Utah' | 'Vermont' | 'Virginia' | 'Washington'
  | 'West Virginia' | 'Wisconsin' | 'Wyoming' | 'District of Columbia';

export const STATE_TO_CODE: Record<string, string> = {
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
  'District of Columbia': 'DC', 'Entire United States': 'US'
};

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface QuestionItem {
  question: string;
  why_it_matters: string;
  source_url: string;
  source_title?: string;
}

export interface RedditThreadItem {
  title: string;
  subreddit: string;
  gist: string;
  url: string;
}

export interface WhatPeopleAskData {
  summary: string;
  public_brief: string;
  ai_overview_summary: string;
  questions: QuestionItem[];
  reddit_threads: RedditThreadItem[];
  call_openers: string[];
}

export interface SocialHookItem {
  hook: string;
  platform: 'TikTok' | 'YouTube Shorts' | 'Instagram Reels';
  format: string;
  why_it_works: string;
  source_url?: string;
}

export interface SocialVideoItem {
  title: string;
  platform: 'TikTok' | 'YouTube Shorts' | 'Instagram Reels';
  creator: string;
  estimated_views: string; // e.g. "approx. 1.4M"
  hook_used: string;
  topic_angle: string;
  url: string;
}

export interface ScriptFramework {
  hook: string;
  body: string;
  call_to_action: string;
}

export interface WhatsWorkingSocialData {
  summary: string;
  sample_hook_quote: string;
  total_videos_found: number;
  total_estimated_views: string; // e.g. "approx. 4.8M"
  top_hooks: SocialHookItem[];
  videos: SocialVideoItem[];
  content_angles_to_replicate: string[];
  sample_script_framework: ScriptFramework;
}

// State Mode
export interface CoreSearchItem {
  query: string;
  three_month_trend: string; // e.g. "+38% approx."
  momentum_label: 'Breakout' | 'High Growth' | 'Steady' | 'Seasonal Spike';
  search_volume_index: number;
  verified_source_url?: string;
}

export interface RegionalHotspotItem {
  area_or_city: string;
  demand_driver: string;
}

export interface BreakoutQueryItem {
  query: string;
  growth_rate: string; // e.g. "+140% approx."
  context: string;
}

export interface RisingInStateData {
  summary: string;
  state: string;
  state_rank: number;
  total_states_evaluated: number;
  top_breakout_query: string;
  core_searches: CoreSearchItem[];
  regional_hotspots: RegionalHotspotItem[];
  breakout_queries: BreakoutQueryItem[];
  weekly_action_plan: string[];
}

// Nationwide Mode
export interface NationalCoreSearchItem {
  query: string;
  three_month_trend: 'rising' | 'steady' | 'falling' | string;
  change_note: string;
  top_states_note: string;
  verified_source_url?: string;
}

export interface TopStateItem {
  state: string;
  note: string;
}

export interface NationalBreakoutQueryItem {
  query: string;
  note: string;
  source_url?: string;
}

export interface RisingNationalData {
  national_summary: string;
  core_searches: NationalCoreSearchItem[];
  top_states: TopStateItem[];
  breakout_queries: NationalBreakoutQueryItem[];
  content_ideas: string[];
}

export interface MarketPulseResult {
  topic: string;
  location: string;
  is_national: boolean;
  generated_at: string; // ISO string
  formatted_time: string; // Human readable
  people_ask: WhatPeopleAskData;
  social: WhatsWorkingSocialData;
  state_pulse?: RisingInStateData; // present when is_national is false
  national_pulse?: RisingNationalData; // present when is_national is true
  grounding_sources: GroundingSource[];
  search_queries_used: string[];
}

export type ActiveView = 'home' | 'people-ask' | 'social' | 'state-pulse';
