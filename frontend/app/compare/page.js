"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";
import { getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";

function CompareContent() {
  const { compareList, toggleCompare, getPS, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title="Compare Problem Statements" subtitle="Side-by-side metric comparison">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Comparison...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Compare Problem Statements" subtitle="Side-by-side metric comparison">
        <div className="error-state">Failed to load comparison: {error}</div>
      </AppShell>
    );
  }

  const comparedPS = compareList.map(id => getPS(id)).filter(Boolean);

  return (
    <AppShell
      title="Problem Statement Comparison"
      subtitle="Side-by-side metric breakdown for up to 5 candidate problem statements"
      actions={
        comparedPS.length > 0 ? (
          <button className="btn btn-secondary btn-sm" onClick={() => comparedPS.forEach(p => toggleCompare(p.ps_number))}>
            Clear All ({comparedPS.length})
          </button>
        ) : null
      }
    >
      {comparedPS.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No problem statements selected for comparison
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
            Click <strong>"+ Add"</strong> on any problem statement in the table or detail page to compare up to 5 candidate problem statements side by side.
          </p>
          <Link href="/ps" className="btn btn-primary">Browse Problem Statements</Link>
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
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleCompare(p.ps_number)} style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: '4px' }}>
                      ✕ Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600' }}>Title</td>
                {comparedPS.map(p => (
                  <td key={p.ps_number} style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    <Link href={`/ps/${p.ps_number}`}>{p.title}</Link>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Category</td>
                {comparedPS.map(p => (
                  <td key={p.ps_number}>
                    <span className={`badge ${p.category === 'Software' ? 'badge-software' : 'badge-hardware'}`}>{p.category}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Organization</td>
                {comparedPS.map(p => <td key={p.ps_number} style={{ fontSize: '0.82rem' }}>{p.organization}</td>)}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Submissions Filled</td>
                {comparedPS.map(p => (
                  <td key={p.ps_number} style={{ fontWeight: '800' }}>
                    {p.ideas_submitted} / 500 ({p.fill_percentage}%)
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Competition Level</td>
                {comparedPS.map(p => (
                  <td key={p.ps_number}>
                    <span className={`badge ${getCompBadgeClass(p.competition_level)}`}>{p.competition_level}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Opportunity Signal</td>
                {comparedPS.map(p => (
                  <td key={p.ps_number}>
                    <span className={`badge ${getOppBadgeClass(p.opportunity_category)}`}>{p.opportunity_category}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Opportunity Score</td>
                {comparedPS.map(p => (
                  <td key={p.ps_number} style={{ fontWeight: '800', color: 'var(--accent-light)' }}>
                    {p.opportunity_score} / 100
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Complexity Level</td>
                {comparedPS.map(p => <td key={p.ps_number}>{p.prototype_complexity?.level || "Medium"}</td>)}
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Resource Availability</td>
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
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(CompareContent), { ssr: false });

export default function ComparePage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
