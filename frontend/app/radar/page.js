"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { OPP_COLORS } from "../../lib/utils";

function RadarContent() {
  const { psData, loading, error } = useData();
  const [selectedCat, setSelectedCat] = useState("All");

  if (loading) {
    return (
      <AppShell title="Opportunity Radar" subtitle="2D Competition vs. Opportunity Matrix">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Opportunity Radar...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Opportunity Radar" subtitle="2D Competition vs. Opportunity Matrix">
        <div className="error-state">Failed to load radar data: {error}</div>
      </AppShell>
    );
  }

  const filtered = psData.filter((p) => selectedCat === "All" || p.category === selectedCat);

  const scatterData = filtered.map((p) => ({
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
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", maxWidth: "280px" }}>
          <div style={{ fontWeight: "800", color: "var(--accent-light)" }}>{data.ps_number} ({data.category})</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", margin: "4px 0" }}>{data.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Fill: <strong>{data.fill_percentage}%</strong> ({data.ideas_submitted}/500)
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Opp Score: <strong>{data.opportunity_score}/100</strong>
          </div>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", marginTop: "4px", color: OPP_COLORS[data.opportunity_category] || "var(--accent)" }}>
            Signal: {data.opportunity_category}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AppShell
      title="Opportunity Radar Matrix"
      subtitle="Interactive 2D matrix mapping Competition Fill % (X-axis) vs Opportunity Score (Y-axis)"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
        <div className="filter-bar">
          {["All", "Software", "Hardware"].map((cat) => (
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
      <div className="card" style={{ marginBottom: "20px", padding: "12px 20px", display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)" }}>Quadrant Legend:</span>
        {Object.entries(OPP_COLORS).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, display: "inline-block" }} />
            <span style={{ fontWeight: "600" }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* 2D Scatter Plot */}
      <div className="card chart-card" style={{ height: "520px", marginBottom: "24px" }}>
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
      <div className="dashboard-bottom" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--green)", marginBottom: "8px" }}>
            Top Left: Hidden Gems Quadrant
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            Low competition (&lt;40% fill) with high opportunity index. Ideal for teams seeking lower submission density while retaining strong problem resources and clear guidelines.
          </p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--red)", marginBottom: "8px" }}>
            Top Right: Hot &amp; Crowded Quadrant
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            High submission density (&gt;40% fill). Expect tough national competition. Best suited for experienced teams with pre-built domain expertise.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(RadarContent), { ssr: false });

export default function OpportunityRadarPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
