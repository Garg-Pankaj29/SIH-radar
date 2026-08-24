"use client";
import { useState } from "react";
import { DataProvider, useData } from "../../lib/DataContext";
import Header from "../../components/Header";
import Link from "next/link";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { OPP_COLORS } from "../../lib/utils";
import { IconTarget, IconGem, IconShieldX } from "../../components/Icons";

function RadarContent() {
  const { psData, loading } = useData();
  const [selectedCat, setSelectedCat] = useState("All");

  if (loading) return <div className="container page">Loading Opportunity Radar...</div>;

  const filtered = psData.filter(p => selectedCat === "All" || p.category === selectedCat);

  const scatterData = filtered.map(p => ({
    ps_number: p.ps_number,
    title: p.title,
    fill_percentage: p.fill_percentage,
    opportunity_score: p.opportunity_score,
    opportunity_category: p.opportunity_category,
    ideas_submitted: p.ideas_submitted,
    category: p.category,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', maxWidth: '280px' }}>
          <div style={{ fontWeight: '800', color: 'var(--accent-light)' }}>{data.ps_number} ({data.category})</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '4px 0' }}>{data.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Fill: <strong>{data.fill_percentage}%</strong> ({data.ideas_submitted}/500)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Opp Score: <strong>{data.opportunity_score}/100</strong>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', marginTop: '4px', color: OPP_COLORS[data.opportunity_category] }}>
            Signal: {data.opportunity_category}
          </div>
        </div>
      );
    };
    return null;
  };

  return (
    <>
      <Header />
      <main className="container page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 className="page-title"><IconTarget size={22} className="icon-inline" /> 2D Opportunity Radar Matrix</h1>
            <p className="page-subtitle">
              Interactive scatter plot mapping <strong>Competition Fill % (X-axis)</strong> vs <strong>Opportunity Score (Y-axis)</strong>
            </p>
          </div>

          <div className="filter-bar">
            {["All", "Software", "Hardware"].map(cat => (
              <button
                key={cat}
                className={`filter-chip ${selectedCat === cat ? "active" : ""}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="card" style={{ marginBottom: '20px', padding: '12px 20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quadrant Legend:</span>
          {Object.entries(OPP_COLORS).map(([cat, color]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, display: 'inline-block' }} />
              <span style={{ fontWeight: '600' }}>{cat}</span>
            </div>
          ))}
        </div>

        {/* 2D Scatter Plot */}
        <div className="card chart-card" style={{ height: '520px', marginBottom: '24px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
              <XAxis
                type="number"
                dataKey="fill_percentage"
                name="Fill %"
                unit="%"
                domain={[0, 100]}
                stroke="var(--text-muted)"
                label={{ value: "Competition Level (Capacity Fill %)", position: "insideBottom", offset: -15, fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="opportunity_score"
                name="Opportunity Score"
                domain={[0, 100]}
                stroke="var(--text-muted)"
                label={{ value: "Opportunity Index (Resource + Time + Fit)", angle: -90, position: "insideLeft", fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <ZAxis range={[50, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={40} stroke="var(--border-color)" strokeDasharray="3 3" />
              <ReferenceLine y={50} stroke="var(--border-color)" strokeDasharray="3 3" />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={OPP_COLORS[entry.opportunity_category] || "var(--accent)"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant Explanations */}
        <div className="grid-2">
          <div className="card">
            <h3 className="section-title" style={{ color: 'var(--green)' }}><IconGem size={16} /> Top Left: Hidden Gems Quadrant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Low competition (&lt;40% fill) with high opportunity index. Ideal for teams seeking lower submission density while retaining strong problem resources and clear guidelines.
            </p>
          </div>
          <div className="card">
            <h3 className="section-title" style={{ color: 'var(--red)' }}><IconShieldX size={16} /> Top Right: Hot &amp; Crowded Quadrant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              High submission density (&gt;40% fill). Expect tough national competition. Best suited for experienced teams with pre-built domain expertise.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function OpportunityRadarPage() {
  return (
    <DataProvider>
      <RadarContent />
    </DataProvider>
  );
}
