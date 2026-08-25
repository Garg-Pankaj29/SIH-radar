/**
 * API Proxy: /api/metadata → backend /api/metadata.json
 * Hides the real backend URL from the client bundle.
 */
export async function GET() {
  const backend = process.env.API_BACKEND_URL;
  if (!backend) {
    return Response.json({ error: "Backend not configured" }, { status: 503 });
  }
  try {
    const res = await fetch(`${backend}/api/metadata.json`, {
      next: { revalidate: 60 },
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) {
      return Response.json({ error: "Upstream error" }, { status: res.status });
    }
    const data = await res.json();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (e) {
    return Response.json({ error: "Failed to reach backend" }, { status: 502 });
  }
}
