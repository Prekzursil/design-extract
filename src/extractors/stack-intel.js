// v10.4 — Stack Intel
//
// Extends stack-fingerprint.js with detectors for CMS platforms (Webflow,
// Framer, Shopify, Ghost, Sanity, Contentful, Wix, Squarespace, WordPress),
// analytics (GA, Segment, Mixpanel, PostHog, Amplitude, Heap), and
// experimentation platforms (Optimizely, Statsig, GrowthBook, LaunchDarkly,
// Split, Eppo). All signals come from script URLs + meta + known globals.

const CMS = [
  { id: 'webflow', needles: ['webflow.com', 'wf-', '.webflow.'] },
  { id: 'framer', needles: ['framer.com', 'framer.website', '__framer', 'framer-motion'] },
  { id: 'shopify', needles: ['cdn.shopify', 'shopify.com', 'x-shopify'] },
  { id: 'ghost', needles: ['ghost.io', '__ghost_', 'ghost-url'] },
  { id: 'sanity', needles: ['cdn.sanity.io', 'sanity-studio'] },
  { id: 'contentful', needles: ['cdn.contentful.com', 'ctfassets.net'] },
  { id: 'wix', needles: ['parastorage.com', '.wix.com'] },
  { id: 'squarespace', needles: ['squarespace.com', 'sqspcdn.com', 'squarespace-cdn'] },
  { id: 'wordpress', needles: ['wp-content', 'wp-includes', 'wordpress'] },
  { id: 'hashnode', needles: ['hashnode.com'] },
  { id: 'notion', needles: ['notion.so/image', 'notion-static'] },
  { id: 'bubble', needles: ['bubble.io', 'bubble-cdn'] },
];

const ANALYTICS = [
  { id: 'google-analytics', needles: ['google-analytics.com', 'googletagmanager.com', 'gtag('] },
  { id: 'segment', needles: ['segment.com/analytics', 'cdn.segment.io'] },
  { id: 'mixpanel', needles: ['cdn.mxpnl.com', 'mixpanel.com/lib'] },
  { id: 'amplitude', needles: ['amplitude.com', 'cdn.amplitude.com'] },
  { id: 'posthog', needles: ['posthog.com', 'ph.posthog.com'] },
  { id: 'heap', needles: ['heapanalytics.com'] },
  { id: 'fullstory', needles: ['fullstory.com'] },
  { id: 'hotjar', needles: ['static.hotjar.com', 'hj.contentsquare'] },
  { id: 'vercel-analytics', needles: ['_vercel/insights', 'vercel/analytics'] },
  { id: 'plausible', needles: ['plausible.io/js', 'plausible.io/api'] },
  { id: 'fathom', needles: ['usefathom.com'] },
  { id: 'sentry', needles: ['sentry.io', 'sentry-cdn'] },
  { id: 'datadog', needles: ['datadoghq.com', 'datadog-rum'] },
];

const EXPERIMENTATION = [
  { id: 'optimizely', needles: ['optimizely.com', 'cdn.optimizely.'] },
  { id: 'statsig', needles: ['statsig.com'] },
  { id: 'growthbook', needles: ['growthbook.io'] },
  { id: 'launchdarkly', needles: ['launchdarkly.com'] },
  { id: 'split', needles: ['split.io', 'sdk.split.io'] },
  { id: 'eppo', needles: ['eppo.cloud'] },
  { id: 'vercel-flags', needles: ['vercel/flags', 'flags.sdk'] },
];

function fingerprint(haystackLower, list) {
  const hits = [];
  for (const entry of list) {
    // Literal substring matching (case-insensitive): these detectors grep
    // script URLs and page content for known stack signatures on purpose -
    // anchoring or regex evaluation would defeat the detection. Matching on
    // literals keeps the semantics and cannot ReDoS or mis-anchor.
    if (entry.needles.some(n => haystackLower.includes(n))) hits.push(entry.id);
  }
  return hits;
}

export function extractStackIntel(stack = {}) {
  const scripts = (stack.scripts || []).join(' \n');
  const metas = (stack.metas || []).map(m => `${m.name || ''} ${m.content || ''}`).join(' ');
  const classes = (stack.classNameSample || []).join(' ');
  const haystack = `${scripts}\n${metas}\n${classes}`.toLowerCase(); // Lowercased once: every detector needle is lowercase

  return {
    cms: fingerprint(haystack, CMS),
    analytics: fingerprint(haystack, ANALYTICS),
    experimentation: fingerprint(haystack, EXPERIMENTATION),
    signals: {
      scriptCount: (stack.scripts || []).length,
      metaCount: (stack.metas || []).length,
    },
  };
}
