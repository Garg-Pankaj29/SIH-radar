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
  Label,
} from "recharts";
import { LuInfo, LuArrowRight, LuX } from "react-icons/lu";

export default function OpportunityRadar({ psData }) {
  const [showInfo, setShowInfo] = useState(false);

  if (!psData || psData.length === 0) return null;

  // Map opportunity categories to numeric values for Y axis
  const oppMap = { "HIDDEN GEM": 5, HOT: 4, WATCH: 3, EMERGING: 2, CROWDED: 1 };
  // Map competition levels to numeric values for X axis
  const compMap = { "None yet": 0, Low: 1, Medium: 2, High: 3 };

  const scatterData = psData
    .filter((ps) => ps.competition_level && ps.opportunity_category)
    .map((ps) => ({
      x: (compMap[ps.competition_level] ?? 1) + (Math.random() * 0.6 - 0.3),
      y: (oppMap[ps.opportunity_category] ?? 3) + (Math.random() * 0.6 - 0.3),
      ps: ps.ps_number,
      opp: ps.opportunity_category,
    }));

  const getColor = (opp) => {
    switch (opp) {
      case "HIDDEN GEM":
        return "#52b788";
      case "HOT":
        return "#e67e22";
      case "EMERGING":
        return "#2980b9";
      case "CROWDED":
        return "#c0392b";
      case "WATCH":
        return "#e8a54b";
      default:
        return "#888";
    }
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      <div className="card-header">
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
              Maps each problem statement on a 2D matrix of <strong>Competition Density (X-axis)</strong> vs <strong>Opportunity Score (Y-axis)</strong>:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.72rem" }}>
              <div style={{ padding: "4px 8px", background: "rgba(82, 183, 136, 0.15)", borderRadius: "4px", color: "var(--text-primary)" }}>
                <strong style={{ color: "#52b788" }}>💎 Hidden Gem (Top-Left):</strong> Low competition (&lt;40% fill) + High clarity and guidelines.
              </div>
              <div style={{ padding: "4px 8px", background: "rgba(230, 126, 34, 0.15)", borderRadius: "4px", color: "var(--text-primary)" }}>
                <strong style={{ color: "#e67e22" }}>🔥 Hot (Top-Right):</strong> High submission density but rich support resources.
              </div>
              <div style={{ padding: "4px 8px", background: "rgba(41, 128, 185, 0.15)", borderRadius: "4px", color: "var(--text-primary)" }}>
                <strong style={{ color: "#2980b9" }}>🚀 Emerging (Bottom-Left):</strong> Low initial fill with accelerating 24h momentum.
              </div>
              <div style={{ padding: "4px 8px", background: "rgba(192, 57, 43, 0.15)", borderRadius: "4px", color: "var(--text-primary)" }}>
                <strong style={{ color: "#c0392b" }}>🚫 Crowded (Bottom-Right):</strong> Saturated (&gt;50% fill) with heavy competition.
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: "100%", height: "220px", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 25, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.5, 3.5]}
              tick={false}
              axisLine={{ stroke: "var(--border-color)" }}
            >
              <Label
                value="Competition Level"
                position="bottom"
                offset={5}
                style={{ fill: "var(--text-muted)", fontSize: "0.7rem" }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 5.5]}
              tick={false}
              axisLine={{ stroke: "var(--border-color)" }}
            >
              <Label
                value="Opportunity Signal"
                angle={-90}
                position="left"
                offset={0}
                style={{ fill: "var(--text-muted)", fontSize: "0.7rem" }}
              />
            </YAxis>

            {/* Quadrant dividing reference lines */}
            <ReferenceLine x={1.5} stroke="var(--border-color)" strokeDasharray="3 3" />
            <ReferenceLine y={3} stroke="var(--border-color)" strokeDasharray="3 3" />

            <Scatter data={scatterData} fillOpacity={0.75}>
              {scatterData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.opp)} r={4.5} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant text labels */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            left: "28px",
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: "rgba(82, 183, 136, 0.15)",
            color: "#52b788",
            pointerEvents: "none",
          }}
        >
          Hidden Gem
        </div>
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "28px",
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: "rgba(230, 126, 34, 0.15)",
            color: "#e67e22",
            pointerEvents: "none",
          }}
        >
          Hot
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "28px",
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: "rgba(41, 128, 185, 0.15)",
            color: "#2980b9",
            pointerEvents: "none",
          }}
        >
          Emerging
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "28px",
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: "rgba(192, 57, 43, 0.15)",
            color: "#c0392b",
            pointerEvents: "none",
          }}
        >
          Crowded
        </div>

        {/* Axis end labels */}
        <div style={{ position: "absolute", bottom: "5px", left: "28px", fontSize: "0.62rem", color: "var(--text-muted)" }}>
          Low
        </div>
        <div style={{ position: "absolute", bottom: "5px", right: "28px", fontSize: "0.62rem", color: "var(--text-muted)" }}>
          High
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <Link href="/radar" className="card-link">
          <span>Explore Radar</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
