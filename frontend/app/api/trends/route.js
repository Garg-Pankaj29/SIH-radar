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
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const region = process.env.VERCEL_REGION || "local";
  const ts = new Date().toISOString();
  console.log(`[${ts}] [region=${region}] /api/trends — handler invoked`);

  let trends = null;

  // Try backend first
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/trends.json`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        trends = await res.json();
      }
    } catch (e) {
      console.warn(`[${ts}] [region=${region}] /api/trends — backend unreachable: ${e.message}`);
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
    console.warn(`[${ts}] [region=${region}] /api/trends — live Trends recomputation failed: ${e.message}`);
  }

  // Final fallback
  const finalTrends = trends || fallbackTrends;

  return Response.json(finalTrends, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
