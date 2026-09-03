import fallbackKpis from "@/data/api/kpis.json";
import fallbackPs from "@/data/api/problem_statements.json";
import {
  fetchLiveSubmissionCounts,
  mergeliveCounts,
  recomputeKpis,
} from "@/lib/fetchLiveCounts";

/**
 * API Proxy: /api/kpis → backend /api/kpis.json
 * Hides the real backend URL from the client bundle.
 *
 * When live counts are available from sih.gov.in, we recompute KPIs
 * on-the-fly from the live-merged PS data so total_submissions,
 * average_fill, and competition_distribution are always current.
 */
export async function GET() {
  let kpis = null;

  // Try backend first
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/kpis.json`, {
        next: { revalidate: 60 },
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        kpis = await res.json();
      }
    } catch (e) {
      console.warn("Backend unreachable, serving bundled data fallback:", e.message);
    }
  }

  // Try to recompute KPIs with live counts
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
      // Merge live counts into PS data and recompute KPIs
      const basePsData = Array.isArray(fallbackPs) ? [...fallbackPs] : [];
      const livePs = mergeliveCounts(basePsData, liveCounts);
      const liveKpis = recomputeKpis(livePs);

      // Preserve any extra fields from backend/fallback KPIs (fastest_growing, etc.)
      if (kpis) {
        kpis = { ...kpis, ...liveKpis };
      } else {
        kpis = { ...fallbackKpis, ...liveKpis };
      }
    }
  } catch (e) {
    console.warn("Live KPI recomputation failed:", e.message);
  }

  // Final fallback
  if (!kpis) {
    kpis = fallbackKpis;
  }

  return Response.json(kpis, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
