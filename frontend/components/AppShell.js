"use client";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import { useData } from "../lib/DataContext";
import { LuSun, LuMoon } from "react-icons/lu";

export default function AppShell({ children, title, subtitle, searchVal, setSearchVal, actions }) {
  const { metadata, darkMode, toggleTheme } = useData();

  return (
    <div className="app-layout">
      <Sidebar metadata={metadata} />

      <div className="main-content">
        <div className="main-inner">
          {(title || actions || setSearchVal) && (
            <div className="dash-header" style={{ marginBottom: "24px" }}>
              <div className="dash-header-left">
                <div>
                  {title && <h1 className="dash-title">{title}</h1>}
                  {subtitle && <p className="dash-subtitle">{subtitle}</p>}
                </div>
              </div>

              <div className="dash-header-right">
                {setSearchVal && (
                  <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} />
                )}

                {actions}

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
          )}

          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}

