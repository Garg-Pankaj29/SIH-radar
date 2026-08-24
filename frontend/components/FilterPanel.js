"use client";

export default function FilterPanel({ filters, setFilters, availableThemes = [] }) {
  const categories = ["All", "Software", "Hardware"];
  const compLevels = ["All", "High", "Medium", "Low", "None yet"];
  const oppCategories = ["All", "HOT", "CROWDED", "EMERGING", "HIDDEN GEM", "WATCH"];
  const complexities = ["All", "Low", "Medium", "High"];

  const update = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const clearAll = () => {
    setFilters({
      category: "All",
      competition: "All",
      opportunity: "All",
      complexity: "All",
      theme: "All",
      datasetOnly: false,
    });
  };

  return (
    <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          🔍 Smart Filters
        </span>
        <button className="btn btn-ghost btn-sm" onClick={clearAll}>Reset Filters</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Category */}
        <div className="filter-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '90px' }}>Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${filters.category === cat ? "active" : ""}`}
              onClick={() => update("category", cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Opportunity Profile */}
        <div className="filter-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '90px' }}>Opportunity:</span>
          {oppCategories.map((opp) => (
            <button
              key={opp}
              className={`filter-chip ${filters.opportunity === opp ? "active" : ""}`}
              onClick={() => update("opportunity", opp)}
            >
              {opp}
            </button>
          ))}
        </div>

        {/* Competition Level */}
        <div className="filter-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '90px' }}>Competition:</span>
          {compLevels.map((comp) => (
            <button
              key={comp}
              className={`filter-chip ${filters.competition === comp ? "active" : ""}`}
              onClick={() => update("competition", comp)}
            >
              {comp}
            </button>
          ))}
        </div>

        {/* Prototype Complexity */}
        <div className="filter-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '90px' }}>Complexity:</span>
          {complexities.map((c) => (
            <button
              key={c}
              className={`filter-chip ${filters.complexity === c ? "active" : ""}`}
              onClick={() => update("complexity", c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Dataset Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.datasetOnly}
              onChange={(e) => update("datasetOnly", e.target.checked)}
            />
            Dataset / Resources Available Only
          </label>
        </div>
      </div>
    </div>
  );
}
