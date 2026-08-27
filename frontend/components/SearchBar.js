"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../lib/DataContext";
import Link from "next/link";
import {
  LuSearch,
  LuFileText,
  LuBuilding,
  LuLayers,
  LuHash,
  LuX,
} from "react-icons/lu";

/**
 * SearchBar with live recommendation dropdown.
 *
 * Searches across PS numbers, titles, organizations, and themes.
 * Groups results by category and shows up to 8 recommendations.
 */
export default function SearchBar({ searchVal, setSearchVal }) {
  const { psData } = useData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Build a unique set of searchable items from psData
  const searchIndex = useMemo(() => {
    if (!psData || psData.length === 0) return [];

    const items = [];
    const seenOrgs = new Set();
    const seenThemes = new Set();

    for (const ps of psData) {
      // PS entry (number + title)
      items.push({
        type: "ps",
        label: ps.ps_number,
        subtitle: ps.title,
        href: `/ps/${ps.ps_number}`,
        searchText: `${ps.ps_number} ${ps.title}`.toLowerCase(),
      });

      // Organization (deduplicated)
      const org = ps.organization;
      if (org && !seenOrgs.has(org)) {
        seenOrgs.add(org);
        items.push({
          type: "org",
          label: org,
          subtitle: null,
          href: null,
          searchText: org.toLowerCase(),
        });
      }

      // Theme (deduplicated)
      const theme = ps.theme;
      if (theme && !seenThemes.has(theme)) {
        seenThemes.add(theme);
        items.push({
          type: "theme",
          label: theme,
          subtitle: null,
          href: null,
          searchText: theme.toLowerCase(),
        });
      }
    }

    return items;
  }, [psData]);

  // Filter recommendations
  const recommendations = useMemo(() => {
    if (!searchVal || searchVal.trim().length === 0) return [];
    const q = searchVal.toLowerCase().trim();

    const matches = searchIndex.filter((item) => item.searchText.includes(q));

    // Group by type and limit
    const psMatches = matches.filter((m) => m.type === "ps").slice(0, 4);
    const orgMatches = matches.filter((m) => m.type === "org").slice(0, 3);
    const themeMatches = matches.filter((m) => m.type === "theme").slice(0, 3);

    const grouped = [];
    if (psMatches.length > 0) grouped.push({ group: "Problem Statements", icon: LuFileText, items: psMatches });
    if (orgMatches.length > 0) grouped.push({ group: "Organizations", icon: LuBuilding, items: orgMatches });
    if (themeMatches.length > 0) grouped.push({ group: "Themes", icon: LuLayers, items: themeMatches });

    return grouped;
  }, [searchVal, searchIndex]);

  // Flat list of all items for keyboard navigation
  const flatItems = useMemo(() => {
    return recommendations.flatMap((g) => g.items);
  }, [recommendations]);

  const hasResults = flatItems.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset active index when recommendations change
  useEffect(() => {
    setActiveIdx(-1);
  }, [recommendations]);

  const handleSelect = useCallback(
    (item) => {
      setOpen(false);
      inputRef.current?.blur();
      if (item.href) {
        // PS item — navigate to detail page
        router.push(item.href);
      } else {
        // Org/Theme — navigate to PS listing with search pre-filled
        router.push(`/ps?q=${encodeURIComponent(item.label)}`);
      }
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!open || !hasResults) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
      } else if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        handleSelect(flatItems[activeIdx]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, hasResults, flatItems, activeIdx, handleSelect]
  );

  const handleClear = useCallback(() => {
    setSearchVal("");
    setOpen(false);
    inputRef.current?.focus();
  }, [setSearchVal]);

  // Track the flat index for rendering
  let flatIndex = -1;

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div className={`dash-search ${open && hasResults ? "search-open" : ""}`}>
        <LuSearch size={16} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search PS, Org, Theme..."
          value={searchVal || ""}
          onChange={(e) => {
            setSearchVal(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (searchVal && searchVal.trim().length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && hasResults}
          aria-autocomplete="list"
          aria-controls="search-recommendations"
        />
        {searchVal && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <LuX size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && hasResults && (
        <div className="search-dropdown" id="search-recommendations" role="listbox">
          {recommendations.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.group} className="search-group">
                <div className="search-group-label">
                  <GroupIcon size={13} />
                  <span>{group.group}</span>
                </div>
                {group.items.map((item) => {
                  flatIndex++;
                  const isActive = flatIndex === activeIdx;
                  const currentFlatIdx = flatIndex;

                  const content = (
                    <>
                      <div className="search-item-label">
                        {item.type === "ps" && <LuHash size={13} className="search-item-icon" />}
                        <span className="search-item-text">
                          {highlightMatch(item.label, searchVal)}
                        </span>
                      </div>
                      {item.subtitle && (
                        <div className="search-item-subtitle">
                          {highlightMatch(truncateText(item.subtitle, 55), searchVal)}
                        </div>
                      )}
                    </>
                  );

                  // PS items link directly to detail page
                  if (item.href) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`search-item ${isActive ? "search-item-active" : ""}`}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIdx(currentFlatIdx)}
                        onClick={() => setOpen(false)}
                      >
                        {content}
                      </Link>
                    );
                  }

                  // Org/Theme items set the search value
                  return (
                    <button
                      key={item.label}
                      className={`search-item ${isActive ? "search-item-active" : ""}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIdx(currentFlatIdx)}
                      onClick={() => handleSelect(item)}
                      type="button"
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            );
          })}

          <div className="search-footer">
            <LuSearch size={12} />
            <span>
              {flatItems.length} result{flatItems.length !== 1 ? "s" : ""} — use ↑↓ to navigate, Enter to select
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Highlight matched text
function highlightMatch(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="search-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function truncateText(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}
