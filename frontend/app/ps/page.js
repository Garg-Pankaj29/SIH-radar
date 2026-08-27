"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import FilterPanel from "../../components/FilterPanel";
import PSTable from "../../components/PSTable";
import { searchFilter } from "../../lib/utils";

function PSListContent() {
  const { psData, loading, error } = useData();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get("q") || "");

  // Sync searchVal when URL query changes (e.g. navigating from SearchBar dropdown)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchVal(q);
  }, [searchParams]);
  const [filters, setFilters] = useState({
    category: "All",
    competition: "All",
    opportunity: "All",
    complexity: "All",
    theme: "All",
    datasetOnly: false,
  });

  if (loading) {
    return (
      <AppShell title="Problem Statements" subtitle="Smart India Hackathon 2026">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading problem statements...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Problem Statements" subtitle="Smart India Hackathon 2026">
        <div className="error-state">Failed to load problem statements: {error}</div>
      </AppShell>
    );
  }

  const filteredData = psData.filter((r) => {
    if (!searchFilter(r, searchVal)) return false;
    if (filters.category !== "All" && r.category !== filters.category) return false;
    if (filters.competition !== "All" && r.competition_level !== filters.competition) return false;
    if (filters.opportunity !== "All" && r.opportunity_category !== filters.opportunity) return false;
    if (filters.complexity !== "All" && r.prototype_complexity?.level !== filters.complexity) return false;
    if (filters.datasetOnly && !r.resources?.resources?.find((x) => x.name === "Dataset")?.available) return false;
    return true;
  });

  return (
    <AppShell
      title="Problem Statements"
      subtitle={`National problem statement repository (${filteredData.length} of ${psData.length} statements)`}
      searchVal={searchVal}
      setSearchVal={setSearchVal}
    >
      <FilterPanel filters={filters} setFilters={setFilters} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
          Showing {filteredData.length} Problem Statements
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Click any column header to sort
        </div>
      </div>

      <PSTable data={filteredData} />
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(PSListContent), { ssr: false });

export default function PSPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
