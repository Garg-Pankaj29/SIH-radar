"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "../lib/DataContext";
import {
  LuLayoutDashboard,
  LuFileText,
  LuRadar,
  LuTrendingUp,
  LuBookmark,
  LuGitCompare,
  LuLayers,
  LuUsers,
  LuBell,
  LuFileSpreadsheet,
  LuInfo,
  LuRefreshCw,
  LuRadio,
  LuMenu,
  LuX,
  LuSun,
  LuMoon,
} from "react-icons/lu";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LuLayoutDashboard },
  { href: "/ps", label: "Problem Statements", icon: LuFileText },
  { href: "/radar", label: "Opportunity Radar", icon: LuRadar },
  { href: "/intelligence", label: "Trends", icon: LuTrendingUp },
  { href: "/watchlist", label: "Watchlist", icon: LuBookmark },
  { href: "/compare", label: "Compare", icon: LuGitCompare },
  { href: "/themes", label: "Themes", icon: LuLayers },
  { href: "/team", label: "Team Profile", icon: LuUsers },
  { href: "/alerts", label: "Alerts", icon: LuBell },
  { href: "/export", label: "Reports", icon: LuFileSpreadsheet },
  { href: "/about", label: "About", icon: LuInfo },
];

export default function Sidebar({ metadata }) {
  const pathname = usePathname();
  const { isRefreshing, refreshData, lastRefreshTime, darkMode, toggleTheme } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");

  // Format time live on client side
  useEffect(() => {
    const updateTime = () => {
      const targetTime = lastRefreshTime || (metadata?.generated_at ? new Date(metadata.generated_at) : new Date());
      try {
        const str = targetTime.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setFormattedTime(str);
      } catch (e) {
        setFormattedTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lastRefreshTime, metadata]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Header (Visible on screens <= 900px) */}
      <header className="mobile-header">
        <div className="mobile-header-brand">
          <div className="sidebar-logo" style={{ width: "34px", height: "34px", background: "transparent", boxShadow: "none" }}>
            <img
              src="/logo.png"
              alt="SIH Opportunity Radar Logo"
              width={34}
              height={34}
              style={{ objectFit: "contain", borderRadius: "50%", display: "block" }}
            />
          </div>
          <span className="sidebar-brand-title" style={{ fontSize: "1.05rem" }}>
            SIH Radar
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="mobile-header-btn"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <LuSun size={18} /> : <LuMoon size={18} />}
          </button>

          <button
            className="mobile-header-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop fixed sidebar + Mobile slide-out drawer) */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo" style={{ width: "42px", height: "42px", background: "transparent", boxShadow: "none" }}>
            <img
              src="/logo.png"
              alt="SIH Opportunity Radar Logo"
              width={42}
              height={42}
              style={{ objectFit: "contain", borderRadius: "50%", display: "block" }}
            />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">SIH Radar</span>
            <span className="sidebar-brand-sub">
              Track competition.
              <br />
              Find opportunity.
            </span>
          </div>

          {/* Close button for mobile drawer */}
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Status */}
        <div className="sidebar-footer">
          <div className="sidebar-meta">
            <div>
              <div className="sidebar-meta-text">Last Updated</div>
              <div className="sidebar-meta-date">
                {formattedTime || "Loading..."}
              </div>
            </div>
            <button
              className={`sidebar-refresh-btn ${isRefreshing ? "spinning" : ""}`}
              onClick={() => refreshData()}
              title="Click to refresh intelligence data now"
              aria-label="Refresh data"
              disabled={isRefreshing}
            >
              <LuRefreshCw size={15} />
            </button>
          </div>
          <div className="sidebar-status">
            <LuRadio size={13} className="sidebar-status-pulse" />
            <span>{isRefreshing ? "Syncing..." : "Data is Live"}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
