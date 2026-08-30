/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.vercel.app https://vercel.live",
              "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live https://*.vercel.app https://*.pusher.com wss://*.pusher.com https://*.onrender.com",
              "frame-src 'self' https://vercel.live",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
