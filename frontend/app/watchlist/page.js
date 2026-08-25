"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import PSTable from "../../components/PSTable";
import Link from "next/link";
import { LuBookmark, LuPlus } from "react-icons/lu";

function WatchlistContent() {
  const { watchlist, getPS, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title="Candidate Watchlist" subtitle="Bookmarked problem statements">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Watchlist...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Candidate Watchlist" subtitle="Bookmarked problem statements">
        <div className="error-state">Failed to load watchlist: {error}</div>
      </AppShell>
    );
  }

  const watchedData = watchlist.map((id) => getPS(id)).filter(Boolean);

  return (
    <AppShell
      title="Candidate Watchlist"
      subtitle={`Bookmarked problem statements with real-time submission & velocity tracking (${watchedData.length} saved)`}
    >
      {watchedData.length === 0 ? (
        <div className="card empty-state" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ display: "inline-flex", padding: "16px", background: "var(--bg-elevated)", borderRadius: "50%", marginBottom: "16px", color: "var(--accent-light)" }}>
            <LuBookmark size={36} />
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
            Your watchlist is currently empty
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "440px", margin: "0 auto 20px", lineHeight: "1.6" }}>
            Click the star or bookmark icon next to any problem statement in the table or detail page to shortlist it for your team.
          </p>
          <Link href="/ps" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <LuPlus size={16} />
            <span>Browse Problem Statements</span>
          </Link>
        </div>
      ) : (
        <PSTable data={watchedData} />
      )}
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(WatchlistContent), { ssr: false });

export default function WatchlistPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
