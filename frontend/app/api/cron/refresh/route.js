import { fetchLiveSubmissionCounts } from "@/lib/fetchLiveCounts";

/**
 * Vercel Cron Handler: /api/cron/refresh
 * Called hourly by Vercel's cron scheduler.
 * 
 * Attempts to scrape sih.gov.in for live submission counts.
 * This pre-warms the in-memory cache so subsequent user requests
 * get fresh data without each request needing to scrape.
 * 
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

export async function GET(request) {
  const region = process.env.VERCEL_REGION || "local";
  const ts = new Date().toISOString();

  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn(`[${ts}] [region=${region}] /api/cron/refresh — unauthorized request`);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`[${ts}] [region=${region}] /api/cron/refresh — cron triggered`);

  try {
    const liveCounts = await fetchLiveSubmissionCounts();
    
    if (liveCounts && liveCounts.size > 0) {
      const totalSubs = [...liveCounts.values()].reduce((s, v) => s + v.submitted, 0);
      console.log(`[${ts}] [region=${region}] /api/cron/refresh — SUCCESS: ${liveCounts.size} PS, ${totalSubs} total submissions cached`);
      return Response.json({
        status: "success",
        ps_count: liveCounts.size,
        total_submissions: totalSubs,
        timestamp: ts,
        region,
      });
    } else {
      console.warn(`[${ts}] [region=${region}] /api/cron/refresh — scrape returned empty. Data will use bundled fallback.`);
      return Response.json({
        status: "fallback",
        message: "Live scrape failed, using bundled data",
        timestamp: ts,
        region,
      });
    }
  } catch (e) {
    console.error(`[${ts}] [region=${region}] /api/cron/refresh — ERROR: ${e.message}`);
    return Response.json({
      status: "error",
      message: e.message,
      timestamp: ts,
      region,
    }, { status: 500 });
  }
}
