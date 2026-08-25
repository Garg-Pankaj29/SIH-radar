"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";
import { getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";

function AlertsContent() {
  const { psData, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title="Alerts & Deadline Watch" subtitle="Real-time notifications and velocity tracking">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Alerts...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Alerts & Deadline Watch" subtitle="Real-time notifications and velocity tracking">
        <div className="error-state">Failed to load alerts: {error}</div>
      </AppShell>
    );
  }

  // Calculate alerts
  const deadlineAlerts = psData
    .filter((p) => p.days_remaining !== null && p.days_remaining <= 14)
    .sort((a, b) => (a.days_remaining ?? 99) - (b.days_remaining ?? 99));

  const velocityAlerts = psData
    .filter((p) => p.velocity?.growth_24h && p.velocity.growth_24h >= 20)
    .sort((a, b) => (b.velocity?.growth_24h || 0) - (a.velocity?.growth_24h || 0));

  const capacityAlerts = psData
    .filter((p) => p.fill_percentage >= 50)
    .sort((a, b) => b.fill_percentage - a.fill_percentage);

  return (
    <AppShell
      title="Alerts & Velocity Triggers"
      subtitle="Real-time automated triggers for deadline crunches, sudden submission surges, and capacity thresholds."
    >
      {/* Alert Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--red)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Deadline Urgency
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--red)', marginTop: '4px' }}>
            {deadlineAlerts.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Problem statements due within 14 days
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-warm)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Velocity Surges
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-warm)', marginTop: '4px' }}>
            {velocityAlerts.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            PSs with ≥20 new submissions in 24h
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--cyan)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Cap Threshold Warnings
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--cyan)', marginTop: '4px' }}>
            {capacityAlerts.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            PSs with ≥50% capacity filled
          </div>
        </div>
      </div>

      {/* Deadline Crunch Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Deadline Crunch List</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sorted by days remaining</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {deadlineAlerts.slice(0, 8).map((ps) => (
            <div
              key={ps.ps_number}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link href={`/ps/${ps.ps_number}`} style={{ fontWeight: '800', color: 'var(--accent-light)' }}>
                    {ps.ps_number}
                  </Link>
                  <span className={`badge ${getCompBadgeClass(ps.competition_level)}`}>
                    {ps.competition_level} Comp
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ps.title}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {ps.organization} • {ps.theme}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', color: (ps.days_remaining ?? 99) <= 5 ? 'var(--red)' : 'var(--yellow)' }}>
                  {ps.days_remaining} days remaining
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {ps.ideas_submitted} / 500 ideas ({ps.fill_percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Velocity Surges Section */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Velocity Surges (Last 24h Acceleration)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {velocityAlerts.slice(0, 8).map((ps) => (
            <div
              key={ps.ps_number}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link href={`/ps/${ps.ps_number}`} style={{ fontWeight: '800', color: 'var(--accent-light)' }}>
                    {ps.ps_number}
                  </Link>
                  <span className={`badge ${getOppBadgeClass(ps.opportunity_category)}`}>
                    {ps.opportunity_category}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ps.title}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {ps.organization} • {ps.ideas_submitted} total submissions
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', color: 'var(--green)' }}>
                  +{ps.velocity?.growth_24h} in 24h
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Fill: {ps.fill_percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(AlertsContent), { ssr: false });

export default function AlertsPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
