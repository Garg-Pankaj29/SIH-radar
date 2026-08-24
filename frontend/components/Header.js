"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "../lib/DataContext";

export default function Header({ searchVal, setSearchVal }) {
  const pathname = usePathname();
  const { darkMode, toggleTheme, watchlist, compareList, metadata } = useData();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">SIH</div>
          <div>
            <Link href="/" style={{ color: 'inherit' }}>
              <span className="header-title">Opportunity Radar</span>
            </Link>
            <span className="header-badge" style={{ marginLeft: '8px' }}>SIH 2026</span>
          </div>
        </div>

        {setSearchVal !== undefined && (
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search PS #, title, org, tag..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
        )}

        <nav className="header-nav">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Dashboard</Link>
          <Link href="/radar" className={pathname === "/radar" ? "active" : ""}>Opportunity Radar</Link>
          <Link href="/watchlist" className={pathname === "/watchlist" ? "active" : ""}>
            Watchlist {watchlist.length > 0 && `(${watchlist.length})`}
          </Link>
          <Link href="/compare" className={pathname === "/compare" ? "active" : ""}>
            Compare {compareList.length > 0 && `(${compareList.length})`}
          </Link>
          <Link href="/team" className={pathname === "/team" ? "active" : ""}>Team Fit</Link>
          <Link href="/themes" className={pathname === "/themes" ? "active" : ""}>Themes</Link>
          <Link href="/intelligence" className={pathname === "/intelligence" ? "active" : ""}>Daily Report</Link>
          <Link href="/export" className={pathname === "/export" ? "active" : ""}>Export</Link>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
