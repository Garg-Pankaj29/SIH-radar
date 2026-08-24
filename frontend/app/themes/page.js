"use client";
import { DataProvider, useData } from "../../lib/DataContext";
import Header from "../../components/Header";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

function ThemesContent() {
  const { themes, loading } = useData();

  if (loading) return <div className="container page">Loading Theme Saturation Analysis...</div>;

  const themeList = Object.values(themes || {}).sort((a, b) => b.ps_count - a.ps_count);

  return (
    <>
      <Header />
      <main className="container page">
        <div style={{ marginBottom: '24px' }}>
          <h1 className="page-title">📈 Theme Saturation &amp; Domain Breakdown</h1>
          <p className="page-subtitle">
            Analyze national submission distribution and density across official SIH 2026 hackathon themes
          </p>
        </div>

        {/* Bar Chart */}
        <div className="card chart-card" style={{ height: '380px', marginBottom: '28px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase' }}>
            Problem Statement Count by Theme
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={themeList} margin={{ top: 10, right: 30, left: 10, bottom: 60 }}>
              <XAxis dataKey="theme" stroke="var(--text-muted)" angle={-45} textAnchor="end" interval={0} fontSize={11} />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}
              />
              <Bar dataKey="ps_count" fill="var(--accent)" radius={[4, 4, 0, 0]}>
                {themeList.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--accent)" : "var(--purple)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Theme Grid */}
        <div className="grid-3">
          {themeList.map(t => (
            <div key={t.theme} className="card">
              <div style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '6px' }}>{t.theme}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span>{t.ps_count} Problem Statements</span>
                <span style={{ fontWeight: '700', color: 'var(--accent-light)' }}>{t.average_fill}% Avg Fill</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Total Ideas Submitted: <strong>{t.total_submissions}</strong>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default function ThemesPage() {
  return (
    <DataProvider>
      <ThemesContent />
    </DataProvider>
  );
}
