"use client";
import { DataProvider, useData } from "../../../lib/DataContext";
import Header from "../../../components/Header";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCompBadgeClass, getOppBadgeClass, getFillClass } from "../../../lib/utils";

function PSDetailContent() {
  const { id } = useParams();
  const { getPS, watchlist, toggleWatchlist, compareList, toggleCompare, loading } = useData();

  if (loading) return <div className="container page">Loading...</div>;

  const ps = getPS(id);
  if (!ps) {
    return (
      <>
        <Header />
        <main className="container page" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <h2>Problem Statement {id} Not Found</h2>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Dashboard</Link>
        </main>
      </>
    );
  }

  const isSaved = watchlist.includes(ps.ps_number);
  const isCompared = compareList.includes(ps.ps_number);

  return (
    <>
      <Header />
      <main className="container page">
        <Link href="/" className="back-link">← Back to Dashboard</Link>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-software" style={{ fontSize: '0.8rem' }}>{ps.ps_number}</span>
                <span className={`badge ${ps.category === 'Software' ? 'badge-software' : 'badge-hardware'}`}>{ps.category}</span>
                <span className={`badge ${getCompBadgeClass(ps.competition_level)}`}>{ps.competition_level} Competition</span>
                <span className={`badge ${getOppBadgeClass(ps.opportunity_category)}`}>{ps.opportunity_category}</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>{ps.title}</h1>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <strong>Organization:</strong> {ps.organization} | <strong>Theme:</strong> {ps.theme}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={`btn ${isSaved ? "btn-secondary" : "btn-primary"}`}
                onClick={() => toggleWatchlist(ps.ps_number)}
              >
                {isSaved ? "★ Watchlisted" : "☆ Add to Watchlist"}
              </button>
              <button
                className={`btn ${isCompared ? "btn-primary" : "btn-secondary"}`}
                onClick={() => toggleCompare(ps.ps_number)}
              >
                {isCompared ? "✓ Added to Compare" : "+ Compare"}
              </button>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          {/* Left Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Competition Status */}
            <div className="card">
              <h2 className="section-title">📊 Competition Status</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: ps.fill_percentage > 50 ? 'var(--red)' : 'var(--green)' }}>
                  {ps.ideas_submitted} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 500 Submissions</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Capacity Utilization</span>
                    <span style={{ fontWeight: '700' }}>{ps.fill_percentage}%</span>
                  </div>
                  <div className="fill-bar" style={{ height: '10px' }}>
                    <div className={`fill-bar-inner ${getFillClass(ps.fill_percentage)}`} style={{ width: `${Math.min(ps.fill_percentage, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="detail-meta">
                <div className="meta-item">
                  <div className="meta-label">Submission Momentum</div>
                  <div className="meta-value" style={{ color: ps.velocity?.momentum?.includes('Rising') ? 'var(--green)' : 'var(--text-primary)' }}>
                    {ps.velocity?.momentum || "Insufficient data"}
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-label">24h Velocity</div>
                  <div className="meta-value">
                    {ps.velocity?.velocity_24h !== null ? `+${ps.velocity?.growth_24h} in 24h` : "No recent velocity"}
                  </div>
                </div>
                <div className="meta-item">
                  <div className="meta-label">Days Remaining</div>
                  <div className="meta-value">{ps.days_remaining !== null ? `${ps.days_remaining} Days` : "—"}</div>
                </div>
                <div className="meta-item">
                  <div className="meta-label">Deadline Urgency</div>
                  <div className="meta-value">{ps.deadline_pressure}</div>
                </div>
              </div>

              {ps.cap_forecast?.note && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  🔮 <strong>Cap Forecast:</strong> {ps.cap_forecast.note}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="section-title">📄 Problem Statement Description</h2>
              <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                {ps.description || "No detailed description provided by official portal."}
              </div>
            </div>

            {/* Technology & Complexity */}
            <div className="card">
              <h2 className="section-title">⚙️ Technology &amp; Complexity Analysis</h2>

              <div style={{ marginBottom: '16px' }}>
                <div className="meta-label" style={{ marginBottom: '8px' }}>Extracted Technology Domains</div>
                <div className="tag-list">
                  {ps.technology_tags?.length > 0 ? (
                    ps.technology_tags.map(tag => <span key={tag} className="tag">{tag}</span>)
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>General Software / Unspecified</span>
                  )}
                </div>
              </div>

              <div className="detail-meta">
                <div className="meta-item">
                  <div className="meta-label">Hackathon MVP Complexity</div>
                  <div className="meta-value">{ps.prototype_complexity?.level} ({ps.prototype_complexity?.score}/8 factors)</div>
                </div>
                <div className="meta-item">
                  <div className="meta-label">Demo Potential</div>
                  <div className="meta-value">{ps.demo_potential?.level} ({ps.demo_potential?.score}/5 factors)</div>
                </div>
              </div>

              {ps.prototype_complexity?.factors_present?.length > 0 && (
                <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong>Complexity Factors:</strong> {ps.prototype_complexity.factors_present.join(" • ")}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Resource Completeness */}
            <div className="card">
              <h2 className="section-title">📂 Resource Availability</h2>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px', color: 'var(--accent-light)' }}>
                {ps.resources?.score} / {ps.resources?.total} Resources Ready
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ps.resources?.resources?.map(r => (
                  <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span>{r.name}</span>
                    <span style={{ color: r.available ? 'var(--green)' : 'var(--text-muted)', fontWeight: '600' }}>
                      {r.available ? "✓ Available" : "✕ Not found"}
                    </span>
                  </div>
                ))}
              </div>

              {ps.dataset_link && (
                <a href={ps.dataset_link} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                  🔗 Open Official Dataset Link
                </a>
              )}
            </div>

            {/* Opportunity Signal */}
            <div className="card">
              <h2 className="section-title">🎯 Opportunity Signal</h2>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-light)', marginBottom: '4px' }}>
                {ps.opportunity_score} / 100
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Calculated opportunity score (Low competition + resources + time)
              </div>
              {ps.crowded_but_strong && (
                <div style={{ padding: '8px 12px', background: 'var(--yellow-bg)', color: 'var(--yellow)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: '600' }}>
                  🔥 Crowded but Strong: High competition but has strong supporting resources.
                </div>
              )}
            </div>

            {/* Similar PS Recommendations */}
            {ps.similar_ps?.length > 0 && (
              <div className="card">
                <h2 className="section-title">🔗 Similar Problem Statements</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ps.similar_ps.map(s => (
                    <Link key={s.ps_number} href={`/ps/${s.ps_number}`} style={{ color: 'inherit' }}>
                      <div style={{ padding: '10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.85rem' }}>
                          <span>{s.ps_number}</span>
                          <span style={{ color: 'var(--accent-light)' }}>{s.similarity}% Match</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {s.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function PSDetailPage() {
  return (
    <DataProvider>
      <PSDetailContent />
    </DataProvider>
  );
}
