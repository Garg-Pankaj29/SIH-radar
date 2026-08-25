"use client";
import { IconInfo } from "./Icons";

export default function DataDisclaimer({ metadata }) {
  return (
    <div className="disclaimer">
      <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconInfo size={16} /> Methodological &amp; Data Provenance Notice
      </div>
      <div>
        • Data is based on publicly available SIH submission counts. Submission count is a <strong>competition-demand proxy</strong>, not website traffic analytics.
      </div>
      <div>
        • SIH does not publicly expose page views or click analytics.
      </div>
      <div>
        • Competition metrics, velocity, momentum, and opportunity signals are calculated heuristics — not guaranteed win-probability forecasts.
      </div>
      <div>
        • {metadata?.demo_mode ? "DEMO MODE ACTIVE: Showing simulated growth data for demonstration purposes." : `Data source: ${metadata?.source || 'Public SIH portal'}`}
      </div>
      <div>
        • SIH Opportunity Radar is an independent decision-support tool for students and is not affiliated with SIH, MIC, or AICTE.
      </div>
    </div>
  );
}
