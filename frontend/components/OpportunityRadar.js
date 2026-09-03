"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { LuInfo, LuArrowRight, LuX, LuGem, LuFlame, LuRocket, LuUsers } from "react-icons/lu";

export default function OpportunityRadar({ psData }) {
  const [showInfo, setShowInfo] = useState(false);

  if (!psData || psData.length === 0) return null;

  // Compute distributed, non-colliding coordinate mapping for all 226 PSs
  const scatterData = psData.map((ps, idx) => {
    const seedX = ((idx * 17) % 29) / 29 - 0.5;
    const seedY = ((idx * 23) % 31) / 31 - 0.5;

    let rawX = ps.fill_percentage || 0;
    
    // Spread the dots slightly so they don't form a perfect vertical line at 0
    // We make the jitter strictly positive (0.5 to 2.5) for items with near-zero fill
    // so they are fully visible and look like a cluster rather than a squashed line.
    rawX = rawX + 0.5 + Math.abs(seedX * 4);

    let rawY = ps.opportunity_score || 50;
    if (ps.opportunity_category === "HIDDEN GEM") rawY = Math.max(rawY, 65) + seedY * 12;
    else if (ps.opportunity_category === "HOT") rawY = Math.max(rawY, 60) + seedY * 14;
    else if (ps.opportunity_category === "EMERGING") rawY = Math.min(rawY, 48) + seedY * 12;
    else if (ps.opportunity_category === "CROWDED") rawY = Math.min(rawY, 45) + seedY * 14;

    // Constrain X and Y bounds
    const x = Math.max(0.5, Math.min(99.5, rawX));
    const y = Math.max(4, Math.min(96, Math.round(rawY)));

    return {
      x,
      y,
      ps_number: ps.ps_number,
      title: ps.title,
      category: ps.category,
      opportunity_category: ps.opportunity_category || "HIDDEN GEM",
      fill_percentage: ps.fill_percentage || 0,
      opportunity_score: ps.opportunity_score || Math.round(y),
      ideas_submitted: ps.ideas_submitted || 0,
    };
  });

  return (
    <div className="card" style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      <div className="card-header" style={{ marginBottom: "8px" }}>
        <span className="card-title">Opportunity Radar</span>
        <button
          className="radar-info-toggle-btn"
          onClick={() => setShowInfo(!showInfo)}
          title="Learn how Opportunity Radar works"
          aria-label="Radar explanation"
        >
          <LuInfo size={18} />
        </button>
      </div>

      {/* Interactive Explanation Modal / Popover when (i) is clicked */}
      {showInfo && (
        <div className="radar-info-overlay">
          <div className="radar-info-header">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "800", fontSize: "0.85rem" }}>
              <LuInfo size={16} color="var(--accent-light)" />
              <span>How Opportunity Radar Works</span>
            </div>
            <button
              className="radar-info-close"
              onClick={() => setShowInfo(false)}
              aria-label="Close information"
            >
              <LuX size={16} />
            </button>
          </div>

          <div className="radar-info-body">
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "8px", lineHeight: "1.4" }}>
              Maps problem statements on a 2D matrix of <strong>Competition Fill % (X-axis)</strong> vs <strong>Opportunity Score (Y-axis)</strong>:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.72rem" }}>
              <div style={{ padding: "6px 8px", background: "rgba(82, 183, 136, 0.15)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <LuGem size={14} color="#52b788" />
                <span><strong style={{ color: "#52b788" }}>Hidden Gem (Top-Left):</strong> Low competition (&lt;50%) + High opportunity (&gt;50).</span>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(230, 126, 34, 0.15)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <LuFlame size={14} color="#e67e22" />
                <span><strong style={{ color: "#e67e22" }}>Hot (Top-Right):</strong> High competition (&gt;50%) + High opportunity (&gt;50).</span>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(41, 128, 185, 0.15)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <LuRocket size={14} color="#2980b9" />
                <span><strong style={{ color: "#2980b9" }}>Emerging (Bottom-Left):</strong> Low fill with rapid momentum.</span>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(231, 111, 81, 0.15)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <LuUsers size={14} color="#e76f51" />
                <span><strong style={{ color: "#e76f51" }}>Crowded (Bottom-Right):</strong> Saturated (&gt;50% fill) with intense competition.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Quadrant Tags Bar with Icons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px 6px", fontSize: "0.7rem", fontWeight: "700" }}>
        <span style={{ color: "#52b788", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <LuGem size={13} />
          <span>Hidden Gem</span>
        </span>
        <span style={{ color: "#e67e22", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <LuFlame size={13} />
          <span>Hot</span>
        </span>
      </div>

      {/* Graph Area */}
      <div style={{ width: "100%", height: "190px", position: "relative", minHeight: "190px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 12, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickLine={{ stroke: "var(--border-color)" }}
              axisLine={{ stroke: "var(--border-color)" }}
              unit="%"
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickLine={{ stroke: "var(--border-color)" }}
              axisLine={{ stroke: "var(--border-color)" }}
            />

            {/* Quadrant dividing crosshairs at 50% */}
            <ReferenceLine x={50} stroke="var(--border-subtle)" strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="var(--border-subtle)" strokeDasharray="4 4" />

            <Tooltip content={<CustomRadarTooltip />} />

            <Scatter data={scatterData} fillOpacity={0.75}>
              {scatterData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.opportunity_category)} r={3.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Axis Labels */}
        <div style={{ position: "absolute", bottom: "1px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "600", pointerEvents: "none" }}>
          Competition (Fill %) →
        </div>
      </div>

      {/* Bottom Quadrant Tags with Icons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 4px 0", fontSize: "0.7rem", fontWeight: "700" }}>
        <span style={{ color: "#2980b9", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <LuRocket size={13} />
          <span>Emerging</span>
        </span>
        <span style={{ color: "#e76f51", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <LuUsers size={13} />
          <span>Crowded</span>
        </span>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Link href="/radar" className="card-link">
          <span>Explore Full Radar</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function getColor(opp) {
  switch (opp) {
    case "HIDDEN GEM":
      return "#52b788";
    case "HOT":
      return "#e67e22";
    case "EMERGING":
      return "#2980b9";
    case "CROWDED":
      return "#e76f51";
    case "WATCH":
      return "#e8a54b";
    default:
      return "#52b788";
  }
}

function CustomRadarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          padding: "10px 12px",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          maxWidth: "240px",
          fontSize: "0.75rem",
        }}
      >
        <div style={{ fontWeight: "800", color: "var(--accent-light)", marginBottom: "2px" }}>
          {data.ps_number} ({data.category})
        </div>
        <div style={{ color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px", lineHeight: "1.3" }}>
          {data.title?.length > 45 ? data.title.slice(0, 45) + "…" : data.title}
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>
          Fill: <strong>{data.fill_percentage}%</strong> | Score: <strong>{data.opportunity_score}</strong>
        </div>
        <div style={{ marginTop: "4px", fontWeight: "700", color: getColor(data.opportunity_category) }}>
          {data.opportunity_category}
        </div>
      </div>
    );
  }
  return null;
}

