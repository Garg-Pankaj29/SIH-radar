"use client";
import { useState } from "react";
import { DataProvider, useData } from "../lib/DataContext";
import Header from "../components/Header";
import KPICards from "../components/KPICards";
import FilterPanel from "../components/FilterPanel";
import PSTable from "../components/PSTable";
import DataDisclaimer from "../components/DataDisclaimer";
import Link from "next/link";
import { searchFilter } from "../lib/utils";

function DashboardContent() {
  const { psData, kpis, metadata, loading, error, trends } = useData();
  const [searchVal, setSearchVal] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    competition: "All",
    opportunity: "All",
    complexity: "All",
    theme: "All",
    datasetOnly: false,
  });

  if (loading) {
    return (
      <div className="container page" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div className="loading" suppressHydrationWarning>
          📡 Loading SIH Opportunity Intelligence...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page" style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--red)' }}>
        ⚠️ Failed to load intelligence data: {error}
      </div>
    );
  }

  // Filter dataset
  const filteredData = psData.filter((r) => {
    if (!searchFilter(r, searchVal)) return false;
    if (filters.category !== "All" && r.category !== filters.category) return false;
    if (filters.competition !== "All" && r.competition_level !== filters.competition) return false;
    if (filters.opportunity !== "All" && r.opportunity_category !== filters.opportunity) return false;
    if (filters.complexity !== "All" && r.prototype_complexity?.level !== filters.complexity) return false;
    if (filters.datasetOnly && !r.resources?.resources?.find(x => x.name === "Dataset")?.available) return false;
    return true;
  });

  const biggestMovers = trends?.biggest_movers || [];

  return (
    <>
      <Header searchVal={searchVal} setSearchVal={setSearchVal} />

      <main className="container page">
        {metadata?.demo_mode && (
          <div className="demo-banner">
            ⚡ DEMO MODE ACTIVE: Displaying simulated historical submission velocity and trend metrics for hackathon demonstration.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 className="page-title">Smart India Hackathon 2026 Intelligence</h1>
            <p className="page-subtitle">
              Submission counter competition intelligence &amp; opportunity detection engine (226 Problem Statements)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/radar" className="btn btn-primary">🎯 Open Opportunity Radar</Link>
            <Link href="/team" className="btn btn-secondary">⚡ Check Team Fit</Link>
          </div>
        </div>

        {/* Top KPI Cards */}
        <KPICards kpis={kpis} />

        {/* What's Changing Section */}
        {biggestMovers.length > 0 && (
          <div className="card" style={{ marginBottom: '28px', background: 'var(--bg-card)' }}>
            <div className="card-header">
              <span className="card-title">🚀 Biggest Movers (Last 24h Velocity)</span>
              <Link href="/intelligence" className="btn btn-ghost btn-sm">Full Report →</Link>
            </div>
            <div className="grid-3" style={{ marginBottom: 0 }}>
              {biggestMovers.slice(0, 3).map((m) => (
                <div key={m.ps_number} style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                    <Link href={`/ps/${m.ps_number}`}>{m.ps_number}</Link>
                    <span style={{ color: 'var(--green)' }}>+{m.growth} in {m.period}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {m.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter controls */}
        <FilterPanel filters={filters} setFilters={setFilters} />

        {/* PS Ranking Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
            Showing {filteredData.length} of {psData.length} Problem Statements
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click any column header to sort
          </div>
        </div>

        <PSTable data={filteredData} />

        {/* Methodology notice */}
        <DataDisclaimer metadata={metadata} />
      </main>
    </>
  );
}

export default function Dashboard() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
