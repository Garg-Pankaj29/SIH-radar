"use client";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { LuArrowRight } from "react-icons/lu";

export default function CompetitionOverview({ kpis }) {
  if (!kpis) return null;

  const dist = kpis.competition_distribution || {};
  const data = [
    { name: "None Yet", value: dist["None yet"] || 0, color: "var(--donut-none)" },
    { name: "Low Competition", value: dist["Low"] || 0, color: "var(--donut-low)" },
    { name: "Medium Competition", value: dist["Medium"] || 0, color: "var(--donut-medium)" },
    { name: "High Competition", value: dist["High"] || 0, color: "var(--donut-high)" },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);

  const COLORS = ["#b0b0b0", "#52b788", "#e8a54b", "#c0392b"];

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Competition Overview</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Donut Chart */}
        <div style={{ width: "150px", height: "150px", position: "relative", flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div className="donut-center-value">{total}</div>
            <div className="donut-center-text">TOTAL</div>
          </div>
        </div>

        {/* Legend */}
        <div className="comp-legend">
          {data.map((item, i) => (
            <div className="comp-legend-item" key={item.name}>
              <span className="comp-legend-dot" style={{ background: COLORS[i] }} />
              <span className="comp-legend-label">{item.name}</span>
              <span className="comp-legend-value">
                {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/ps" className="card-link">
          <span>View all PS</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
