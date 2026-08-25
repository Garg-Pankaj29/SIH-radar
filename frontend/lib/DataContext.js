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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [teamSkills, setTeamSkills] = useState([]);
  const [teamPrefs, setTeamPrefs] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [compareList, setCompareList] = useState([]);

  // Load persisted states from localStorage
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem("sih_watchlist");
      if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));

      const savedCompare = localStorage.getItem("sih_compare");
      if (savedCompare) setCompareList(JSON.parse(savedCompare));

      const skills = localStorage.getItem("sih_team_skills");
      if (skills) setTeamSkills(JSON.parse(skills));

      const prefs = localStorage.getItem("sih_team_prefs");
      if (prefs) setTeamPrefs(JSON.parse(prefs));

      const theme = localStorage.getItem("sih_theme");
      if (theme === "light") {
        setDarkMode(false);
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch (e) {
      console.error("Failed to load local storage preferences", e);
    }
  }, []);

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      // All API calls go through Next.js server-side proxy routes.
      // The real backend URL is NEVER exposed to the client bundle.
      const cacheBust = isManual ? `?t=${Date.now()}` : "";

      const [psRes, kpiRes, themeRes, trendRes, metaRes] = await Promise.all([
        fetch(`/api/ps${cacheBust}`),
        fetch(`/api/kpis${cacheBust}`),
        fetch(`/api/themes${cacheBust}`),
        fetch(`/api/trends${cacheBust}`),
        fetch(`/api/metadata${cacheBust}`),
      ]);

      const [ps, kp, th, tr, mt] = await Promise.all([
        psRes.json(),
        kpiRes.json(),
        themeRes.json(),
        trendRes.json(),
        metaRes.json(),
      ]);

      setPsData(ps);
      setKpis(kp);
      setThemes(th);
      setTrends(tr);
      setMetadata(mt);
      setLastRefreshTime(new Date());
      setError(null);
    } catch (e) {
      console.error("Data load error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  const refreshData = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  const toggleWatchlist = useCallback((psNum) => {
    setWatchlist((prev) => {
      const next = prev.includes(psNum) ? prev.filter((p) => p !== psNum) : [...prev, psNum];
      try {
        localStorage.setItem("sih_watchlist", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const toggleCompare = useCallback((psNum) => {
    setCompareList((prev) => {
      const next = prev.includes(psNum)
        ? prev.filter((p) => p !== psNum)
        : prev.length >= 5
        ? prev
        : [...prev, psNum];
      try {
        localStorage.setItem("sih_compare", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const updateTeamSkills = useCallback((skills) => {
    setTeamSkills(skills);
    try {
      localStorage.setItem("sih_team_skills", JSON.stringify(skills));
    } catch (e) {}
  }, []);

  const updateTeamPrefs = useCallback((prefs) => {
    setTeamPrefs(prefs);
    try {
      localStorage.setItem("sih_team_prefs", JSON.stringify(prefs));
    } catch (e) {}
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      try {
        localStorage.setItem("sih_theme", next ? "dark" : "light");
      } catch (e) {}
      return next;
    });
  }, []);

  const getPS = useCallback(
    (psNum) => {
      if (!psNum) return null;
      const cleanNum = String(psNum).trim().toLowerCase();
      return psData.find(
        (p) =>
          p.ps_number?.toLowerCase() === cleanNum ||
          String(p.sno) === cleanNum ||
          p.ps_number?.toLowerCase().replace("sih26", "") === cleanNum ||
          cleanNum.replace("sih26", "") === String(p.sno)
      );
    },
    [psData]
  );

  return (
    <DataContext.Provider
      value={{
        psData,
        kpis,
        themes,
        trends,
        metadata,
        loading,
        isRefreshing,
        lastRefreshTime,
        refreshData,
        error,
        watchlist,
        toggleWatchlist,
        teamSkills,
        updateTeamSkills,
        teamPrefs,
        updateTeamPrefs,
        darkMode,
        toggleTheme,
        compareList,
        toggleCompare,
        setCompareList,
        getPS,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
