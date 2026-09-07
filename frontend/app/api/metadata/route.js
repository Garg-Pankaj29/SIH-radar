import fallbackData from "@/data/api/metadata.json";

/**
 * API Proxy: /api/metadata → backend /api/metadata.json
 * Hides the real backend URL from the client bundle.
 * Falls back to bundled static dataset if backend is unreachable or not configured.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const region = process.env.VERCEL_REGION || "local";
  const ts = new Date().toISOString();
  console.log(`[${ts}] [region=${region}] /api/metadata — handler invoked`);

  const backend = process.env.API_BACKEND_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend}/api/metadata.json`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json(data, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
          },
        });
      }
    } catch (e) {
      console.warn(`[${ts}] [region=${region}] /api/metadata — backend unreachable: ${e.message}`);
    }
  }

  return Response.json(fallbackData, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}
