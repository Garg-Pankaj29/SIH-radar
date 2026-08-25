"use client";
import { useState } from "react";
import Link from "next/link";
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
import {
  LuInfo,
  LuSearch,
  LuBookmark,
  LuSun,
  LuMoon,
} from "react-icons/lu";

export default function DashboardContent() {
  const {
    psData,
    kpis,
    themes,
    metadata,
    loading,
    error,
    trends,
    watchlist,
    darkMode,
    toggleTheme,
  } = useData();
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
                <LuInfo size={16} style={{ flexShrink: 0 }} />
                <span>
                  Data is based on publicly available SIH submission counts and related metadata. Submission count is a competition-demand proxy, not website traffic.
                </span>
              </div>
            </div>

            <div className="dash-header-right">
              <div className="dash-search">
                <LuSearch size={16} />
                <input
                  type="text"
                  placeholder="Search PS, Org, Theme..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>

              {/* Bookmark Button */}
              <Link href="/watchlist" className="dash-icon-btn" title="View Watchlist" aria-label="Watchlist">
                <LuBookmark size={18} />
              </Link>

              {/* Theme Toggle */}
              <button
                className="dash-icon-btn"
                onClick={toggleTheme}
                title="Toggle theme"
                aria-label="Toggle theme"
              >
                {darkMode ? <LuSun size={18} /> : <LuMoon size={18} />}
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
