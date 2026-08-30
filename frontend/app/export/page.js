"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import { exportCSV } from "../../lib/utils";
import { LuDownload, LuDatabase, LuStar, LuGitCompare } from "react-icons/lu";

function ExportContent() {
  const { psData, watchlist, compareList, getPS, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title="Reports & Export Center" subtitle="Download comprehensive intelligence datasets">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Export Center...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Reports & Export Center" subtitle="Download comprehensive intelligence datasets">
        <div className="error-state">Failed to load export data: {error}</div>
      </AppShell>
    );
  }

  const watchedData = watchlist.map((id) => getPS(id)).filter(Boolean);
  const comparedData = compareList.map((id) => getPS(id)).filter(Boolean);

  return (
    <AppShell
      title="Reports & Export Center"
      subtitle="Download comprehensive intelligence reports in CSV format for team distribution or custom analysis."
    >
      <div className="export-grid">
        {/* All PS Export */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>
              <LuDatabase size={20} color="var(--accent-light)" />
              <span>Full Dataset Report</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.6" }}>
              Complete breakdown of all 226 SIH 2026 problem statements including submissions, fill %, competition, opportunity signals, and tech tags.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => exportCSV(psData, "SIH_2026_All_Problem_Statements.csv")}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%" }}
          >
            <LuDownload size={15} />
            <span>Download All PSs (CSV)</span>
          </button>
        </div>

        {/* Watchlist Export */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>
              <LuStar size={20} color="var(--accent-warm)" />
              <span>Candidate Watchlist</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.6" }}>
              Download your team&apos;s shortlisted candidate problem statements ({watchedData.length} saved).
            </p>
          </div>
          <button
            className="btn btn-secondary"
            disabled={watchedData.length === 0}
            onClick={() => exportCSV(watchedData, "SIH_Watchlist_Report.csv")}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%" }}
          >
            <LuDownload size={15} />
            <span>{watchedData.length === 0 ? "Watchlist Empty" : `Download Watchlist (${watchedData.length})`}</span>
          </button>
        </div>

        {/* Comparison Export */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem", fontWeight: "800", marginBottom: "8px" }}>
              <LuGitCompare size={20} color="var(--cyan)" />
              <span>Side-by-Side Comparison</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.6" }}>
              Download selected comparison matrix records ({comparedData.length} selected).
            </p>
          </div>
          <button
            className="btn btn-secondary"
            disabled={comparedData.length === 0}
            onClick={() => exportCSV(comparedData, "SIH_Comparison_Report.csv")}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%" }}
          >
            <LuDownload size={15} />
            <span>{comparedData.length === 0 ? "No Items Selected" : `Download Comparison (${comparedData.length})`}</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(ExportContent), { ssr: false });

export default function ExportPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
