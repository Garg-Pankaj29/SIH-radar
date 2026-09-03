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
const FETCH_TIMEOUT_MS = 15000;

// In-memory cache to avoid hammering sih.gov.in on every request
let cachedCounts = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch live submission counts from sih.gov.in.
 * Returns a Map of ps_number → { submitted, capacity }.
 * Returns null on failure.
 */
async function fetchLiveSubmissionCounts() {
  // Return cached data if still fresh
  const now = Date.now();
  if (cachedCounts && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedCounts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(SIH_GOV_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`sih.gov.in returned ${res.status}`);
      return cachedCounts; // return stale cache if available
    }

    const html = await res.text();

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
      console.log(
        `Live counts: ${counts.size} PS fetched from sih.gov.in`
      );
    }

    return counts.size > 0 ? counts : cachedCounts;
  } catch (e) {
    console.warn("Could not fetch live counts from sih.gov.in:", e.message);
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
      ? Math.round((fills.reduce((s, f) => s + f, 0) / fills.length) * 10) / 10
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
        ? Math.round((t.fills.reduce((s, f) => s + f, 0) / t.fills.length) * 10) / 10
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

export {
  fetchLiveSubmissionCounts,
  mergeliveCounts,
  recomputeKpis,
  recomputeThemes,
};
