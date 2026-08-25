"use client";
import dynamic from "next/dynamic";
import { DataProvider } from "../lib/DataContext";

// Disable SSR for the entire dashboard — all data is fetched client-side
// and this prevents hydration mismatches from browser extensions (Dark Reader)
// injecting attributes into SVG elements before React hydrates.
const DashboardContent = dynamic(() => import("../components/DashboardContent"), { ssr: false });

export default function Dashboard() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
