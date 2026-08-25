"use client";
import Link from "next/link";

function getOppBadgeClass(cat) {
  const map = {
    "HOT": "badge-hot",
    "CROWDED": "badge-crowded",
    "EMERGING": "badge-emerging",
    "HIDDEN GEM": "badge-hidden",
    "WATCH": "badge-watch",
  };
  return map[cat] || "badge-none";
}

export default function TopProblemStatements({ psData }) {
  if (!psData || psData.length === 0) return null;

  // Sort by fill_percentage descending, take top 5
  const top = [...psData]
    .sort((a, b) => b.fill_percentage - a.fill_percentage)
    .slice(0, 5);

  return (
    <div className="card" style={{ padding: "20px 0" }}>
      <div className="card-header" style={{ padding: "0 20px", marginBottom: "12px" }}>
        <span className="card-title">Top Problem Statements</span>
      </div>

      <div className="ps-table-wrap">
        <table className="ps-mini-table">
          <thead>
            <tr>
              <th>PS No.</th>
              <th>Title</th>
              <th>Organization</th>
              <th>Category</th>
              <th>Fill %</th>
              <th>24h Growth</th>
              <th>Days Left</th>
              <th>Competition</th>
            </tr>
          </thead>
          <tbody>
            {top.map((ps) => (
              <tr key={ps.ps_number}>
                <td style={{ fontWeight: 700 }}>
                  <Link href={`/ps/${ps.ps_number}`}>
                    {ps.sno || ps.ps_number.replace("SIH26", "")}
                  </Link>
                </td>
                <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ps.title?.length > 35 ? ps.title.slice(0, 35) + "…" : ps.title}
                </td>
                <td style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {ps.organization?.length > 25 ? ps.organization.slice(0, 25) + "…" : ps.organization}
                </td>
                <td>
                  <span style={{ fontSize: "0.78rem" }}>{ps.category}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{ps.fill_percentage}%</td>
                <td style={{ color: "var(--green)", fontWeight: 600 }}>
                  +{ps.velocity?.growth_24h || 0}
                </td>
                <td>{ps.days_remaining ?? "—"}</td>
                <td>
                  <span className={`badge ${getOppBadgeClass(ps.opportunity_category)}`}>
                    {ps.opportunity_category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "14px 20px 0", textAlign: "center" }}>
        <a href="/ps" className="card-link" style={{ justifyContent: "center" }}>
          View all problem statements
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
