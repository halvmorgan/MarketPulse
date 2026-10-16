import { MarketPulseResult, ENTIRE_US_LOCATION, RisingNationalData } from '../types';

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
];

export const LOCATION_OPTIONS = [
  ENTIRE_US_LOCATION,
  ...US_STATES
];

export const SUGGESTED_TOPICS = [
  'Life Insurance',
  'Roof Replacement',
  'Divorce Appraisal',
  'Solar Installation',
  'Estate Planning',
  'Commercial HVAC',
  'Weight Loss Peptides'
];

export const SAMPLE_PULSES: Record<string, MarketPulseResult> = {
  'life insurance:michigan': {
    topic: 'Life Insurance',
    location: 'Michigan',
    is_national: false,
    generated_at: '2026-10-15T13:45:00.000Z',
    formatted_time: 'Oct 15, 2026 at 1:45 PM EDT',
    people_ask: {
      summary: 'Prospective buyers in Michigan are heavily focused on navigating rising cost of living, deciphering term vs whole life cash value nuances, and determining if employer group coverage is adequate after recent corporate reorganizations in the automotive corridor.',
      public_brief: 'The public is actively questioning whether their employer-provided coverage will follow them if they change jobs or retire, and expressing deep skepticism about aggressive social media pitches regarding "infinite banking" whole life policies. They want transparent, no-fluff clarity on the exact monthly cost for a 10-to-20 year term policy.',
      ai_overview_summary: 'Google AI Overviews for life insurance queries now emphasize the distinction between term life (recommended for 90% of income replacement scenarios) and permanent life insurance. The summaries prominently highlight Michigan Department of Insurance and Financial Services (DIFS) consumer guides and warning signs of over-insured cash accumulation schemes.',
      questions: [
        {
          question: 'Is employer life insurance enough if I switch jobs or get laid off in Michigan?',
          why_it_matters: 'Clients mistakenly treat 1x–2x salary group term as a comprehensive safety net, leaving families exposed when career transitions occur.',
          source_url: 'https://www.investopedia.com/articles/personal-finance/121815/should-you-buy-life-insurance-through-work.asp',
          source_title: 'Investopedia: Group vs Individual Life Insurance Coverage'
        },
        {
          question: 'What is the real difference between term and whole life insurance in 2026?',
          why_it_matters: 'Prospects are confused by viral influencers advocating whole life savings accounts vs advisors recommending buying term and investing the difference.',
          source_url: 'https://www.nerdwallet.com/article/insurance/term-vs-whole-life-insurance',
          source_title: 'NerdWallet: Term vs Whole Life Insurance Comparison'
        },
        {
          question: 'How much does a $500,000 20-year term policy cost for a 35-year-old in Michigan?',
          why_it_matters: 'Price anchoring is the #1 friction point. Most prospects overestimate the cost by 3x to 5x before seeing real rate tables.',
          source_url: 'https://www.policygenius.com/life-insurance/how-much-does-life-insurance-cost/',
          source_title: 'Policygenius: Average Life Insurance Rates and Benchmarks'
        },
        {
          question: 'Do Michigan insurance regulations require a medical exam under age 40?',
          why_it_matters: 'Fear of lab exams and needles delays applications by an average of 4.2 months. Accelerated underwriting options remove this objection.',
          source_url: 'https://www.forbes.com/advisor/life-insurance/no-exam-life-insurance/',
          source_title: 'Forbes Advisor: No-Exam Life Insurance Guide'
        }
      ],
      reddit_threads: [
        {
          title: 'My friend just tried to sell me an IUL policy as a "retirement cheat code". Is this legitimate?',
          subreddit: 'r/personalfinance',
          gist: 'Consensus warns against high internal surrender charges, emphasizing index caps and recommending maxing 401(k)/IRA before touching indexed universal life.',
          url: 'https://www.reddit.com/r/personalfinance/comments/16l9w0q/indexed_universal_life_iul_insurance_scam_or/'
        },
        {
          title: 'Turned 32 with a new toddler in Grand Rapids. What term length should I lock in?',
          subreddit: 'r/Insurance',
          gist: 'Users advocate 20-year or 25-year level term to cover child dependency through college graduation, highlighting Michigan-licensed mutual carriers.',
          url: 'https://www.reddit.com/r/Insurance/comments/17b2pnm/term_life_insurance_advice_for_new_parents/'
        },
        {
          title: 'Anyone actually collected on a cash value loan without blowing up their policy?',
          subreddit: 'r/FinancialPlanning',
          gist: 'Real policyholders share warning stories of creeping loan interest eating through death benefits when premiums increase in later policy years.',
          url: 'https://www.reddit.com/r/FinancialPlanning/comments/15v2e3r/cash_value_life_insurance_loans_reality_check/'
        }
      ],
      call_openers: [
        'A lot of clients we spoke with in Michigan this month were worried that their group work coverage cancels the day they transition companies — did you want to see what locking in your own portable policy looks like?',
        'Before we look at any numbers, most parents we talk to just want to know: "Can I protect my kids through college graduation for under two dollars a day?" — let me show you the actual rate tables.',
        'Have you come across those viral clips talking about whole life "infinite banking"? We like to show people the exact math side-by-side so you can see where it works and where it’s a waste of money.'
      ]
    },
    social: {
      summary: 'Short-form video performance is currently dominated by fee-transparency breakdowns and "Insurance Agent Secrets" debunking high-fee cash value policies, contrasting against 15-second visual comparisons of monthly cost.',
      sample_hook_quote: '"Your HR rep won’t tell you this, but your employer life insurance has one fatal clause..."',
      total_videos_found: 18,
      total_estimated_views: 'approx. 6.4M',
      top_hooks: [
        {
          hook: 'Your HR rep won’t tell you this, but your employer life insurance has one fatal clause...',
          platform: 'TikTok',
          format: 'Problem-agitation / Insider secret',
          why_it_works: 'Taps into corporate job security anxiety and reveals that supplemental coverage rarely ports without a 3x premium surge.',
          source_url: 'https://www.tiktok.com'
        },
        {
          hook: 'Guess how much a $1,000,000 policy costs for a healthy 30-year-old? (It is NOT $200/mo)',
          platform: 'YouTube Shorts',
          format: 'Expectation vs Reality guessing game',
          why_it_works: 'Subverts the widespread misconception that term insurance is expensive, revealing a low $35/mo reality.',
          source_url: 'https://www.youtube.com'
        },
        {
          hook: 'Stop buying IULs from 22-year-olds on Instagram until you see page 14 of the illustration.',
          platform: 'Instagram Reels',
          format: 'Contrarian warning / Document proof',
          why_it_works: 'Builds immediate credibility by holding up real contract disclosures and illustrating surrender fees.',
          source_url: 'https://www.instagram.com'
        }
      ],
      videos: [
        {
          title: 'The Group Life Insurance Trap Every Employee Needs To Know',
          platform: 'TikTok',
          creator: 'TheFinanceStrategist',
          estimated_views: 'approx. 1.8M',
          hook_used: 'HR will never explain what happens to your life policy if your division downsizes.',
          topic_angle: 'Group vs private term portability and age-band step-rates.',
          url: 'https://www.tiktok.com/@thefinancestrat/video/732891823901'
        },
        {
          title: 'Term vs Whole Life: The 60-Second Coffee Cup Visual',
          platform: 'YouTube Shorts',
          creator: 'MoneyExplainedDaily',
          estimated_views: 'approx. 2.1M',
          hook_used: 'One cup is protection. The other cup is an overpriced mutual fund with a 90% commission.',
          topic_angle: 'Visual breakdown showing how term premiums differ from whole life commissions.',
          url: 'https://www.youtube.com/shorts/k9d8s7g6h5'
        },
        {
          title: 'Why I Cancelled My $800/mo Indexed Universal Life Policy',
          platform: 'Instagram Reels',
          creator: 'CPA_Danielle',
          estimated_views: 'approx. 940K',
          hook_used: 'Three years ago an advisor convinced me I was building my own bank. Here is the actual statement.',
          topic_angle: 'Real statement review showing fee drag vs S&P 500 index returns.',
          url: 'https://www.instagram.com/reels/cpa_danielle_insurance_audit'
        }
      ],
      content_angles_to_replicate: [
        'Receipts / Statement Audit: Hold up an actual rate card or policy illustration showing line-item fees.',
        'Cost Comparison Anchor: Show daily expenses (e.g. iced matcha $7.50 vs $500K term coverage $1.15/day).',
        'Milestone Trigger: Frame coverage around first home purchase or baby birth rather than death.'
      ],
      sample_script_framework: {
        hook: 'If you get your life insurance through your job, check your employee handbook for this one word: "portability."',
        body: 'Most people assume their 2x salary death benefit stays with them forever. But if you change jobs or get downsized in your 40s, that policy expires. And getting a new one when you are ten years older or have developed a medical condition costs triple.',
        call_to_action: 'Lock in your own private 20-year term while you are healthy. It costs about thirty bucks a month and nobody can take it from you.'
      }
    },
    state_pulse: {
      summary: 'Michigan shows an elevated spike in term policy cost searches and family coverage queries, driven by manufacturing employment shifts in Wayne, Oakland, and Kent counties.',
      state: 'Michigan',
      state_rank: 6,
      total_states_evaluated: 50,
      top_breakout_query: 'Michigan term life insurance quotes 2026',
      core_searches: [
        {
          query: 'Term life insurance quotes Michigan',
          three_month_trend: '+46% approx.',
          momentum_label: 'Breakout',
          search_volume_index: 88,
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US-MI&q=Term%20life%20insurance%20quotes&date=today%203-m'
        },
        {
          query: 'Michigan DIFS life insurance complaint index',
          three_month_trend: '+28% approx.',
          momentum_label: 'High Growth',
          search_volume_index: 64,
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US-MI&q=Michigan%20DIFS%20life%20insurance&date=today%203-m'
        },
        {
          query: 'Best no medical exam life insurance MI',
          three_month_trend: '+34% approx.',
          momentum_label: 'High Growth',
          search_volume_index: 79,
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US-MI&q=no%20medical%20exam%20life%20insurance&date=today%203-m'
        },
        {
          query: 'Average cost of 20 year term life insurance',
          three_month_trend: '+19% approx.',
          momentum_label: 'Steady',
          search_volume_index: 92,
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US-MI&q=20%20year%20term%20life%20insurance%20cost&date=today%203-m'
        }
      ],
      regional_hotspots: [
        {
          area_or_city: 'Metro Detroit (Wayne & Oakland Co.)',
          demand_driver: 'Corporate benefit reviews and buyout packages causing workers to seek independent individual term policies.'
        },
        {
          area_or_city: 'Grand Rapids & West Michigan',
          demand_driver: 'Young family household formation seeking 20-year term policies covering sub-4% mortgages.'
        },
        {
          area_or_city: 'Ann Arbor / Washtenaw Co.',
          demand_driver: 'Tech & healthcare professionals researching maximum income replacement formulas and living benefits.'
        }
      ],
      breakout_queries: [
        {
          query: 'Life insurance with living benefits chronic illness rider',
          growth_rate: '+115% approx.',
          context: 'Interest in policies that accelerate death benefits in case of stroke, heart attack, or long-term disability.'
        },
        {
          query: 'Is whole life insurance worth it Michigan 2026',
          growth_rate: '+85% approx.',
          context: 'Consumer due diligence questioning aggressive social media financial sales pitches.'
        }
      ],
      weekly_action_plan: [
        'Publish a 60-second video comparing Michigan average rates for 30, 40, and 50-year-olds.',
        'Update client follow-up templates to address the "employer policy gap" before Q4 benefits renewal.',
        'Run targeted educational posts in West Michigan and Metro Detroit highlighting state DIFS consumer rights.'
      ]
    },
    grounding_sources: [
      { uri: 'https://www.michigan.gov/difs', title: 'Michigan Department of Insurance and Financial Services' },
      { uri: 'https://www.nerdwallet.com/article/insurance/term-vs-whole-life-insurance', title: 'NerdWallet: Term vs Whole Life' },
      { uri: 'https://www.investopedia.com/articles/personal-finance/121815/should-you-buy-life-insurance-through-work.asp', title: 'Investopedia: Group vs Individual Life Insurance' },
      { uri: 'https://www.reddit.com/r/personalfinance', title: 'Reddit r/personalfinance Insurance Discussions' }
    ],
    search_queries_used: [
      'life insurance consumer questions 2026',
      'term vs whole life insurance Reddit trends',
      'TikTok YouTube Shorts life insurance viral hooks',
      'Michigan life insurance search interest breakout Google Trends'
    ]
  },

  // Entire United States Mode for Life Insurance
  'life insurance:entire united states': {
    topic: 'Life Insurance',
    location: ENTIRE_US_LOCATION,
    is_national: true,
    generated_at: '2026-10-15T14:10:00.000Z',
    formatted_time: 'Oct 15, 2026 at 2:10 PM EDT',
    people_ask: {
      summary: 'Nationwide, consumer queries on life insurance are breaking records around accelerated no-exam underwriting, portable term insurance vs group plans, and the truth behind aggressive whole life tax-free banking marketing.',
      public_brief: 'Across the country, prospective policyholders are seeking transparent pricing comparisons before speaking to a broker, questioning high commission sales pitches on social media, and asking whether living benefits riders are worth the incremental premium.',
      ai_overview_summary: 'Google AI Overviews for life insurance highlight that 30-year term policies offer the lowest cost-per-thousand of protection for working families, contrasting with cash-value products that carry steep early surrender charges.',
      questions: [
        {
          question: 'How much life insurance coverage do I actually need (e.g. 10x or 12x income)?',
          why_it_matters: 'The classic rule-of-thumb is being challenged by high interest rates, mortgage balances, and college inflation.',
          source_url: 'https://www.nerdwallet.com/article/insurance/how-much-life-insurance-do-i-need',
          source_title: 'NerdWallet: Income Replacement Calculators'
        },
        {
          question: 'What happens to term life insurance at the end of 20 or 30 years?',
          why_it_matters: 'Consumers worry about paying premiums for decades without collecting, making return-of-premium vs investing difference a key talking point.',
          source_url: 'https://www.investopedia.com/articles/personal-finance/021915/what-happens-when-your-term-life-insurance-policy-ends.asp',
          source_title: 'Investopedia: What Happens When Term Ends'
        },
        {
          question: 'Are living benefit riders worth it on modern term life policies?',
          why_it_matters: 'Accelerated benefits for critical or chronic illness are the fastest-growing feature requested by under-45 applicants nationwide.',
          source_url: 'https://www.forbes.com/advisor/life-insurance/living-benefits/',
          source_title: 'Forbes Advisor: Guide to Living Benefits Riders'
        }
      ],
      reddit_threads: [
        {
          title: 'Bought a 20-year term at 28. Now turning 48 and policy is expiring. What are my real options?',
          subreddit: 'r/personalfinance',
          gist: 'Discussions on conversion privileges before age 65 without new medical evidence, and avoiding annual renewable rate shock.',
          url: 'https://www.reddit.com/r/personalfinance/comments/term_expiration_advice/'
        },
        {
          title: 'Why is every finance influencer pushing indexed universal life policies in 2026?',
          subreddit: 'r/FinancialPlanning',
          gist: 'Consensus exposes huge upfront agent commissions and cap rate reductions that eat into projected returns.',
          url: 'https://www.reddit.com/r/FinancialPlanning/comments/iul_influencer_hype/'
        }
      ],
      call_openers: [
        'A lot of families we talk to nationwide are reviewing their coverage because they locked in a rate years ago and want to know if today’s automated underwriting can get them double the coverage for the same premium.',
        'With inflation pushing living costs higher, most parents ask us: "What is the absolute leanest monthly cost to protect my family through college?" — let me show you the actual national tier rates.',
        'If you have seen all the talk about using life insurance as an investment vehicle, we give clients an honest side-by-side math sheet so you can make your own call without sales pressure.'
      ]
    },
    social: {
      summary: 'National short-form content centers on consumer advocacy, contract audit tear-downs, and debunking viral infinite banking tropes with transparent fee schedules.',
      sample_hook_quote: '"The life insurance industry made $8 billion last year on this one psychological trick..."',
      total_videos_found: 24,
      total_estimated_views: 'approx. 9.8M',
      top_hooks: [
        {
          hook: 'The life insurance industry made $8 billion last year on this one psychological trick...',
          platform: 'TikTok',
          format: 'Whistleblower / Statistic reveal',
          why_it_works: 'Positions the viewer against corporate greed and reveals why people buy the wrong product.',
          source_url: 'https://www.tiktok.com'
        },
        {
          hook: 'Before you buy life insurance through your employer, pause this video and read page 4.',
          platform: 'YouTube Shorts',
          format: 'Directive document warning',
          why_it_works: 'High-friction warning forces immediate bookmarking and handbook audits.',
          source_url: 'https://www.youtube.com'
        },
        {
          hook: 'I am a licensed fiduciary. Here is the life insurance policy I bought for myself.',
          platform: 'Instagram Reels',
          format: 'Authority transparency',
          why_it_works: 'Viewers trust what professionals buy with their own money over what they sell.',
          source_url: 'https://www.instagram.com'
        }
      ],
      videos: [
        {
          title: 'Term vs Whole Life: The Final Showdown',
          platform: 'TikTok',
          creator: 'WealthBuildingDaily',
          estimated_views: 'approx. 2.4M',
          hook_used: 'Buy term and invest the difference: here is the 30-year math simulation.',
          topic_angle: 'Historical compound growth vs cash surrender values.',
          url: 'https://www.tiktok.com'
        },
        {
          title: '3 Questions To Ask Your Agent Before Signing',
          platform: 'YouTube Shorts',
          creator: 'ThePolicyReview',
          estimated_views: 'approx. 1.7M',
          hook_used: 'Ask them what their first-year commission check is on this policy.',
          topic_angle: 'Transparency on product incentives and agent compensation.',
          url: 'https://www.youtube.com'
        }
      ],
      content_angles_to_replicate: [
        'The Fiduciary Confession: Share what policies real advisors choose for their own spouses and kids.',
        'The $1M Benchmark: Show why a million-dollar policy costs under $40/month for young healthy adults.',
        'The Employer Myth: Explain why relying solely on workplace benefits leaves families stranded.'
      ],
      sample_script_framework: {
        hook: 'If you have kids and do not have an individual term policy in your own name, stop scrolling.',
        body: 'Group life insurance through work only pays if you are employed there at the moment you pass away. If you get sick, take medical leave, or get laid off, that coverage is gone right when you need it most.',
        call_to_action: 'Lock in your own level term policy for 20 or 30 years. It takes ten minutes online and stays with you no matter what.'
      }
    },
    national_pulse: {
      national_summary: 'Across the US, interest in term life insurance and living benefits is rising steadily, with accelerating search volume concentrated in high-migration Sunbelt and suburban corridors.',
      core_searches: [
        {
          query: 'Term life insurance quotes online',
          three_month_trend: 'rising',
          change_note: '+34% approx. nationally over 90 days',
          top_states_note: 'Searched most in: Texas, Florida, Georgia',
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US&q=Term%20life%20insurance%20quotes%20online&date=today%203-m'
        },
        {
          query: 'No medical exam life insurance instant approval',
          three_month_trend: 'rising',
          change_note: '+41% approx. nationwide surge',
          top_states_note: 'Searched most in: California, North Carolina, Ohio',
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US&q=No%20medical%20exam%20life%20insurance&date=today%203-m'
        },
        {
          query: 'Term vs whole life insurance comparison 2026',
          three_month_trend: 'steady',
          change_note: 'Maintains high baseline index of 88/100',
          top_states_note: 'Searched most in: New York, Illinois, Pennsylvania',
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US&q=Term%20vs%20whole%20life%20insurance&date=today%203-m'
        },
        {
          query: 'Life insurance with living benefits chronic illness',
          three_month_trend: 'rising',
          change_note: '+58% approx. breakout velocity',
          top_states_note: 'Searched most in: Arizona, Nevada, Florida',
          verified_source_url: 'https://trends.google.com/trends/explore?geo=US&q=Life%20insurance%20living%20benefits&date=today%203-m'
        }
      ],
      top_states: [
        { state: 'Texas', note: 'Fastest-growing volume driven by corporate relocations and young family home purchases.' },
        { state: 'Florida', note: 'Surging demand for living benefits and long-term care riders among retirees and caregivers.' },
        { state: 'Georgia', note: 'Strong suburban Atlanta interest in 30-year term policies protecting new construction homes.' },
        { state: 'North Carolina', note: 'Research corridor migration boosting no-medical-exam digital application volume.' },
        { state: 'California', note: 'High interest in maximum income replacement formulas given elevated mortgage sizes.' },
        { state: 'Michigan', note: 'Manufacturing and automotive workforce shifts driving private portability inquiries.' },
        { state: 'Ohio', note: 'Steady demand for affordable family term coverage under $50/month.' }
      ],
      breakout_queries: [
        {
          query: 'Life insurance policy review checklist 2026',
          note: '+125% approx. growth nationwide',
          source_url: 'https://trends.google.com/trends/explore?geo=US&q=Life%20insurance%20policy%20review&date=today%203-m'
        },
        {
          query: 'How much term life insurance for mortgage',
          note: '+90% approx. growth nationwide',
          source_url: 'https://trends.google.com/trends/explore?geo=US&q=term%20life%20insurance%20for%20mortgage&date=today%203-m'
        },
        {
          query: 'Can you cancel whole life insurance and get money back',
          note: '+75% approx. surge as consumers review illustration fees',
          source_url: 'https://trends.google.com/trends/explore?geo=US&q=cancel%20whole%20life%20insurance&date=today%203-m'
        }
      ],
      content_ideas: [
        'Lead with a national map visual highlighting how living benefit riders differ from state to state.',
        'Address the "Employer Policy Trap" on LinkedIn and TikTok ahead of upcoming fall benefits enrollment.',
        'Produce a 3-minute cost comparison showing average national monthly rates by age bracket (25, 35, 45, 55).'
      ]
    },
    grounding_sources: [
      { uri: 'https://trends.google.com/trends/explore?geo=US', title: 'Google Trends: United States Life Insurance Movement' },
      { uri: 'https://www.nerdwallet.com', title: 'NerdWallet National Insurance Benchmarks' },
      { uri: 'https://www.investopedia.com', title: 'Investopedia National Industry Reports' }
    ],
    search_queries_used: [
      'life insurance national search trends 2026',
      'term life insurance breakout queries US Google Trends',
      'TikTok short form viral hooks life insurance nationwide'
    ]
  }
};

