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
export async function GET() {
  let psData = null;

  // Try backend first
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/problem_statements.json`, {
        next: { revalidate: 60 },
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        psData = await res.json();
      }
    } catch (e) {
      console.warn("Backend unreachable, serving bundled data fallback:", e.message);
    }
  }

  // Fall back to bundled data
  if (!psData) {
    psData = Array.isArray(fallbackData) ? [...fallbackData] : [];
  }

  // Merge live submission counts from sih.gov.in
  try {
    const liveCounts = await fetchLiveSubmissionCounts();
    if (liveCounts && liveCounts.size > 0) {
      psData = mergeliveCounts(psData, liveCounts);
    }
  } catch (e) {
    console.warn("Live count merge failed:", e.message);
  }

  return Response.json(psData, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
