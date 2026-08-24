"use client";
import { DataProvider, useData } from "../../lib/DataContext";
import Header from "../../components/Header";
import Link from "next/link";
import { getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";

function CompareContent() {
  const { compareList, toggleCompare, getPS, loading } = useData();

  if (loading) return <div className="container page">Loading Comparison...</div>;

  const comparedPS = compareList.map(id => getPS(id)).filter(Boolean);

  return (
    <>
      <Header />
      <main className="container page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 className="page-title">⚔️ Problem Statement Comparison</h1>
            <p className="page-subtitle">
              Side-by-side metric breakdown for up to 5 candidate problem statements
            </p>
          </div>
          {comparedPS.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => comparedPS.forEach(p => toggleCompare(p.ps_number))}>
              Clear All ({comparedPS.length})
            </button>
          )}
        </div>

        {comparedPS.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">⚔️</div>
            <div className="empty-state-text">No problem statements selected for comparison.</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Click <strong>"+ Add"</strong> on any problem statement card or table row on the dashboard to compare.
            </p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Go to Dashboard</Link>
          </div>
        ) : (
          <div className="table-wrap" style={{ overflowX: 'auto' }}>
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '180px' }}>Metric</th>
                  {comparedPS.map(p => (
                    <th key={p.ps_number} style={{ minWidth: '220px' }}>
                      <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--accent-light)' }}>{p.ps_number}</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleCompare(p.ps_number)} style={{ fontSize: '0.7rem', color: 'var(--red)' }}>
                        ✕ Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Title</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number} style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                      <Link href={`/ps/${p.ps_number}`}>{p.title}</Link>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Category</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number}>
                      <span className={`badge ${p.category === 'Software' ? 'badge-software' : 'badge-hardware'}`}>{p.category}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Organization</td>
                  {comparedPS.map(p => <td key={p.ps_number} style={{ fontSize: '0.8rem' }}>{p.organization}</td>)}
                </tr>
                <tr>
                  <td>Submissions Filled</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number} style={{ fontWeight: '800' }}>
                      {p.ideas_submitted} / 500 ({p.fill_percentage}%)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Competition Level</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number}>
                      <span className={`badge ${getCompBadgeClass(p.competition_level)}`}>{p.competition_level}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Opportunity Signal</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number}>
                      <span className={`badge ${getOppBadgeClass(p.opportunity_category)}`}>{p.opportunity_category}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Opportunity Score</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number} style={{ fontWeight: '800', color: 'var(--accent-light)' }}>
                      {p.opportunity_score} / 100
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Complexity Level</td>
                  {comparedPS.map(p => <td key={p.ps_number}>{p.prototype_complexity?.level || "Medium"}</td>)}
                </tr>
                <tr>
                  <td>Resource Completeness</td>
                  {comparedPS.map(p => (
                    <td key={p.ps_number} style={{ fontWeight: '600' }}>
                      {p.resources?.score} / {p.resources?.total}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

export default function ComparePage() {
  return (
    <DataProvider>
      <CompareContent />
    </DataProvider>
  );
}
