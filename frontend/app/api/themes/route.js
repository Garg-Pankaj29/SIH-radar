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

  // Try to recompute themes with live counts
  try {
    const liveCounts = await fetchLiveSubmissionCounts();
    if (liveCounts && liveCounts.size > 0) {
      const basePsData = Array.isArray(fallbackPs) ? [...fallbackPs] : [];
      const livePs = mergeliveCounts(basePsData, liveCounts);
      themes = recomputeThemes(livePs);
    }
  } catch (e) {
    console.warn("Live theme recomputation failed:", e.message);
  }

  // Final fallback
  if (!themes) {
    themes = fallbackThemes;
  }

  return Response.json(themes, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
