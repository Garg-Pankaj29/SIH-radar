export const SKILLS = [
  "Python","JavaScript","React","Node.js","C++","Java","Machine Learning",
  "Deep Learning","Computer Vision","IoT","Arduino","ESP32","Cybersecurity",
  "Cloud","Database","UI/UX","GIS","Blockchain","AR/VR","NLP","Robotics","Data Analytics",
];

export const COMPETITION_COLORS = {
  "High": "var(--red)", "Medium": "var(--yellow)", "Low": "var(--green)", "None yet": "var(--text-muted)",
};

export const OPP_COLORS = {
  "HOT": "#ef4444", "CROWDED": "#f97316", "EMERGING": "#06b6d4",
  "HIDDEN GEM": "#22c55e", "WATCH": "#f59e0b",
};

export const OPP_LABELS = {
  "HOT": "🔥 Hot", "CROWDED": "🚫 Crowded", "EMERGING": "🚀 Emerging",
  "HIDDEN GEM": "💎 Hidden Gem", "WATCH": "👀 Watch",
};

export function getCompBadgeClass(level) {
  const map = { "High": "badge-high", "Medium": "badge-medium", "Low": "badge-low", "None yet": "badge-none" };
  return map[level] || "badge-none";
}

export function getOppBadgeClass(cat) {
  const map = { "HOT": "badge-hot", "CROWDED": "badge-crowded", "EMERGING": "badge-emerging", "HIDDEN GEM": "badge-hidden", "WATCH": "badge-watch" };
  return map[cat] || "badge-none";
}

export function getFillClass(pct) {
  if (pct >= 50) return "fill-high";
  if (pct >= 10) return "fill-med";
  return "fill-low";
}

export function formatNumber(n) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString();
}

export function truncate(str, len = 60) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export function searchFilter(ps, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    ps.ps_number?.toLowerCase().includes(q) ||
    ps.title?.toLowerCase().includes(q) ||
    ps.organization?.toLowerCase().includes(q) ||
    ps.theme?.toLowerCase().includes(q) ||
    ps.technology_tags?.some(t => t.toLowerCase().includes(q))
  );
}

export function exportCSV(data, filename = "sih_export.csv") {
  const headers = ["PS Number","Title","Organization","Category","Theme","Submissions","Capacity","Fill %","Competition","Opportunity","Days Left"];
  const rows = data.map(r => [
    r.ps_number, `"${(r.title||'').replace(/"/g,'""')}"`, `"${(r.organization||'').replace(/"/g,'""')}"`,
    r.category, r.theme, r.ideas_submitted, r.submission_capacity,
    r.fill_percentage, r.competition_level, r.opportunity_category, r.days_remaining ?? "",
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
