"use client";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

function getCompLabel(level) {
  const map = {
    High: "HIGH",
    Medium: "MEDIUM",
    Low: "LOW COMP.",
    "None yet": "NONE",
  };
  return map[level] || level;
}

function getCompBadgeClass(level) {
  const map = {
    High: "badge-high",
    Medium: "badge-medium",
    Low: "badge-low",
    "None yet": "badge-none",
  };
  return map[level] || "badge-none";
}

export default function WatchlistPreview({ watchlist, psData }) {
  if (!watchlist || watchlist.length === 0 || !psData) {
    // Show default candidate items matching dashboard preview
    const placeholders = [
      {
        ps: "PS #72",
        change: "12% → 18%",
        subs: "+23 submissions",
        badge: "LOW COMP.",
        badgeClass: "badge-low",
        dotColor: "#52b788",
      },
      {
        ps: "PS #113",
        change: "34% → 41%",
        subs: "+28 submissions",
        badge: "MEDIUM",
        badgeClass: "badge-medium",
        dotColor: "#e8a54b",
      },
      {
        ps: "PS #17",
        change: "71% → 78%",
        subs: "+42 submissions",
        badge: "HIGH",
        badgeClass: "badge-high",
        dotColor: "#c0392b",
      },
      {
        ps: "PS #88",
        change: "8% → 12%",
        subs: "+15 submissions",
        badge: "LOW COMP.",
        badgeClass: "badge-low",
        dotColor: "#52b788",
      },
    ];

    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">Watchlist ({placeholders.length})</span>
        </div>
        <div className="watchlist-items">
          {placeholders.map((item, i) => (
            <div className="watchlist-item" key={i}>
              <span className="watchlist-item-dot" style={{ background: item.dotColor }} />
              <div className="watchlist-item-info">
                <div className="watchlist-item-ps">{item.ps}</div>
                <div className="watchlist-item-sub">{item.subs}</div>
              </div>
              <div className="watchlist-item-right">
                <div className="watchlist-item-change">{item.change}</div>
                <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "16px" }}>
          <Link href="/watchlist" className="card-link">
            <span>View watchlist</span>
            <LuArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Real watchlist data
  const items = watchlist
    .slice(0, 4)
    .map((psNum) => {
      const ps = psData.find(
        (p) =>
          p.ps_number === psNum ||
          String(p.sno) === String(psNum) ||
          p.ps_number?.replace("SIH26", "") === String(psNum)
      );
      if (!ps) return null;
      const compLabel = getCompLabel(ps.competition_level);
      const dotColor =
        ps.competition_level === "High"
          ? "#c0392b"
          : ps.competition_level === "Medium"
          ? "#e8a54b"
          : "#52b788";
      return {
        ps: ps.ps_number,
        change: `${ps.fill_percentage}%`,
        subs: `${ps.ideas_submitted} submissions`,
        badge: compLabel,
        badgeClass: getCompBadgeClass(ps.competition_level),
        dotColor,
      };
    })
    .filter(Boolean);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Watchlist ({watchlist.length})</span>
      </div>
      <div className="watchlist-items">
        {items.map((item, i) => (
          <div className="watchlist-item" key={i}>
            <span className="watchlist-item-dot" style={{ background: item.dotColor }} />
            <div className="watchlist-item-info">
              <div className="watchlist-item-ps">{item.ps}</div>
              <div className="watchlist-item-sub">{item.subs}</div>
            </div>
            <div className="watchlist-item-right">
              <div className="watchlist-item-change">{item.change}</div>
              <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Link href="/watchlist" className="card-link">
          <span>View watchlist</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
