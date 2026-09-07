/**
 * Live Submission Count Fetcher — SIH Opportunity Radar
 * -------------------------------------------------------
 * Scrapes live idea-submission counts directly from sih.gov.in
 * and merges them into the bundled PS data.
 *
 * Server-side only (runs in Next.js API routes, never in the browser).
 *
 * The SIH PS page renders each problem statement in a summary table row:
 *   <td>SIH26XXX</td>
 *   <td>X/500</td>
 *
 * We extract these using a regex pattern.
 */

const SIH_GOV_URL = "https://sih.gov.in/sih2026PS";
const FETCH_TIMEOUT_MS = 20000;

// In-memory cache to avoid hammering sih.gov.in on every request
let cachedCounts = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Fetch live submission counts from sih.gov.in.
 * Returns a Map of ps_number → { submitted, capacity }.
 * Returns null on failure.
 */
async function fetchLiveSubmissionCounts() {
  const region = process.env.VERCEL_REGION || "local";
  const ts = new Date().toISOString();

  // Return cached data if still fresh
  const now = Date.now();
  if (cachedCounts && now - cacheTimestamp < CACHE_TTL_MS) {
    console.log(`[${ts}] [region=${region}] Live counts: returning cached data (${cachedCounts.size} PS, age=${Math.round((now - cacheTimestamp) / 1000)}s)`);
    return cachedCounts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    console.log(`[${ts}] [region=${region}] Fetching live counts from sih.gov.in...`);

    const res = await fetch(SIH_GOV_URL, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeoutId);

    console.log(`[${ts}] [region=${region}] sih.gov.in response: status=${res.status}, type=${res.headers.get("content-type")}`);

    if (!res.ok) {
      console.warn(`[${ts}] [region=${region}] sih.gov.in returned ${res.status} — live scrape FAILED`);
      return cachedCounts; // return stale cache if available
    }

    const html = await res.text();
    console.log(`[${ts}] [region=${region}] sih.gov.in response body length: ${html.length} bytes`);

    // Pattern: <td>SIH26XXX</td>\s*<td>X/500</td>
    const pattern = /<td>(SIH\d+)<\/td>\s*<td>(\d+)\/(\d+)<\/td>/g;
    const counts = new Map();
    let match;
    while ((match = pattern.exec(html)) !== null) {
      counts.set(match[1], {
        submitted: parseInt(match[2], 10),
        capacity: parseInt(match[3], 10),
      });
    }

    if (counts.size > 0) {
      cachedCounts = counts;
      cacheTimestamp = now;
      const totalSubs = [...counts.values()].reduce((s, v) => s + v.submitted, 0);
      console.log(
        `[${ts}] [region=${region}] Live scrape SUCCESS: ${counts.size} PS, ${totalSubs} total submissions`
      );
    } else {
      console.warn(`[${ts}] [region=${region}] Live scrape returned 200 but parsed 0 PS — possible HTML structure change or firewall block (response length: ${html.length})`);
    }

    return counts.size > 0 ? counts : cachedCounts;
  } catch (e) {
    console.warn(`[${ts}] [region=${region}] Live scrape FAILED: ${e.message}`);
    return cachedCounts; // return stale cache if available
  }
}

/**
 * Merge live submission counts into PS records.
 * Updates ideas_submitted, submission_capacity, fill_percentage,
 * and competition_level for each matched PS.
 */
function mergeliveCounts(psData, liveCounts) {
  if (!liveCounts || liveCounts.size === 0) return psData;

  return psData.map((ps) => {
    const live = liveCounts.get(ps.ps_number);
    if (!live) return ps;

    const submitted = live.submitted;
    const capacity = live.capacity;
    const fillPct = capacity > 0 ? Math.round((100 * submitted) / capacity * 100) / 100 : 0;

    // Recompute competition level
    let competitionLevel;
    if (fillPct >= 50) competitionLevel = "High";
    else if (fillPct >= 10) competitionLevel = "Medium";
    else if (fillPct > 0) competitionLevel = "Low";
    else competitionLevel = "None yet";

    return {
      ...ps,
      ideas_submitted: submitted,
      submission_capacity: capacity,
      fill_percentage: fillPct,
      competition_level: competitionLevel,
    };
  });
}

/**
 * Recompute KPIs from updated PS data.
 */
