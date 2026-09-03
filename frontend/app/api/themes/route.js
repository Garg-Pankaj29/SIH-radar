import fallbackThemes from "@/data/api/themes.json";
import fallbackPs from "@/data/api/problem_statements.json";
import {
  fetchLiveSubmissionCounts,
  mergeliveCounts,
  recomputeThemes,
} from "@/lib/fetchLiveCounts";

/**
 * API Proxy: /api/themes → backend /api/themes.json
 * Hides the real backend URL from the client bundle.
 *
 * When live counts are available from sih.gov.in, we recompute theme
 * saturation on-the-fly from the live-merged PS data.
 */
export async function GET() {
  let themes = null;

  // Try backend first
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/themes.json`, {
        next: { revalidate: 60 },
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        themes = await res.json();
      }
    } catch (e) {
      console.warn("Backend unreachable, serving bundled data fallback:", e.message);
    }
  }

  // Try to recompute Theme stats with live counts
  try {
    let liveCounts = await fetchLiveSubmissionCounts();
    
    // If live scrape failed (e.g. Vercel WAF block), use the counts baked into fallbackPs
    if (!liveCounts || liveCounts.size === 0) {
      liveCounts = new Map();
      if (Array.isArray(fallbackPs)) {
        for (const item of fallbackPs) {
          if (item.ideas_submitted > 0) {
            liveCounts.set(item.ps_number, {
              submitted: item.ideas_submitted,
              capacity: item.submission_capacity || 500
            });
          }
        }
      }
    }

    if (liveCounts && liveCounts.size > 0) {
      // Merge live counts into PS data and recompute Themes
      const basePsData = Array.isArray(fallbackPs) ? [...fallbackPs] : [];
      const livePs = mergeliveCounts(basePsData, liveCounts);
      
      const liveThemesList = recomputeThemes(livePs);
      
      // Convert list back to object map { "Theme Name": { ... } }
      const liveThemesMap = {};
      for (const t of liveThemesList) {
        liveThemesMap[t.theme] = t;
      }
      themes = liveThemesMap;
    }
  } catch (e) {
    console.warn("Live Themes recomputation failed:", e.message);
  }

  // Final fallback
  const finalThemes = themes || fallbackThemes;

  return Response.json(finalThemes, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
