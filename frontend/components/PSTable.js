"use client";
import { useState } from "react";
import Link from "next/link";
import { useData } from "../lib/DataContext";
import { getCompBadgeClass, getOppBadgeClass, getFillClass, truncate } from "../lib/utils";

export default function PSTable({ data }) {
  const { watchlist, toggleWatchlist, compareList, toggleCompare } = useData();
  const [sortField, setSortField] = useState("fill_percentage");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    let va = a[sortField];
    let vb = b[sortField];
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();

    if (va < vb) return sortOrder === "asc" ? -1 : 1;
    if (va > vb) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>★</th>
              <th onClick={() => handleSort("ps_number")}>
                PS # {sortField === "ps_number" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("title")}>
                Title {sortField === "title" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("category")}>Category</th>
              <th onClick={() => handleSort("theme")}>Theme</th>
              <th onClick={() => handleSort("ideas_submitted")}>
                Submissions {sortField === "ideas_submitted" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("fill_percentage")}>
                Fill % {sortField === "fill_percentage" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("competition_level")}>Competition</th>
              <th onClick={() => handleSort("opportunity_category")}>Opportunity Signal</th>
              <th onClick={() => handleSort("days_remaining")}>Deadline</th>
              <th style={{ width: '60px' }}>Compare</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="11" className="empty-state">
                  No problem statements match the selected criteria.
                </td>
              </tr>
            ) : (
              pageData.map((r) => {
                const isSaved = watchlist.includes(r.ps_number);
                const isCompared = compareList.includes(r.ps_number);

                return (
                  <tr key={r.ps_number}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`watchlist-btn ${isSaved ? "active" : ""}`}
                        onClick={() => toggleWatchlist(r.ps_number)}
                        title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                    </td>

                    <td style={{ fontWeight: '700' }}>
                      <Link href={`/ps/${r.ps_number}`}>{r.ps_number}</Link>
                    </td>

                    <td>
                      <Link href={`/ps/${r.ps_number}`} style={{ color: 'inherit' }}>
                        <span style={{ fontWeight: '600' }}>{truncate(r.title, 55)}</span>
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.organization}</div>
                    </td>

                    <td>
                      <span className={`badge ${r.category === 'Software' ? 'badge-software' : 'badge-hardware'}`}>
                        {r.category}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.theme}</td>

                    <td style={{ fontWeight: '700', textAlign: 'center' }}>
                      {r.ideas_submitted} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 500</span>
                      {r.velocity?.growth_24h > 0 && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--green)' }}>+{r.velocity.growth_24h} in 24h</div>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="fill-bar" style={{ width: '60px' }}>
                          <div
                            className={`fill-bar-inner ${getFillClass(r.fill_percentage)}`}
                            style={{ width: `${Math.min(r.fill_percentage, 100)}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{r.fill_percentage}%</span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${getCompBadgeClass(r.competition_level)}`}>
                        {r.competition_level}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${getOppBadgeClass(r.opportunity_category)}`}>
                        {r.opportunity_category}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {r.days_remaining !== null ? `${r.days_remaining}d left` : "—"}
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`btn btn-sm ${isCompared ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => toggleCompare(r.ps_number)}
                        style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                      >
                        {isCompared ? "✓ Added" : "+ Add"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
            ◀ Prev
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 8px' }}>
            Page {page} of {totalPages} ({sorted.length} records)
          </span>
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
