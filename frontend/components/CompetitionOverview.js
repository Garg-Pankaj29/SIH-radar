"use client";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { LuArrowRight } from "react-icons/lu";

export default function CompetitionOverview({ kpis }) {
  if (!kpis) return null;

  const dist = kpis.competition_distribution || {};
  const data = [
    { name: "None Yet", value: dist["None yet"] || 0, color: "var(--donut-none)" },
    { name: "Low", value: dist["Low"] || 0, color: "var(--donut-low)" },
    { name: "Medium", value: dist["Medium"] || 0, color: "var(--donut-medium)" },
    { name: "High", value: dist["High"] || 0, color: "var(--donut-high)" },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  const COLORS = ["#7a8c7e", "#52b788", "#e8a54b", "#e76f51"];

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div className="card-header">
          <span className="card-title">Competition Overview</span>
        </div>

        <div className="comp-overview-wrap">
          {/* Donut Chart */}
          <div className="comp-donut-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={58}
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
            <div className="donut-center-label">
              <div className="donut-center-value">{total}</div>
              <div className="donut-center-text">TOTAL</div>
            </div>
          </div>

          {/* Legend */}
          <div className="comp-legend">
            {data.map((item, i) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
              return (
                <div className="comp-legend-item" key={item.name}>
                  <div className="comp-legend-left">
                    <span className="comp-legend-dot" style={{ background: COLORS[i] }} />
                    <span className="comp-legend-label">{item.name}</span>
                  </div>
                  <span className="comp-legend-value">
                    {item.value} <span className="comp-legend-pct">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
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