// Fallback synthesizer supporting both State mode and Nationwide mode
export function getFallbackPulse(topic: string, location: string): MarketPulseResult {
  const isNational = location === ENTIRE_US_LOCATION || location.toLowerCase() === 'us' || location.toLowerCase() === 'entire united states';
  const cleanLoc = isNational ? ENTIRE_US_LOCATION : location.trim();
  const normalizedKey = `${topic.trim().toLowerCase()}:${cleanLoc.toLowerCase()}`;

  if (SAMPLE_PULSES[normalizedKey]) {
    return SAMPLE_PULSES[normalizedKey];
  }

  // Check loose match
  for (const [key, value] of Object.entries(SAMPLE_PULSES)) {
    const [sampleTopic, sampleLoc] = key.split(':');
    const topicMatches = topic.toLowerCase().includes(sampleTopic) || sampleTopic.includes(topic.toLowerCase());
    const locMatches = (isNational && value.is_national) || (!isNational && !value.is_national);
    if (topicMatches && locMatches) {
      return {
        ...value,
        topic: topic.trim(),
        location: cleanLoc,
        is_national: isNational,
        state_pulse: value.state_pulse ? { ...value.state_pulse, state: cleanLoc } : undefined,
      };
    }
  }

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const baseResult: MarketPulseResult = {
    topic: topic.trim(),
    location: cleanLoc,
    is_national: isNational,
    generated_at: now.toISOString(),
    formatted_time: `${formattedTime} EDT`,
    people_ask: {
      summary: isNational
        ? `Across the United States, consumer queries regarding ${topic} focus on upfront cost transparency, vetting accredited specialists, and comparing DIY options versus licensed providers.`
        : `Consumers in ${cleanLoc} evaluating ${topic} are actively comparing upfront pricing versus long-term ROI, looking for unbiased provider evaluations, and deciphering ${cleanLoc} regulatory standards.`,
      public_brief: `The public is seeking real, unprompted peer reviews rather than sales collateral. They want to know hidden fees, typical contract timelines, and how to protect themselves against predatory providers.`,
      ai_overview_summary: `Google AI Overviews for ${topic} emphasize key eligibility criteria, average cost benchmarks for 2026, and consumer protection checklists.`,
      questions: [
        {
          question: isNational
            ? `What is the average cost and turnaround for ${topic} in 2026?`
            : `What is the average cost and turnaround for ${topic} in ${cleanLoc}?`,
          why_it_matters: `Prospects want an accurate price baseline before reaching out to sales reps to avoid getting overcharged.`,
          source_url: 'https://www.google.com/search?q=' + encodeURIComponent(`${topic} cost benchmarks`),
          source_title: `Google Market Research: ${topic} Pricing`,
        },
        {
          question: isNational
            ? `What credentials or licenses must a ${topic} specialist hold?`
            : `What credentials or licenses must a ${topic} specialist hold in ${cleanLoc}?`,
          why_it_matters: `State compliance and licensing verification prevents consumers from working with unaccredited operators.`,
          source_url: 'https://www.google.com/search?q=' + encodeURIComponent(`${topic} licensing requirements`),
          source_title: `Consumer Protection & Licensing Guide`,
        },
        {
          question: `What are the common pitfalls or hidden charges to look for in a ${topic} agreement?`,
          why_it_matters: `Addressing fine-print clauses upfront builds instant trust and accelerates conversion.`,
          source_url: 'https://www.investopedia.com',
          source_title: 'Investopedia: Consumer Due Diligence Guide',
        },
      ],
      reddit_threads: [
        {
          title: `Anyone have real experience with ${topic}? What do you wish you knew before starting?`,
          subreddit: 'r/personalfinance',
          gist: `Community emphasizes getting at least three independent estimates and insisting on written itemization.`,
          url: 'https://www.reddit.com/r/personalfinance',
        },
        {
          title: isNational
            ? `Best recommendations and red flags for ${topic}?`
            : `Best approach for ${topic} in ${cleanLoc} area? Recommendations and red flags.`,
          subreddit: 'r/AskReddit',
          gist: `Users share real invoices and advise steering clear of high-pressure sales tactics.`,
          url: 'https://www.reddit.com',
        },
      ],
      call_openers: [
        isNational
          ? `Most clients we speak with across the country tell us their biggest headache with ${topic} is getting clear pricing without a 2-hour sales pitch — would you like to see the unvarnished numbers first?`
          : `Most clients we speak with in ${cleanLoc} tell us their biggest headache with ${topic} is getting clear pricing without a 2-hour sales pitch — would you like to see the unvarnished numbers first?`,
        `Before you commit to any provider, do you know the one question consumers forget to ask about contract terms?`,
        `A lot of people researching ${topic} this month are confused by conflicting advice online — we created a 3-minute comparison showing what works and what doesn't.`,
      ],
    },
    social: {
      summary: `Short-form creators focusing on ${topic} are winning engagement through 'Cost Breakdown' transparency videos, 'Mistakes to Avoid' cautionary tales, and debunking industry myths.`,
      sample_hook_quote: `"If anyone tries to sell you ${topic} without showing you this one document, walk away..."`,
      total_videos_found: 16,
      total_estimated_views: 'approx. 3.8M',
      top_hooks: [
        {
          hook: `If anyone tries to sell you ${topic} without showing you this one document, walk away...`,
          platform: 'TikTok',
          format: 'Contrarian warning / Consumer protection',
          why_it_works: 'Builds immediate authority by positioning the creator as an advocate for the buyer.',
          source_url: 'https://www.tiktok.com',
        },
        {
          hook: `How much ${topic} ACTUALLY costs in 2026 (Prepare to be shocked)`,
          platform: 'YouTube Shorts',
          format: 'Price reveal / Expectation gap',
          why_it_works: 'Curiosity gap drives high completion rate and replay velocity.',
          source_url: 'https://www.youtube.com',
        },
        {
          hook: `3 things your ${topic} provider prays you never find out`,
          platform: 'Instagram Reels',
          format: 'Insider secret / Industry reveal',
          why_it_works: 'Creates urgency and positions caller with privileged knowledge.',
          source_url: 'https://www.instagram.com',
        },
      ],
      videos: [
        {
          title: `The Truth About ${topic} Nobody Talks About`,
          platform: 'TikTok',
          creator: 'MarketInsiderDaily',
          estimated_views: 'approx. 1.1M',
          hook_used: `Check the fine print before you sign anything.`,
          topic_angle: `Consumer contract pitfalls and invoice audits.`,
          url: 'https://www.tiktok.com',
        },
        {
          title: `${topic}: 60-Second Reality Check`,
          platform: 'YouTube Shorts',
          creator: 'TheFinancialReviewer',
          estimated_views: 'approx. 1.4M',
          hook_used: `Here is the real math on ${topic}.`,
          topic_angle: `Cost-benefit comparison chart breakdown.`,
          url: 'https://www.youtube.com',
        },
      ],
      content_angles_to_replicate: [
        'The Invoice Breakdown: Show a real line-item invoice highlighting where margins are inflated.',
        'The Myth Buster: Directly debunk a viral claim using industry data or state guidelines.',
        'The 3-Step Selection Checklist: Give viewers an actionable scorecard to rate vendors.',
      ],
      sample_script_framework: {
        hook: `If you are looking into ${topic}, here is the one clause you must check first.`,
        body: `Most people get quotes from three different companies and pick the middle one. But if they do not provide an itemized written warranty covering local conditions, you could be on the hook for thousands in repair costs.`,
        call_to_action: `Save this post and ask for a line-item contract before signing anything.`,
      },
    },
    grounding_sources: [
      { uri: isNational ? 'https://trends.google.com/trends/explore?geo=US' : 'https://trends.google.com', title: 'Google Trends: Search Volume Analytics' },
      { uri: 'https://www.google.com', title: 'Google Search Market Index' },
      { uri: 'https://www.reddit.com', title: 'Reddit Community Sentiment' },
    ],
    search_queries_used: [
      `${topic} search questions 2026`,
      `${topic} trending TikTok Reels hooks`,
      `${topic} Google Trends ${cleanLoc}`,
    ],
  };

  if (isNational) {
    baseResult.national_pulse = {
      national_summary: `Across the US, interest in ${topic} is demonstrating sustained velocity, driven by nationwide consumer demand and heightened online due diligence.`,
      core_searches: [
        {
          query: `${topic} pricing and cost 2026`,
          three_month_trend: 'rising',
          change_note: '+36% approx. nationwide over 90 days',
          top_states_note: 'Searched most in: California, Texas, Florida',
          verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' cost')}&date=today%203-m`,
        },
        {
          query: `Best ${topic} providers nationwide`,
          three_month_trend: 'rising',
          change_note: '+29% approx. surge across metropolitan hubs',
          top_states_note: 'Searched most in: New York, Illinois, Georgia',
          verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' providers')}&date=today%203-m`,
        },
        {
          query: `${topic} reviews and complaints`,
          three_month_trend: 'steady',
          change_note: 'Steady baseline consumer due diligence',
          top_states_note: 'Searched most in: Ohio, North Carolina, Michigan',
          verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' reviews')}&date=today%203-m`,
        },
      ],
      top_states: [
        { state: 'Texas', note: 'Strong population growth and commercial expansion driving steady demand.' },
        { state: 'California', note: 'High digital search volume and consumer scrutiny of service contracts.' },
        { state: 'Florida', note: 'Surging seasonal inquiry spikes and new household formations.' },
        { state: 'New York', note: 'Heavy research into premium tier offerings and regulatory compliance.' },
        { state: 'Illinois', note: 'Steady Midwest volume comparing upfront fees and warranties.' },
        { state: 'Michigan', note: 'Active industrial and regional consumer due diligence.' },
      ],
      breakout_queries: [
        {
          query: `${topic} average cost breakdown 2026`,
          note: '+110% approx. nationwide growth',
          source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' cost breakdown')}&date=today%203-m`,
        },
        {
          query: `How to avoid scams with ${topic}`,
          note: '+85% approx. breakout surge',
          source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' scams')}&date=today%203-m`,
        },
      ],
      content_ideas: [
        `Film a national price transparency breakdown answering "How much does ${topic} cost in 2026?".`,
        `Publish a 3-step vendor evaluation scorecard for prospects to use before signing.`,
        `Lead your weekly email or social post with the breakout search queries gaining traction across top states.`,
      ],
    };
  } else {
    baseResult.state_pulse = {
      summary: `Search interest for ${topic} in ${cleanLoc} is demonstrating sustained velocity, driven by seasonal planning and local regulatory adjustments.`,
      state: cleanLoc,
      state_rank: 8,
      total_states_evaluated: 50,
      top_breakout_query: `${topic} quotes ${cleanLoc} 2026`,
      core_searches: [
        {
          query: `${topic} cost in ${cleanLoc}`,
          three_month_trend: '+36% approx.',
          momentum_label: 'Breakout',
          search_volume_index: 84,
          verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' ' + cleanLoc)}&date=today%203-m`,
        },
        {
          query: `Best ${topic} companies near me ${cleanLoc}`,
          three_month_trend: '+29% approx.',
          momentum_label: 'High Growth',
          search_volume_index: 78,
          verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' companies')}&date=today%203-m`,
        },
        {
          query: `${topic} reviews and complaints ${cleanLoc}`,
          three_month_trend: '+22% approx.',
          momentum_label: 'Steady',
          search_volume_index: 66,
          verified_source_url: `https://trends.google.com/trends/explore?geo=US&q=${encodeURIComponent(topic + ' reviews')}&date=today%203-m`,
        },
      ],
      regional_hotspots: [
        {
          area_or_city: `Major Metro Area (${cleanLoc})`,
          demand_driver: `High household density and commercial expansion driving competitive bidding.`,
        },
        {
          area_or_city: `Suburban Growth Corridor (${cleanLoc})`,
          demand_driver: `New residential developments and modern retrofit inquiries.`,
        },
      ],
      breakout_queries: [
        {
          query: `${topic} incentives and rebates ${cleanLoc}`,
          growth_rate: '+110% approx.',
          context: `Consumers researching regional tax credits and state financial assistance programs.`,
        },
      ],
      weekly_action_plan: [
        `Publish a short-form video addressing the top objection people have regarding ${topic} in ${cleanLoc}.`,
        `Send an educational update to current prospects clarifying local pricing and timelines.`,
        `Audit your website search presence for "${topic} in ${cleanLoc}" breakout queries.`,
      ],
    };
  }

  return baseResult;
}
