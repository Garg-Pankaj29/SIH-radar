"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [psData, setPsData] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [themes, setThemes] = useState({});
  const [trends, setTrends] = useState({});
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [teamSkills, setTeamSkills] = useState([]);
  const [teamPrefs, setTeamPrefs] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("sih_watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
    const skills = localStorage.getItem("sih_team_skills");
    if (skills) setTeamSkills(JSON.parse(skills));
    const prefs = localStorage.getItem("sih_team_prefs");
    if (prefs) setTeamPrefs(JSON.parse(prefs));
    const theme = localStorage.getItem("sih_theme");
    if (theme === "light") { setDarkMode(false); document.documentElement.setAttribute("data-theme", "light"); }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
        const apiPath = baseUrl ? `${baseUrl}/api` : "/api";

        const [psRes, kpiRes, themeRes, trendRes, metaRes] = await Promise.all([
          fetch(`${apiPath}/problem_statements.json`),
          fetch(`${apiPath}/kpis.json`),
          fetch(`${apiPath}/themes.json`),
          fetch(`${apiPath}/trends.json`),
          fetch(`${apiPath}/metadata.json`),
        ]);

        setPsData(await psRes.json());
        setKpis(await kpiRes.json());
        setThemes(await themeRes.json());
        setTrends(await trendRes.json());
        setMetadata(await metaRes.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleWatchlist = useCallback((psNum) => {
    setWatchlist((prev) => {
      const next = prev.includes(psNum) ? prev.filter((p) => p !== psNum) : [...prev, psNum];
      localStorage.setItem("sih_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const updateTeamSkills = useCallback((skills) => {
    setTeamSkills(skills);
    localStorage.setItem("sih_team_skills", JSON.stringify(skills));
  }, []);

  const updateTeamPrefs = useCallback((prefs) => {
    setTeamPrefs(prefs);
    localStorage.setItem("sih_team_prefs", JSON.stringify(prefs));
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("sih_theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  const toggleCompare = useCallback((psNum) => {
    setCompareList((prev) => {
      if (prev.includes(psNum)) return prev.filter((p) => p !== psNum);
      if (prev.length >= 5) return prev;
      return [...prev, psNum];
    });
  }, []);

  const getPS = useCallback((psNum) => psData.find((p) => p.ps_number === psNum), [psData]);

  return (
    <DataContext.Provider value={{
      psData, kpis, themes, trends, metadata, loading, error,
      watchlist, toggleWatchlist,
      teamSkills, updateTeamSkills, teamPrefs, updateTeamPrefs,
      darkMode, toggleTheme,
      compareList, toggleCompare, setCompareList,
      getPS,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
