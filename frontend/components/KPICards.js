"use client";
import { formatNumber } from "../lib/utils";
import {
  LuFileText,
  LuCode,
  LuCpu,
  LuSend,
  LuChartPie,
  LuGem,
} from "react-icons/lu";

export default function KPICards({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      label: "Total PS",
      value: formatNumber(kpis.total_ps),
      sub: "All Problem Statements",
      iconClass: "kpi-icon-green",
      Icon: LuFileText,
    },
    {
      label: "Software",
      value: formatNumber(kpis.software_count),
      sub: `${kpis.total_ps > 0 ? ((kpis.software_count / kpis.total_ps) * 100).toFixed(1) : 0}% of total`,
      iconClass: "kpi-icon-green",
      Icon: LuCode,
    },
    {
      label: "Hardware",
      value: formatNumber(kpis.hardware_count),
      sub: `${kpis.total_ps > 0 ? ((kpis.hardware_count / kpis.total_ps) * 100).toFixed(1) : 0}% of total`,
      iconClass: "kpi-icon-green",
      Icon: LuCpu,
    },
    {
      label: "Total Submissions",
      value: formatNumber(kpis.total_submissions),
      sub: "Across all PS",
      iconClass: "kpi-icon-warm",
      Icon: LuSend,
    },
    {
      label: "Average Fill",
      value: `${kpis.average_fill}%`,
      sub: "Submission capacity used",
      iconClass: "kpi-icon-warm",
      Icon: LuChartPie,
    },
    {
      label: "Hidden Gems",
      value: formatNumber(kpis.hidden_gem_count || 0),
      sub: "Low comp, high potential",
      iconClass: "kpi-icon-green",
      Icon: LuGem,
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, i) => {
        const IconComponent = card.Icon;
        return (
          <div className="kpi-card" key={i}>
            <div className={`kpi-icon ${card.iconClass}`}>
              <IconComponent size={20} />
            </div>
            <div className="kpi-info">
              <div className="kpi-label">{card.label}</div>
              <div className="kpi-value">{card.value}</div>
              <div className="kpi-sub">{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
