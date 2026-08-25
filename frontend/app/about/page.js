"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";

function AboutContent() {
  const { metadata, psData } = useData();

  return (
    <AppShell
      title="About SIH Opportunity Radar"
      subtitle="Purpose, Methodology, Data Provenance & Hackathon Intelligence Architecture"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
        {/* Mission Card */}
        <div className="card">
          <h2 className="section-title">Mission &amp; Objective</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <strong>SIH Opportunity Radar</strong> is an independent decision-support platform engineered to help hackathon teams, student builders, and mentors navigate the <strong>Smart India Hackathon (SIH 2026)</strong> problem statement ecosystem.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '10px' }}>
            By tracking submission density, capacity utilization, velocity spikes, domain requirements, and resource availability across all 226 problem statements, the platform empowers teams to identify high-potential <em>Hidden Gems</em> and avoid inadvertently entering saturated bottlenecks.
          </p>
        </div>

        {/* Core Heuristics & Signals */}
        <div className="card">
          <h2 className="section-title">Opportunity &amp; Competition Heuristics</h2>
          <div className="grid-2" style={{ marginTop: '16px', marginBottom: 0 }}>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: '800', color: 'var(--green)', fontSize: '0.95rem', marginBottom: '6px' }}>
                Hidden Gems Signal
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Low capacity fill (&lt;40%), high guideline completeness, available datasets, and balanced MVP complexity. High probability of standing out at national evaluation.
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: '800', color: 'var(--accent-warm)', fontSize: '0.95rem', marginBottom: '6px' }}>
                Emerging Momentum Signal
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Rapid 24h acceleration in national submissions with still-moderate total capacity fill. Indicates growing interest from tech institutes across India.
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: '800', color: 'var(--red)', fontSize: '0.95rem', marginBottom: '6px' }}>
                Crowded / Saturated Signal
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                High capacity fill (&gt;50%) with fierce national submission volumes. Requires deep domain innovation, working hardware/software prototypes, and unique angles to advance.
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: '800', color: 'var(--cyan)', fontSize: '0.95rem', marginBottom: '6px' }}>
                Team Fit Alignment
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Dynamic cosine-matching of team technical skill profiles against NLP-extracted domain requirements and hardware/software constraints.
              </div>
            </div>
          </div>
        </div>

        {/* Data Provenance & Disclaimer */}
        <div className="card">
          <h2 className="section-title">Data Provenance &amp; Disclaimers</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <div>
              • <strong>Demand Proxy:</strong> All submission counts represent publicly observed competition-demand counters, not website traffic analytics.
            </div>
            <div>
              • <strong>Independence:</strong> SIH Opportunity Radar is an independent open-source project and is not affiliated with SIH, MIC, AICTE, or the Ministry of Education.
            </div>
            <div>
              • <strong>Privacy:</strong> No personal or team data is collected or tracked.
            </div>
            <div>
              • <strong>Data Source:</strong> {metadata?.source || "Public SIH 2026 Problem Statement Registry"} ({psData?.length || 226} statements tracked).
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Go to Dashboard</Link>
          <Link href="/ps" className="btn btn-secondary">Explore Problem Statements</Link>
          <Link href="/radar" className="btn btn-secondary">Open Opportunity Radar</Link>
        </div>
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(AboutContent), { ssr: false });

export default function AboutPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
