"use client";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useData } from "../lib/DataContext";

export default function AppShell({ children, title, subtitle, searchVal, setSearchVal, actions }) {
  const { metadata, darkMode, toggleTheme } = useData();

  return (
    <div className="app-layout">
      <Sidebar metadata={metadata} />

      <div className="main-content">
        <div className="main-inner">
          {(title || actions || setSearchVal) && (
            <div className="dash-header" style={{ marginBottom: '24px' }}>
              <div className="dash-header-left">
                <div>
                  {title && <h1 className="dash-title">{title}</h1>}
                  {subtitle && <p className="dash-subtitle">{subtitle}</p>}
                </div>
              </div>

              <div className="dash-header-right">
                {setSearchVal && (
                  <div className="dash-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search PS, Org, Theme..."
                      value={searchVal || ""}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                  </div>
                )}

                {actions}

                {/* Theme Toggle */}
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
          )}

          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}
