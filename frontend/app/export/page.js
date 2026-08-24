"use client";
import { DataProvider, useData } from "../../lib/DataContext";
import Header from "../../components/Header";
import { exportCSV } from "../../lib/utils";

function ExportContent() {
  const { psData, watchlist, compareList, getPS, loading } = useData();

  if (loading) return <div className="container page">Loading Export Center...</div>;

  const watchedData = watchlist.map(id => getPS(id)).filter(Boolean);
  const comparedData = compareList.map(id => getPS(id)).filter(Boolean);

  return (
    <>
      <Header />
      <main className="container page">
        <div style={{ marginBottom: '24px' }}>
          <h1 className="page-title">📥 Export &amp; Reporting Center</h1>
          <p className="page-subtitle">
            Download comprehensive intelligence reports in CSV and JSON formats for team distribution or custom analysis.
          </p>
        </div>

        <div className="grid-3">
          {/* All PS Export */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>📊 Full Dataset Report</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Complete breakdown of all 226 SIH 2026 problem statements including submissions, fill %, competition, opportunity signals, and tech tags.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => exportCSV(psData, "SIH_2026_All_Problem_Statements.csv")}>
              ⬇ Download All PSs (CSV)
            </button>
          </div>

          {/* Watchlist Export */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>⭐ Candidate Watchlist</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Download your team's shortlisted candidate problem statements ({watchedData.length} saved).
              </p>
            </div>
            <button
              className="btn btn-secondary"
              disabled={watchedData.length === 0}
              onClick={() => exportCSV(watchedData, "SIH_Watchlist_Report.csv")}
            >
              {watchedData.length === 0 ? "Watchlist Empty" : `⬇ Download Watchlist (${watchedData.length})`}
            </button>
          </div>

          {/* Comparison Export */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>⚔️ Side-by-Side Comparison</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Download selected comparison matrix records ({comparedData.length} selected).
              </p>
            </div>
            <button
              className="btn btn-secondary"
              disabled={comparedData.length === 0}
              onClick={() => exportCSV(comparedData, "SIH_Comparison_Report.csv")}
            >
              {comparedData.length === 0 ? "No Items Selected" : `⬇ Download Comparison (${comparedData.length})`}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ExportPage() {
  return (
    <DataProvider>
      <ExportContent />
    </DataProvider>
  );
}
