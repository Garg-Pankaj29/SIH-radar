import fallbackData from "@/data/api/problem_statements.json";

/**
 * API Proxy: /api/ps → backend /api/problem_statements.json
 * Hides the real backend URL from the client bundle.
 * Falls back to bundled static dataset if backend is unreachable or not configured.
 */
export async function GET() {
  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/problem_statements.json`, {
        next: { revalidate: 60 },
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json(data, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        });
      }
    } catch (e) {
      console.warn("Backend unreachable, serving bundled data fallback:", e.message);
    }
  }

  return Response.json(fallbackData, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
