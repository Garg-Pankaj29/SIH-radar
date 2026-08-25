"use client";
import dynamic from "next/dynamic";
import { DataProvider, useData } from "../../lib/DataContext";
import AppShell from "../../components/AppShell";
import Link from "next/link";
import { SKILLS, getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";

function TeamFitContent() {
  const { teamSkills, updateTeamSkills, psData, loading, error } = useData();

  const toggleSkill = (skill) => {
    if (teamSkills.includes(skill)) {
      updateTeamSkills(teamSkills.filter(s => s !== skill));
    } else {
      updateTeamSkills([...teamSkills, skill]);
    }
  };

  if (loading) {
    return (
      <AppShell title="Team Profile & Fit Engine" subtitle="Calculate personalized match scores for your team">
        <div className="loading-state">
          <div className="loading-spinner" />
          <div className="loading-text">Loading Team Fit Engine...</div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Team Profile & Fit Engine" subtitle="Calculate personalized match scores for your team">
        <div className="error-state">Failed to load team data: {error}</div>
      </AppShell>
    );
  }

  // Calculate team fit score for all PSs
  const psWithFit = psData.map(p => {
    const psTechs = p.technology_tags || [];
    let matchCount = 0;
    const strongMatches = [];
    const gaps = [];

    psTechs.forEach(tech => {
      const hasSkill = teamSkills.some(skill => {
        const sLower = skill.toLowerCase();
        const tLower = tech.toLowerCase();
        return tLower.includes(sLower) || sLower.includes(tLower);
      });

      if (hasSkill) {
        matchCount++;
        strongMatches.push(tech);
      } else {
        gaps.push(tech);
      }
    });

    const totalReq = psTechs.length || 1;
    const rawScore = Math.round((matchCount / totalReq) * 100);
    const fitScore = teamSkills.length === 0 ? 50 : Math.min(rawScore, 100);

    return {
      ...p,
      fitScore,
      strongMatches,
      gaps,
    };
  }).sort((a, b) => b.fitScore - a.fitScore);

  return (
    <AppShell
      title="Team Profile & Skill Fit Engine"
      subtitle="Configure your team's core technical skill set to calculate personalized match scores and gap analysis across all 226 problem statements."
    >
      {/* Skill Selector */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Select Team Core Skills ({teamSkills.length} selected):
        </div>
        <div className="skill-grid">
          {SKILLS.map(skill => {
            const isSelected = teamSkills.includes(skill);
            return (
              <button
                key={skill}
                className={`skill-chip ${isSelected ? "selected" : ""}`}
                onClick={() => toggleSkill(skill)}
              >
                {isSelected ? "✓ " : "+ "}{skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ranked Recommendations */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: '800' }}>
          Top Recommended PS Candidates for Your Team ({psWithFit.length})
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Ranked by team skill alignment
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {psWithFit.slice(0, 15).map((p, idx) => (
          <div key={p.ps_number} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--accent-light)' }}>#{idx + 1}</span>
                  <span className="badge badge-software">{p.ps_number}</span>
                  <span className={`badge ${p.category === 'Software' ? 'badge-software' : 'badge-hardware'}`}>{p.category}</span>
                  <span className={`badge ${getCompBadgeClass(p.competition_level)}`}>{p.competition_level} Comp</span>
                  <span className={`badge ${getOppBadgeClass(p.opportunity_category)}`}>{p.opportunity_category}</span>
                </div>
                <Link href={`/ps/${p.ps_number}`}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>{p.title}</h3>
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.organization} | {p.theme}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: p.fitScore >= 70 ? 'var(--green)' : p.fitScore >= 40 ? 'var(--yellow)' : 'var(--text-muted)' }}>
                  {p.fitScore}% Match
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skill Alignment Score</div>
              </div>
            </div>

            {p.technology_tags?.length > 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '16px', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Required Domains:</span>{" "}
                  {p.technology_tags.join(", ")}
                </div>
                {p.gaps?.length > 0 && (
                  <div>
                    <span style={{ color: 'var(--yellow)' }}>Skill Gaps:</span>{" "}
                    {p.gaps.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}

const DynamicContent = dynamic(() => Promise.resolve(TeamFitContent), { ssr: false });

export default function TeamFitPage() {
  return (
    <DataProvider>
      <DynamicContent />
    </DataProvider>
  );
}
