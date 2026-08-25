"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";

function IntelligenceContent() {
  const { trends, psData, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title="Trends & Intelligence" subtitle="Daily Competition Intelligence Briefing">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Intelligence Report...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Trends & Intelligence" subtitle="Daily Competition Intelligence Briefing">
        <div className="error-state">Failed to load intelligence report: {error}</div>
      </AppShell>
    );
  }

  const movers = trends?.biggest_movers || [];
  const hiddenGems = psData.filter(p => p.opportunity_category === "HIDDEN GEM").slice(0, 5);
  const emerging = psData.filter(p => p.opportunity_category === "EMERGING").slice(0, 5);
  const crowded = psData.filter(p => p.opportunity_category === "CROWDED").slice(0, 5);

  return (
    <AppShell
      title="Trends & Competition Intelligence"
      subtitle="Executive summary of national submission movement, velocity spikes, newly crowded problem statements, and emerging opportunities."
    >
      {/* 24h Velocity Spikes */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title">24-Hour Velocity Spikes</h2>
        {movers.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No significant velocity spikes detected in the last snapshot period.</div>
        ) : (
          <div className="grid-3" style={{ marginBottom: 0 }}>
            {movers.map(m => (
              <div key={m.ps_number} style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                  <Link href={`/ps/${m.ps_number}`}>{m.ps_number}</Link>
                  <span style={{ color: 'var(--green)' }}>+{m.growth} ideas</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Current Fill: {m.fill_percentage}%</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Gems Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title">Top 5 Hidden Gems (Low Competition + High Resources)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hiddenGems.map(h => (
            <div key={h.ps_number} style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: 'var(--accent-light)' }}>{h.ps_number}</span>
                  <span className="badge badge-software">{h.category}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{h.title}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{h.organization} | {h.theme}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', color: 'var(--green)' }}>{h.fill_percentage}% Fill</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Opp Score: {h.opportunity_score}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emerging vs Crowded */}
      <div className="grid-2">
        <div className="card">
          <h2 className="section-title" style={{ color: 'var(--cyan)' }}>Emerging Momentum Problem Statements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {emerging.map(e => (
              <div key={e.ps_number} style={{ fontSize: '0.85rem' }}>
                <Link href={`/ps/${e.ps_number}`} style={{ fontWeight: '700' }}>{e.ps_number}</Link> — {e.title}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.fill_percentage}% fill • Rising Momentum</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title" style={{ color: 'var(--red)' }}>High-Density Crowded Problem Statements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {crowded.map(c => (
              <div key={c.ps_number} style={{ fontSize: '0.85rem' }}>
                <Link href={`/ps/${c.ps_number}`} style={{ fontWeight: '700' }}>{c.ps_number}</Link> — {c.title}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.fill_percentage}% fill • High Competition</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(IntelligenceContent), { ssr: false });

export default function IntelligencePage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
