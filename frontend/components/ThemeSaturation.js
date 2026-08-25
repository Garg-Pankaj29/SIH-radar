"use client";

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

  // Short labels for display matching the screenshot style
  const shortLabels = {
    "Miscellaneous": "AI / ML",
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
        <a href="/themes" className="card-link">
          View all themes
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
