"use client";
import { formatNumber } from "../lib/utils";

export default function KPICards({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      label: "Total PS",
      value: formatNumber(kpis.total_ps),
      sub: "All Problem Statements",
      iconClass: "kpi-icon-green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      ),
    },
    {
      label: "Software",
      value: formatNumber(kpis.software_count),
      sub: `${kpis.total_ps > 0 ? ((kpis.software_count / kpis.total_ps) * 100).toFixed(1) : 0}% of total`,
      iconClass: "kpi-icon-green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      label: "Hardware",
      value: formatNumber(kpis.hardware_count),
      sub: `${kpis.total_ps > 0 ? ((kpis.hardware_count / kpis.total_ps) * 100).toFixed(1) : 0}% of total`,
      iconClass: "kpi-icon-green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <rect width="6" height="6" x="9" y="9" rx="1" />
          <path d="M15 2v2" /><path d="M15 20v2" />
          <path d="M2 15h2" /><path d="M2 9h2" />
          <path d="M20 15h2" /><path d="M20 9h2" />
          <path d="M9 2v2" /><path d="M9 20v2" />
        </svg>
      ),
    },
    {
      label: "Total Submissions",
      value: formatNumber(kpis.total_submissions),
      sub: "Across all PS",
      iconClass: "kpi-icon-warm",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      ),
    },
    {
      label: "Average Fill",
      value: `${kpis.average_fill}%`,
      sub: "Submission capacity used",
      iconClass: "kpi-icon-warm",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      ),
    },
    {
      label: "Hidden Gems",
      value: formatNumber(kpis.hidden_gem_count || 0),
      sub: "Low comp, high potential",
      iconClass: "kpi-icon-green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 13L2 9Z" />
          <path d="M11 3 8 9l4 13 4-13-3-6" />
          <path d="M2 9h20" />
        </svg>
      ),
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, i) => (
        <div className="kpi-card" key={i}>
          <div className={`kpi-icon ${card.iconClass}`}>{card.icon}</div>
          <div className="kpi-info">
            <div className="kpi-label">{card.label}</div>
            <div className="kpi-value">{card.value}</div>
            <div className="kpi-sub">{card.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
