"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";
import { getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";
import { LuClock, LuZap, LuTriangleAlert } from "react-icons/lu";

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
      <div className="alerts-grid">
        <div className="card" style={{ borderLeft: "4px solid var(--red)", display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(231, 111, 81, 0.15)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LuClock size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Deadline Urgency
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--red)", lineHeight: "1.2" }}>
              {deadlineAlerts.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Due within 14 days
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid var(--accent-warm)", display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(232, 165, 75, 0.15)", color: "var(--accent-warm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LuZap size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Velocity Surges
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--accent-warm)", lineHeight: "1.2" }}>
              {velocityAlerts.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              ≥20 ideas in 24h
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: "4px solid var(--cyan)", display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(72, 202, 228, 0.15)", color: "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LuTriangleAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Cap Threshold Warnings
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--cyan)", lineHeight: "1.2" }}>
              {capacityAlerts.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              ≥50% capacity filled
            </div>
          </div>
        </div>
      </div>

      {/* Deadline Crunch Section */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-header">
          <span className="card-title">Deadline Crunch List</span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Sorted by days remaining</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {deadlineAlerts.slice(0, 8).map((ps) => (
            <div
              key={ps.ps_number}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <Link href={`/ps/${ps.ps_number}`} style={{ fontWeight: "800", color: "var(--accent-light)" }}>
                    {ps.ps_number}
                  </Link>
                  <span className={`badge ${getCompBadgeClass(ps.competition_level)}`}>
                    {ps.competition_level} Comp
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{ps.title}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {ps.organization} • {ps.theme}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "800", color: (ps.days_remaining ?? 99) <= 5 ? "var(--red)" : "var(--yellow)" }}>
                  {ps.days_remaining} days remaining
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {velocityAlerts.slice(0, 8).map((ps) => (
            <div
              key={ps.ps_number}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <Link href={`/ps/${ps.ps_number}`} style={{ fontWeight: "800", color: "var(--accent-light)" }}>
                    {ps.ps_number}
                  </Link>
                  <span className={`badge ${getOppBadgeClass(ps.opportunity_category)}`}>
                    {ps.opportunity_category}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{ps.title}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {ps.organization} • {ps.ideas_submitted} total submissions
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "800", color: (ps.velocity?.growth_24h || 0) > 0 ? "var(--green)" : "var(--text-secondary)" }}>
                  {ps.velocity?.growth_24h > 0 ? `+${ps.velocity.growth_24h}` : (ps.velocity?.growth_24h || 0)} in 24h
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
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
