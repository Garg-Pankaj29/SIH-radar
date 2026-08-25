"use client";
import Link from "next/link";
import {
  LuTrendingUp,
  LuUsers,
  LuZap,
  LuClock,
  LuArrowRight,
} from "react-icons/lu";

export default function TrendingNow({ psData, trends }) {
  const biggestMovers = trends?.biggest_movers?.length || 0;

  // Count newly crowded (fill > 50%)
  const newlyCrowded =
    psData?.filter(
      (ps) => ps.fill_percentage >= 50 && ps.competition_level === "High"
    ).length || 0;

  // Count rapidly emerging (low fill but high growth)
  const rapidlyEmerging =
    psData?.filter(
      (ps) => ps.fill_percentage < 20 && ps.velocity?.growth_24h > 10
    ).length || 0;

  // Count deadline alerts (< 5 days)
  const deadlineAlerts =
    psData?.filter(
      (ps) => ps.days_remaining !== null && ps.days_remaining <= 5
    ).length || 0;

  const items = [
    {
      title: "Biggest Movers",
      desc: "PS with highest increase",
      count: biggestMovers > 99 ? "99+" : biggestMovers,
      Icon: LuTrendingUp,
    },
    {
      title: "Newly Crowded",
      desc: "Crossed key fill thresholds",
      count: newlyCrowded < 10 ? `0${newlyCrowded}` : newlyCrowded,
      Icon: LuUsers,
    },
    {
      title: "Rapidly Emerging",
      desc: "Low fill, high momentum",
      count: rapidlyEmerging < 10 ? `0${rapidlyEmerging}` : rapidlyEmerging,
      Icon: LuZap,
    },
    {
      title: "Deadline Alerts",
      desc: "Fewer than 5 days left",
      count: deadlineAlerts < 10 ? `0${deadlineAlerts}` : deadlineAlerts,
      Icon: LuClock,
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Trending Now</span>
      </div>

      <div className="trending-list">
        {items.map((item, i) => {
          const IconComp = item.Icon;
          return (
            <div className="trending-item" key={i}>
              <div className="trending-icon">
                <IconComp size={18} />
              </div>
              <div className="trending-info">
                <div className="trending-title">{item.title}</div>
                <div className="trending-desc">{item.desc}</div>
              </div>
              <div className="trending-count">{item.count}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/intelligence" className="card-link">
          <span>View all trends</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
