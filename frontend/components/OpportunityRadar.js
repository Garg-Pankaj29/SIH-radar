"use client";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine, Label } from "recharts";

export default function OpportunityRadar({ psData }) {
  if (!psData || psData.length === 0) return null;

  // Map opportunity categories to numeric values for Y axis
  const oppMap = { "HIDDEN GEM": 5, "HOT": 4, "WATCH": 3, "EMERGING": 2, "CROWDED": 1 };
  // Map competition levels to numeric values for X axis
  const compMap = { "None yet": 0, "Low": 1, "Medium": 2, "High": 3 };

  const scatterData = psData
    .filter((ps) => ps.competition_level && ps.opportunity_category)
    .map((ps) => ({
      x: (compMap[ps.competition_level] ?? 1) + (Math.random() * 0.6 - 0.3),
      y: (oppMap[ps.opportunity_category] ?? 3) + (Math.random() * 0.6 - 0.3),
      ps: ps.ps_number,
      opp: ps.opportunity_category,
    }));

  // Color by opportunity
  const getColor = (opp) => {
    switch (opp) {
      case "HIDDEN GEM": return "#52b788";
      case "HOT": return "#e67e22";
      case "EMERGING": return "#2980b9";
      case "CROWDED": return "#c0392b";
      case "WATCH": return "#e8a54b";
      default: return "#888";
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          Opportunity Radar
        </span>
        <svg className="card-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </div>

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
              <Label value="Competition Level" position="bottom" offset={5} style={{ fill: "var(--text-muted)", fontSize: "0.7rem" }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 5.5]}
              tick={false}
              axisLine={{ stroke: "var(--border-color)" }}
            >
              <Label value="Opportunity Signal" angle={-90} position="left" offset={0} style={{ fill: "var(--text-muted)", fontSize: "0.7rem" }} />
            </YAxis>

            {/* Quadrant labels */}
            <ReferenceLine x={1.5} stroke="var(--border-color)" strokeDasharray="3 3" />
            <ReferenceLine y={3} stroke="var(--border-color)" strokeDasharray="3 3" />

            <Scatter data={scatterData} fillOpacity={0.7}>
              {scatterData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.opp)} r={4} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant text labels */}
        <div style={{ position: "absolute", top: "18px", left: "28px", fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(82, 183, 136, 0.15)", color: "#52b788" }}>
          Hidden Gem
        </div>
        <div style={{ position: "absolute", top: "18px", right: "28px", fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(230, 126, 34, 0.15)", color: "#e67e22" }}>
          Hot
        </div>
        <div style={{ position: "absolute", bottom: "30px", left: "28px", fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(41, 128, 185, 0.15)", color: "#2980b9" }}>
          Emerging
        </div>
        <div style={{ position: "absolute", bottom: "30px", right: "28px", fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(192, 57, 43, 0.15)", color: "#c0392b" }}>
          Crowded
        </div>

        {/* Axis end labels */}
        <div style={{ position: "absolute", bottom: "5px", left: "28px", fontSize: "0.62rem", color: "var(--text-muted)" }}>Low</div>
        <div style={{ position: "absolute", bottom: "5px", right: "28px", fontSize: "0.62rem", color: "var(--text-muted)" }}>High</div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <a href="/radar" className="card-link">
          Explore Radar
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
