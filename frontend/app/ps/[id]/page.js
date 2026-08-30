"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../../lib/DataContext";
import AppShell from "../../../components/AppShell";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCompBadgeClass, getOppBadgeClass, getFillClass } from "../../../lib/utils";
import {
  LuStar,
  LuPlus,
  LuCheck,
  LuArrowLeft,
  LuExternalLink,
  LuSparkles,
} from "react-icons/lu";

function PSDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { getPS, watchlist, toggleWatchlist, compareList, toggleCompare, loading, error } = useData();

  if (loading) {
    return (
      <AppShell title={`Problem Statement ${id}`} subtitle="Loading details...">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading problem statement details...</div>
        </div>
      </AppShell>
    );
  }

  const ps = getPS(id);
  if (!ps) {
    return (
      <AppShell title="Problem Statement Not Found" subtitle={`No record found for ${id}`}>
        <div className="card empty-state" style={{ textAlign: "center", padding: "48px 24px" }}>
          <h2>Problem Statement {id} Not Found</h2>
          <p style={{ marginTop: "8px", color: "var(--text-muted)" }}>
            The problem statement ID may be incorrect or removed.
          </p>
          <Link href="/ps" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Browse All Problem Statements
          </Link>
        </div>
      </AppShell>
    );
  }

  const isSaved = watchlist.includes(ps.ps_number);
  const isCompared = compareList.includes(ps.ps_number);

  return (
    <AppShell
      title={ps.ps_number}
      subtitle={ps.title}
      actions={
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`btn ${isSaved ? "btn-secondary" : "btn-primary"} btn-sm`}
            onClick={() => toggleWatchlist(ps.ps_number)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <LuStar size={14} fill={isSaved ? "currentColor" : "none"} />
            <span>{isSaved ? "Watchlisted" : "Watchlist"}</span>
          </button>
          <button
            className={`btn ${isCompared ? "btn-primary" : "btn-secondary"} btn-sm`}
            onClick={() => toggleCompare(ps.ps_number)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {isCompared ? <LuCheck size={14} /> : <LuPlus size={14} />}
            <span>{isCompared ? "Compared" : "Compare"}</span>
          </button>
        </div>
      }
    >
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/ps");
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            color: "var(--accent)",
            fontWeight: "600",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <LuArrowLeft size={16} />
          <span>Back to Problem Statements</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
              <span className="badge badge-software" style={{ fontSize: "0.8rem" }}>{ps.ps_number}</span>
              <span className={`badge ${ps.category === "Software" ? "badge-software" : "badge-hardware"}`}>{ps.category}</span>
              <span className={`badge ${getCompBadgeClass(ps.competition_level)}`}>{ps.competition_level} Competition</span>
              <span className={`badge ${getOppBadgeClass(ps.opportunity_category)}`}>{ps.opportunity_category}</span>
            </div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "8px", lineHeight: "1.3" }}>{ps.title}</h1>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              <strong>Organization:</strong> {ps.organization} | <strong>Theme:</strong> {ps.theme}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom" style={{ alignItems: "start" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Competition Status */}
          <div className="card">
            <h2 className="section-title" style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "14px" }}>Competition Status</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: ps.fill_percentage > 50 ? "var(--red)" : "var(--green)" }}>
                {ps.ideas_submitted} <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/ 500 Submissions</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                  <span>Capacity Utilization</span>
                  <span style={{ fontWeight: "700" }}>{ps.fill_percentage}%</span>
                </div>
                <div className="fill-bar" style={{ height: "10px" }}>
                  <div className={`fill-bar-inner ${getFillClass(ps.fill_percentage)}`} style={{ width: `${Math.min(ps.fill_percentage, 100)}%` }} />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Submission Momentum</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginTop: "2px", color: ps.velocity?.momentum?.includes("Rising") ? "var(--green)" : "var(--text-primary)" }}>
                  {ps.velocity?.momentum || "Normal"}
                </div>
              </div>
              <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginTop: "2px", color: (ps.velocity?.growth_24h || 0) > 0 ? "var(--green)" : "var(--text-secondary)" }}>
                  {ps.velocity?.growth_24h > 0 ? `+${ps.velocity.growth_24h}` : (ps.velocity?.growth_24h ?? 0)} in 24h
                </div>
              </div>
              <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Days Remaining</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginTop: "2px" }}>
                  {ps.days_remaining !== null ? `${ps.days_remaining} Days` : "—"}
                </div>
              </div>
              <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Deadline Pressure</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginTop: "2px" }}>
                  {ps.deadline_pressure || "Normal"}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="section-title" style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "12px" }}>Problem Statement Description</h2>
            <div style={{ whiteSpace: "pre-line", fontSize: "0.88rem", lineHeight: "1.7", color: "var(--text-secondary)" }}>
              {ps.description || "No detailed description provided by official portal."}
            </div>
          </div>

          {/* Technology & Complexity */}
          <div className="card">
            <h2 className="section-title" style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "12px" }}>Technology &amp; Complexity Analysis</h2>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                Extracted Technology Domains
              </div>
              <div className="skill-grid">
                {ps.technology_tags?.length > 0 ? (
                  ps.technology_tags.map((tag) => <span key={tag} className="badge badge-software">{tag}</span>)
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>General Software / Unspecified</span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Hackathon MVP Complexity</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginTop: "2px" }}>{ps.prototype_complexity?.level} ({ps.prototype_complexity?.score}/8 factors)</div>
              </div>
              <div style={{ padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Demo Potential</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginTop: "2px" }}>{ps.demo_potential?.level} ({ps.demo_potential?.score}/5 factors)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Opportunity Signal */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <LuSparkles size={18} color="var(--accent-light)" />
              <h2 className="section-title" style={{ fontSize: "1rem", fontWeight: "800", margin: 0 }}>Opportunity Signal</h2>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--accent-light)", margin: "4px 0" }}>
              {ps.opportunity_score} / 100
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
              Calculated opportunity index based on competition density, resource availability, and timeline.
            </div>
            <span className={`badge ${getOppBadgeClass(ps.opportunity_category)}`} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
              {ps.opportunity_category}
            </span>
          </div>

          {/* Resource Availability */}
          <div className="card">
            <h2 className="section-title" style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "12px" }}>Resource Availability</h2>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "12px", color: "var(--accent-light)" }}>
              {ps.resources?.score} / {ps.resources?.total} Resources Ready
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {ps.resources?.resources?.map((r) => (
                <div key={r.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span>{r.name}</span>
                  <span style={{ color: r.available ? "var(--green)" : "var(--text-muted)", fontWeight: "600" }}>
                    {r.available ? "✓ Available" : "✕ Not found"}
                  </span>
                </div>
              ))}
            </div>

            {ps.dataset_link && (
              <a
                href={ps.dataset_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: "100%", justifyContent: "center", marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>Open Official Dataset</span>
                <LuExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Similar PS Recommendations */}
          {ps.similar_ps?.length > 0 && (
            <div className="card">
              <h2 className="section-title" style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "12px" }}>Similar Problem Statements</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ps.similar_ps.map((s) => (
                  <Link key={s.ps_number} href={`/ps/${s.ps_number}`} style={{ color: "inherit" }}>
                    <div style={{ padding: "10px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", transition: "background 0.15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "0.85rem" }}>
                        <span style={{ color: "var(--accent-light)" }}>{s.ps_number}</span>
                        <span style={{ color: "var(--green)", fontSize: "0.78rem" }}>{s.similarity}% Match</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {s.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(PSDetailContent), { ssr: false });

export default function PSDetailPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
