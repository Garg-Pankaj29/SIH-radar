"use client";

export default function TrendingNow({ psData, trends }) {
  // Calculate trending stats from data
  const biggestMovers = trends?.biggest_movers?.length || 0;

  // Count newly crowded (fill > 50%)
  const newlyCrowded = psData?.filter(
    (ps) => ps.fill_percentage >= 50 && ps.competition_level === "High"
  ).length || 0;

  // Count rapidly emerging (low fill but high growth)
  const rapidlyEmerging = psData?.filter(
    (ps) => ps.fill_percentage < 20 && ps.velocity?.growth_24h > 10
  ).length || 0;

  // Count deadline alerts (< 5 days)
  const deadlineAlerts = psData?.filter(
    (ps) => ps.days_remaining !== null && ps.days_remaining <= 5
  ).length || 0;

  const items = [
    {
      title: "Biggest Movers",
      desc: "PS with highest increase",
      count: biggestMovers > 99 ? "99+" : biggestMovers,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 17 9.2-9.2M17 17V7H7" />
        </svg>
      ),
    },
    {
      title: "Newly Crowded",
      desc: "Crossed key fill thresholds",
      count: newlyCrowded < 10 ? `0${newlyCrowded}` : newlyCrowded,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Rapidly Emerging",
      desc: "Low fill, high momentum",
      count: rapidlyEmerging < 10 ? `0${rapidlyEmerging}` : rapidlyEmerging,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      title: "Deadline Alerts",
      desc: "Fewer than 5 days left",
      count: deadlineAlerts < 10 ? `0${deadlineAlerts}` : deadlineAlerts,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Trending Now</span>
      </div>

      <div className="trending-list">
        {items.map((item, i) => (
          <div className="trending-item" key={i}>
            <div className="trending-icon">{item.icon}</div>
            <div className="trending-info">
              <div className="trending-title">{item.title}</div>
              <div className="trending-desc">{item.desc}</div>
            </div>
            <div className="trending-count">{item.count}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <a href="/intelligence" className="card-link">
          View all trends
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
