"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import PSTable from "../../components/PSTable";
import Link from "next/link";

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

  const watchedData = watchlist.map(id => getPS(id)).filter(Boolean);

  return (
    <AppShell
      title="Candidate Watchlist"
      subtitle={`Bookmarked problem statements with real-time submission & velocity tracking (${watchedData.length} saved)`}
    >
      {watchedData.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Your watchlist is currently empty
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
            Click the bookmark or star icon next to any problem statement in the dashboard or table to shortlist it for your team.
          </p>
          <Link href="/ps" className="btn btn-primary">Browse Problem Statements</Link>
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
