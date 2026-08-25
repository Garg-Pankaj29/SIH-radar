"use client";
import { useState } from "react";
import { useData } from "../lib/DataContext";
import Sidebar from "./Sidebar";
import KPICards from "./KPICards";
import CompetitionOverview from "./CompetitionOverview";
import OpportunityRadar from "./OpportunityRadar";
import TrendingNow from "./TrendingNow";
import WatchlistPreview from "./WatchlistPreview";
import TopProblemStatements from "./TopProblemStatements";
import ThemeSaturation from "./ThemeSaturation";
import Footer from "./Footer";

export default function DashboardContent() {
  const { psData, kpis, themes, metadata, loading, error, trends, watchlist, darkMode, toggleTheme } = useData();
  const [searchVal, setSearchVal] = useState("");

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar metadata={null} />
        <div className="main-content">
          <div className="loading-state">
            <div className="loading-spinner" />
            <div className="loading-text">Loading SIH Intelligence...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <Sidebar metadata={null} />
        <div className="main-content">
          <div className="error-state">
            Failed to load intelligence data: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar metadata={metadata} />

      {/* Main Content */}
      <div className="main-content">
        <div className="main-inner">
          {/* Dashboard Header */}
          <div className="dash-header">
            <div className="dash-header-left">
              <div>
                <h1 className="dash-title">Dashboard</h1>
                <p className="dash-subtitle">SIH 2026</p>
              </div>

              <div className="dash-disclaimer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Data is based on publicly available SIH submission counts and related metadata. Submission count is a competition-demand proxy, not website traffic.
              </div>
            </div>

            <div className="dash-header-right">
              <div className="dash-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search PS, Org, Theme..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>

              {/* Bookmark Icon */}
              <button className="dash-icon-btn" title="Bookmarks">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </button>

              {/* Profile / Theme Toggle */}
              <button className="dash-icon-btn" onClick={toggleTheme} title="Toggle theme">
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" /><path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" /><path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* KPI Stats Row */}
          <KPICards kpis={kpis} />

          {/* Middle Row — 4 sections */}
          <div className="dashboard-middle">
            <CompetitionOverview kpis={kpis} />
            <OpportunityRadar psData={psData} />
            <TrendingNow psData={psData} trends={trends} />
            <WatchlistPreview watchlist={watchlist} psData={psData} />
          </div>

          {/* Bottom Row — Table + Theme Saturation */}
          <div className="dashboard-bottom">
            <TopProblemStatements psData={psData} />
            <ThemeSaturation themes={themes} />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
