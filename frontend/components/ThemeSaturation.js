"use client";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

export default function ThemeSaturation({ themes }) {
  if (!themes) return null;

  // Get top 5 themes by average fill (saturation)
  const themeEntries = Object.entries(themes)
    .map(([name, data]) => ({
      name: name.length > 18 ? name.slice(0, 18) + "…" : name,
      fullName: name,
      avgFill: data.average_fill || 0,
      psCount: data.ps_count || 0,
    }))
    .sort((a, b) => b.avgFill - a.avgFill)
    .slice(0, 5);

  const shortLabels = {
    Miscellaneous: "AI / ML",
    "Agriculture, FoodTech & Rural Development": "Agriculture",
    "Smart Resource Conservation": "Smart Resource",
    "Blockchain & Cybersecurity": "Cybersecurity",
    "Disaster Management": "Disaster Mgmt",
    "Smart Automation": "Smart Auto",
    "Smart Education": "Smart Education",
    "Toys & Games": "Toys & Games",
    "Fitness & Sports": "Fitness & Sports",
    "MedTech / BioTech / HealthTech": "Healthcare",
    "Heritage & Culture": "Heritage",
    "Transportation & Logistics": "Transport",
    "Space Technology": "Space Tech",
    "Robotics and Drones": "IoT",
    "Clean & Green Technology": "Clean Tech",
    "Travel & Tourism": "Travel",
    "Renewable / Sustainable Energy": "Renewable",
    "Smart Vehicles": "Smart Vehicles",
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Theme Saturation</span>
      </div>

      <div className="theme-sat-list">
        {themeEntries.map((theme, i) => (
          <div className="theme-sat-item" key={i}>
            <span className="theme-sat-label" title={theme.fullName}>
              {shortLabels[theme.fullName] || theme.name}
            </span>
            <div className="theme-sat-bar">
              <div
                className="theme-sat-fill"
                style={{ width: `${Math.min(theme.avgFill * 1.5, 100)}%` }}
              />
            </div>
            <span className="theme-sat-value">{Math.round(theme.avgFill)}%</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/themes" className="card-link">
          <span>View all themes</span>
          <LuArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
