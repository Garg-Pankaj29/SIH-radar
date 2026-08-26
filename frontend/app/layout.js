import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "SIH Opportunity Radar — Competition Intelligence for SIH 2026",
  description:
    "See the competition. Track the momentum. Find the opportunity. An intelligence dashboard for Smart India Hackathon 2026 problem statement analysis.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
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
