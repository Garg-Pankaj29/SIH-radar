"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

function ThemesContent() {
  const { themes, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title="Themes & Domain Breakdown" subtitle="National submission saturation across hackathon themes">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Theme Saturation Analysis...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Themes & Domain Breakdown" subtitle="National submission saturation across hackathon themes">
        <div className="error-state">Failed to load theme data: {error}</div>
      </AppShell>
    );
  }

  const themeList = Object.values(themes || {}).sort((a, b) => b.ps_count - a.ps_count);

  return (
    <AppShell
      title="Themes & Domain Saturation"
      subtitle="Analyze national submission distribution and density across official SIH 2026 hackathon themes"
    >
      {/* Bar Chart */}
      <div className="card chart-card" style={{ height: "380px", marginBottom: "28px" }}>
        <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase" }}>
          Problem Statement Count by Theme
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={themeList} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
            <XAxis dataKey="theme" stroke="var(--text-muted)" angle={-45} textAnchor="end" interval={0} fontSize={11} />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip
              contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "var(--radius-md)", fontSize: "0.8rem" }}
            />
            <Bar dataKey="ps_count" fill="var(--accent)" radius={[4, 4, 0, 0]}>
              {themeList.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--accent)" : "#52b788"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Theme Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {themeList.map((t) => (
          <div key={t.theme} className="card">
            <div style={{ fontWeight: "800", fontSize: "1rem", marginBottom: "6px" }}>{t.theme}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
              <span>{t.ps_count} Problem Statements</span>
              <span style={{ fontWeight: "700", color: "var(--accent-light)" }}>{t.avg_fill}% Avg Fill</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Total Ideas Submitted: <strong>{t.total_submissions}</strong>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(ThemesContent), { ssr: false });

export default function ThemesPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
