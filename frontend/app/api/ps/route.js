import fallbackData from "@/data/api/problem_statements.json";
import { fetchLiveSubmissionCounts, mergeliveCounts } from "@/lib/fetchLiveCounts";

/**
 * API Proxy: /api/ps → backend /api/problem_statements.json
 * Hides the real backend URL from the client bundle.
 *
 * Live count merging:
 *   When returning data (from backend or fallback), we also scrape live
 *   submission counts from sih.gov.in and merge them in.  This ensures
 *   the client always sees the most up-to-date idea counts — regardless
 *   of whether the backend has stale data or is offline.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const region = process.env.VERCEL_REGION || "local";
  const ts = new Date().toISOString();
  console.log(`[${ts}] [region=${region}] /api/ps — handler invoked`);

  let psData = null;

  // Try backend first
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/problem_statements.json`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        psData = await res.json();
        console.log(`[${ts}] [region=${region}] /api/ps — backend returned ${Array.isArray(psData) ? psData.length : 0} PS`);
      }
    } catch (e) {
      console.warn(`[${ts}] [region=${region}] /api/ps — backend unreachable: ${e.message}`);
    }
  }

  // Fall back to bundled data
  if (!psData) {
    psData = Array.isArray(fallbackData) ? [...fallbackData] : [];
    console.log(`[${ts}] [region=${region}] /api/ps — using bundled fallback (${psData.length} PS)`);
  }

  // Merge live submission counts from sih.gov.in (or fallback to bundled data)
  try {
    let liveCounts = await fetchLiveSubmissionCounts();
    
    // If live scrape failed (e.g. Vercel WAF block), use the counts baked into fallbackData
    if (!liveCounts || liveCounts.size === 0) {
      liveCounts = new Map();
      if (Array.isArray(fallbackData)) {
        for (const item of fallbackData) {
          if (item.ideas_submitted > 0) {
            liveCounts.set(item.ps_number, {
              submitted: item.ideas_submitted,
              capacity: item.submission_capacity || 500
            });
          }
        }
      }
      console.log(`[${ts}] [region=${region}] /api/ps — live scrape failed, using ${liveCounts.size} bundled counts`);
    }

    if (liveCounts && liveCounts.size > 0) {
      psData = mergeliveCounts(psData, liveCounts);
    }
  } catch (e) {
    console.warn(`[${ts}] [region=${region}] /api/ps — live count merge failed: ${e.message}`);
  }

  return Response.json(psData, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
