import fallbackTrends from "@/data/api/trends.json";
import fallbackPs from "@/data/api/problem_statements.json";
import {
  fetchLiveSubmissionCounts,
  recomputeTrends,
} from "@/lib/fetchLiveCounts";

/**
 * API Proxy: /api/trends → backend /api/trends.json
 * Hides the real backend URL from the client bundle.
 *
 * When live counts are available from sih.gov.in, we recompute trends
 * on-the-fly to show up-to-date 24h growth and biggest movers.
 */
export async function GET() {
  let trends = null;

  // Try backend first
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/trends.json`, {
        next: { revalidate: 60 },
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        trends = await res.json();
      }
    } catch (e) {
      console.warn("Backend unreachable, serving bundled data fallback:", e.message);
    }
  }

  // Try to recompute Trends with live counts
  try {
    let liveCounts = await fetchLiveSubmissionCounts();
    
    // If live scrape failed, use the counts baked into fallbackPs
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
      const basePsData = Array.isArray(fallbackPs) ? [...fallbackPs] : [];
      const baseTrends = trends || fallbackTrends;
      trends = recomputeTrends(basePsData, baseTrends, liveCounts);
    }
  } catch (e) {
    console.warn("Live Trends recomputation failed:", e.message);
  }

  // Final fallback
  const finalTrends = trends || fallbackTrends;

  return Response.json(finalTrends, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
