"use client";
import { DataProvider, useData } from "../../lib/DataContext";
import Header from "../../components/Header";
import PSTable from "../../components/PSTable";
import Link from "next/link";
import { IconStar } from "../../components/Icons";

function WatchlistContent() {
  const { watchlist, getPS, loading } = useData();

  if (loading) return <div className="container page">Loading Watchlist...</div>;

  const watchedData = watchlist.map(id => getPS(id)).filter(Boolean);

  return (
    <>
      <Header />
      <main className="container page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 className="page-title"><IconStar size={22} className="icon-inline" /> Candidate Watchlist</h1>
            <p className="page-subtitle">
              Bookmarked problem statements with real-time submission &amp; velocity tracking ({watchedData.length} saved)
            </p>
          </div>
        </div>

        {watchedData.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon"><IconStar size={48} /></div>
            <div className="empty-state-text">Your watchlist is currently empty.</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Click the star icon next to any problem statement on the dashboard to bookmark it.
            </p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Problem Statements</Link>
          </div>
        ) : (
          <PSTable data={watchedData} />
        )}
      </main>
    </>
  );
}

export default function WatchlistPage() {
  return (
    <DataProvider>
      <WatchlistContent />
    </DataProvider>
  );
}
