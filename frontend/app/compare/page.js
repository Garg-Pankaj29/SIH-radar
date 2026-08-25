"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";
import { getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";
import { LuTrash2, LuPlus, LuGitCompare } from "react-icons/lu";

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

  const comparedPS = compareList.map((id) => getPS(id)).filter(Boolean);

  return (
    <AppShell
      title="Problem Statement Comparison"
      subtitle="Side-by-side metric breakdown for up to 5 candidate problem statements"
      actions={
        comparedPS.length > 0 ? (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => comparedPS.forEach((p) => toggleCompare(p.ps_number))}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <LuTrash2 size={14} />
            <span>Clear All ({comparedPS.length})</span>
          </button>
        ) : null
      }
    >
      {comparedPS.length === 0 ? (
        <div className="card empty-state" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ display: "inline-flex", padding: "16px", background: "var(--bg-elevated)", borderRadius: "50%", marginBottom: "16px", color: "var(--accent-light)" }}>
            <LuGitCompare size={36} />
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
            No problem statements selected for comparison
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "440px", margin: "0 auto 20px", lineHeight: "1.6" }}>
            Click <strong>"+ Add"</strong> on any problem statement in the table or detail page to compare up to 5 candidate statements side by side.
          </p>
          <Link href="/ps" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <LuPlus size={16} />
            <span>Browse Problem Statements</span>
          </Link>
        </div>
      ) : (
        <div className="table-wrap" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ minWidth: "180px" }}>Metric</th>
                {comparedPS.map((p) => (
                  <th key={p.ps_number} style={{ minWidth: "220px" }}>
                    <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "var(--accent-light)" }}>
                      {p.ps_number}
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleCompare(p.ps_number)}
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--red)",
                        marginTop: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <LuTrash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: "600" }}>Title</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number} style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                    <Link href={`/ps/${p.ps_number}`}>{p.title}</Link>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Category</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number}>
                    <span className={`badge ${p.category === "Software" ? "badge-software" : "badge-hardware"}`}>
                      {p.category}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Organization</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number} style={{ fontSize: "0.82rem" }}>
                    {p.organization}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Submissions Filled</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number} style={{ fontWeight: "800" }}>
                    {p.ideas_submitted} / 500 ({p.fill_percentage}%)
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Competition Level</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number}>
                    <span className={`badge ${getCompBadgeClass(p.competition_level)}`}>
                      {p.competition_level}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Opportunity Signal</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number}>
                    <span className={`badge ${getOppBadgeClass(p.opportunity_category)}`}>
                      {p.opportunity_category}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Opportunity Score</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number} style={{ fontWeight: "800", color: "var(--accent-light)" }}>
                    {p.opportunity_score} / 100
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Complexity Level</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number}>{p.prototype_complexity?.level || "Medium"}</td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Resource Availability</td>
                {comparedPS.map((p) => (
                  <td key={p.ps_number} style={{ fontWeight: "600" }}>
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
