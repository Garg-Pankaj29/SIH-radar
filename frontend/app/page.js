"use client";
import dynamic from "next/dynamic";
import { DataProvider } from "../lib/DataContext";

// Dynamic import with ssr: false prevents hydration mismatches
const DashboardContent = dynamic(() => import("../components/DashboardContent"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
