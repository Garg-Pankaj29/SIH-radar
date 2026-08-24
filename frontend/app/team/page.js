"use client";
import { useState } from "react";
import { DataProvider, useData } from "../../lib/DataContext";
import Header from "../../components/Header";
import Link from "next/link";
import { SKILLS, getCompBadgeClass, getOppBadgeClass } from "../../lib/utils";
import { IconTeam, IconTrophy, IconCheck, IconPlus } from "../../components/Icons";

function TeamFitContent() {
  const { teamSkills, updateTeamSkills, psData, loading } = useData();

  const toggleSkill = (skill) => {
    if (teamSkills.includes(skill)) {
      updateTeamSkills(teamSkills.filter(s => s !== skill));
    } else {
      updateTeamSkills([...teamSkills, skill]);
    }
  };

  if (loading) return <div className="container page">Loading Team Fit Engine...</div>;

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

    return { ...p, fitScore, strongMatches, gaps };
  }).sort((a, b) => b.fitScore - a.fitScore);

  return (
    <>
      <Header />
      <main className="container page">
        <div style={{ marginBottom: '24px' }}>
          <h1 className="page-title"><IconTeam size={22} className="icon-inline" /> Team Skill Fit Engine</h1>
          <p className="page-subtitle">
            Configure your team&apos;s core technical skill set to calculate personalized match scores &amp; gap analysis across all 226 PSs.
          </p>
        </div>

        {/* Skill Selector */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
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
                  {isSelected ? <><IconCheck size={13} /> {skill}</> : <><IconPlus size={13} /> {skill}</>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ranked Recommendations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="section-title">
            <IconTrophy size={18} /> Top Recommended PS Candidates ({psWithFit.length})
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
      </main>
    </>
  );
}

export default function TeamFitPage() {
  return (
    <DataProvider>
      <TeamFitContent />
    </DataProvider>
  );
}
