"use client";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

function getOppBadgeClass(cat) {
  const map = {
    HOT: "badge-hot",
    CROWDED: "badge-crowded",
    EMERGING: "badge-emerging",
    "HIDDEN GEM": "badge-hidden",
    WATCH: "badge-watch",
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
              <th style={{ width: "60px" }}>PS No.</th>
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
                <td style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <Link href={`/ps/${ps.ps_number}`} style={{ color: "inherit" }}>
                    {ps.title?.length > 40 ? ps.title.slice(0, 40) + "…" : ps.title}
                  </Link>
                </td>
                <td style={{ fontSize: "0.78rem", color: "var(--text-secondary)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ps.organization?.length > 25 ? ps.organization.slice(0, 25) + "…" : ps.organization}
                </td>
                <td>
                  <span className={`badge ${ps.category === "Software" ? "badge-software" : "badge-hardware"}`}>
                    {ps.category}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{ps.fill_percentage}%</td>
                <td style={{ color: "var(--green)", fontWeight: 600 }}>
                  +{ps.velocity?.growth_24h || 0}
                </td>
                <td>{ps.days_remaining !== null ? `${ps.days_remaining}d` : "—"}</td>
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
        <Link href="/ps" className="card-link" style={{ justifyContent: "center" }}>
          <span>View all problem statements</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