function recomputeKpis(psData) {
  const total = psData.length;
  const software = psData.filter((r) => r.category === "Software").length;
  const hardware = psData.filter((r) => r.category === "Hardware").length;
  const totalSubmissions = psData.reduce(
    (sum, r) => sum + (r.ideas_submitted || 0),
    0
  );
  const fills = psData.map((r) => r.fill_percentage || 0);
  const avgFill =
    fills.length > 0
      ? Math.round((fills.reduce((s, f) => s + f, 0) / fills.length) * 100) / 100
      : 0;

  const compDist = { "None yet": 0, Low: 0, Medium: 0, High: 0 };
  for (const r of psData) {
    const fill = r.fill_percentage || 0;
    if (fill >= 50) compDist["High"]++;
    else if (fill >= 10) compDist["Medium"]++;
    else if (fill > 0) compDist["Low"]++;
    else compDist["None yet"]++;
  }

  const mostCrowded = psData.reduce(
    (best, r) =>
      (r.fill_percentage || 0) > (best?.fill_percentage || 0) ? r : best,
    psData[0]
  );

  let hiddenGemCount = 0;
  for (const r of psData) {
    if (r.opportunity_category === "HIDDEN GEM") hiddenGemCount++;
  }

  return {
    total_ps: total,
    software_count: software,
    hardware_count: hardware,
    total_submissions: totalSubmissions,
    average_fill: avgFill,
    competition_distribution: compDist,
    most_crowded: mostCrowded
      ? {
          ps_number: mostCrowded.ps_number,
          title: mostCrowded.title,
          fill_percentage: mostCrowded.fill_percentage,
        }
      : null,
    fastest_growing: null,
    hidden_gem_count: hiddenGemCount,
  };
}

/**
 * Recompute theme saturation from updated PS data.
 */
function recomputeThemes(psData) {
  const themeMap = {};
  for (const r of psData) {
    const theme = r.theme || "Unknown";
    if (!themeMap[theme]) {
      themeMap[theme] = {
        theme,
        ps_count: 0,
        total_submissions: 0,
        avg_fill: 0,
        fills: [],
        categories: {},
      };
    }
    const t = themeMap[theme];
    t.ps_count++;
    t.total_submissions += r.ideas_submitted || 0;
    t.fills.push(r.fill_percentage || 0);

    const cat = r.category || "Other";
    t.categories[cat] = (t.categories[cat] || 0) + 1;
  }

  return Object.values(themeMap).map((t) => {
    const avgFill =
      t.fills.length > 0
        ? Math.round((t.fills.reduce((s, f) => s + f, 0) / t.fills.length) * 100) / 100
        : 0;
    return {
      theme: t.theme,
      ps_count: t.ps_count,
      total_submissions: t.total_submissions,
      avg_fill: avgFill,
      saturation_level:
        avgFill >= 50 ? "High" : avgFill >= 10 ? "Medium" : avgFill > 0 ? "Low" : "None yet",
      categories: t.categories,
    };
  });
}

/**
 * Recompute trends from updated PS data and live counts.
 */
function recomputeTrends(psData, fallbackTrends, liveCounts) {
  if (!liveCounts || liveCounts.size === 0) return fallbackTrends;

  const movers = [];
  for (const ps of psData) {
    const live = liveCounts.get(ps.ps_number);
    if (!live) {
      // Keep existing if no live data
      const existing = fallbackTrends.biggest_movers?.find(m => m.ps_number === ps.ps_number);
      if (existing) movers.push(existing);
      continue;
    }

    const fallbackSub = ps.ideas_submitted || 0;
    const fallbackGrowth = ps.velocity?.growth_24h ?? ps.velocity?.growth_7d ?? 0;
    const liveSub = live.submitted;
    
    // Approximate new growth: previous growth + (live submissions - previous submissions)
    const newGrowth = Math.max(0, fallbackGrowth + (liveSub - fallbackSub));

    if (newGrowth > 0) {
      movers.push({
        ps_number: ps.ps_number,
        title: ps.title,
        growth: newGrowth,
        period: ps.velocity?.growth_24h !== undefined ? "24h" : "7d",
        current_submitted: liveSub,
        fill_percentage: live.capacity > 0 ? Math.round((100 * liveSub) / live.capacity * 100) / 100 : 0
      });
    }
  }

  // Sort by highest growth
  movers.sort((a, b) => b.growth - a.growth);

  return {
    ...fallbackTrends,
    biggest_movers: movers.slice(0, 10)
  };
}

export {
  fetchLiveSubmissionCounts,
  mergeliveCounts,
  recomputeKpis,
  recomputeThemes,
  recomputeTrends,
};
