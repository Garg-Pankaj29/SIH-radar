"use client";
import { formatNumber } from "../lib/utils";

export default function KPICards({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="kpi-grid">
      <div className="kpi-card animate-in">
        <div className="kpi-label">Total PSs</div>
        <div className="kpi-value">{formatNumber(kpis.total_ps)}</div>
        <div className="kpi-sub">
          <span className="badge badge-software">{kpis.software_count} SW</span>{" "}
          <span className="badge badge-hardware">{kpis.hardware_count} HW</span>
        </div>
      </div>

      <div className="kpi-card animate-in">
        <div className="kpi-label">Observed Submissions</div>
        <div className="kpi-value">{formatNumber(kpis.total_submissions)}</div>
        <div className="kpi-sub">Total national ideas submitted</div>
      </div>

      <div className="kpi-card animate-in">
        <div className="kpi-label">Average Fill</div>
        <div className="kpi-value" style={{ color: kpis.average_fill > 50 ? 'var(--red)' : kpis.average_fill > 20 ? 'var(--yellow)' : 'var(--green)' }}>
          {kpis.average_fill}%
        </div>
        <div className="kpi-sub">Capacity utilization across all PSs</div>
      </div>

      <div className="kpi-card animate-in">
        <div className="kpi-label">Fastest Growing</div>
        <div className="kpi-value" style={{ fontSize: '1.25rem', color: 'var(--accent-light)' }}>
          {kpis.fastest_growing ? kpis.fastest_growing.ps_number : "N/A"}
        </div>
        <div className="kpi-sub">
          {kpis.fastest_growing ? `+${kpis.fastest_growing.growth_24h} in 24h` : "No recent velocity spike"}
        </div>
      </div>

      <div className="kpi-card animate-in">
        <div className="kpi-label">Most Crowded</div>
        <div className="kpi-value" style={{ fontSize: '1.25rem', color: 'var(--red)' }}>
          {kpis.most_crowded ? kpis.most_crowded.ps_number : "N/A"}
        </div>
        <div className="kpi-sub">
          {kpis.most_crowded ? `${kpis.most_crowded.fill_percentage}% cap filled` : "None"}
        </div>
      </div>

      <div className="kpi-card animate-in">
        <div className="kpi-label">Hidden Gems</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>
          {formatNumber(kpis.hidden_gem_count || 0)}
        </div>
        <div className="kpi-sub">Low competition + high resources</div>
      </div>
    </div>
  );
}
