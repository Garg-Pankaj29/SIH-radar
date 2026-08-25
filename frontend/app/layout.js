import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "SIH Radar — Competition Intelligence for SIH 2026",
  description:
    "Track competition. Find opportunity. An intelligence dashboard for Smart India Hackathon 2026 problem statement analysis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
