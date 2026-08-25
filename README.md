# SIH Opportunity Radar — Smart India Hackathon 2026 Intelligence Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-Pankaj_Garg-2d6a4f?style=for-the-badge&logo=github)](https://github.com/Garg-Pankaj29)

**"See the competition. Track the momentum. Find the opportunity."**

*A competitive intelligence engine and decision-support platform for Smart India Hackathon (SIH 2026) problem statements.*

[Explore Dashboard](#-quick-start) • [Features](#-features) • [Architecture](#-architecture) • [Methodology](#-methodology--heuristics) • [Author](#-author)

</div>

---

## 📖 Overview

**SIH Opportunity Radar** transforms official Smart India Hackathon (SIH 2026) submission counter data and problem statement metadata into an actionable intelligence platform. 

Instead of browsing through 226 unstructured problem statements, student teams and mentors can:
- 🎯 **Detect "Hidden Gems"**: High-potential problem statements with low competition density and rich supporting resources.
- ⚡ **Track 24h Velocity & Momentum**: Identify sudden surges in submissions across India before a PS reaches capacity.
- 🧩 **Calculate Team Skill Fit**: Match your team's technical stack against NLP-extracted domain requirements and complexity factors.
- 📊 **Visualize Opportunity Matrices**: Analyze 2D scatter plots of competition fill percentage vs. opportunity signals.
- 🚨 **Monitor Deadline Urgency**: Get automated threshold warnings for capacity saturation and approaching submission deadlines.

---

## 🎨 UI Design & Visual Experience

The application features a tailored **Forest Green & Warm Copper** design system with full support for **Dark Mode** and **Light Mode**:

- **Sidebar Navigation**: Fixed left-side navigation with custom SVG icons (no generic emojis) and real-time data freshness indicators.
- **Micro-Interactions**: Smooth state transitions, interactive Recharts graphs, and responsive layout across desktop, tablet, and mobile.
- **Rich Dashboard Cards**: 6 core KPI stat cards, Competition Donut Chart, 2D Opportunity Scatter Plot, Trending Now breakdown, and Theme Saturation bars.

---

## 🚀 Features

| Feature | Route | Description |
|---|---|---|
| **Executive Dashboard** | `/` | Core overview with 6 KPI metrics, competition donut distribution, 2D scatter radar, trending movers, watchlist preview, and theme saturation. |
| **Problem Statement Explorer** | `/ps` | Searchable & filterable directory of all 226 problem statements with multi-facet filters (Category, Competition, Opportunity, Complexity, Dataset). |
| **2D Opportunity Radar Matrix** | `/radar` | Interactive scatter matrix plotting Competition Fill % vs Opportunity Index to pinpoint Hidden Gems vs. Crowded domains. |
| **Trends & Daily Intelligence** | `/intelligence` | Daily briefing covering 24h velocity spikes, top 5 hidden gems, emerging momentum candidates, and high-density bottlenecks. |
| **Candidate Watchlist** | `/watchlist` | Bookmark candidate problem statements with local storage persistence to monitor shortlists throughout the hackathon. |
| **Side-by-Side Comparison** | `/compare` | Matrix evaluation tool comparing up to 5 problem statements across 10+ technical and competitive parameters. |
| **Theme Saturation Analysis** | `/themes` | Comprehensive domain breakdown of national submission distribution across all 18 SIH hackathon themes. |
| **Team Profile & Fit Engine** | `/team` | Interactive 22-skill selector that calculates personalized match percentages and identifies skill gaps for candidate PSs. |
| **Alerts & Deadline Watch** | `/alerts` | Automated monitoring of deadline crunches (&lt;14d, &lt;5d), 24h velocity acceleration (≥20 new submissions), and capacity limits. |
| **Reports & Export Center** | `/export` | Export filtered datasets, shortlists, or comparison matrices into clean CSV format for offline team review. |
| **PS Deep Dive** | `/ps/[id]` | Detailed problem profile with submission gauges, complexity factors, NLP-extracted technology tags, dataset links, and similar PS recommendations. |

---

## 🏗 Architecture

```
SIH_Radar/
├── backend/                  # Python Data Engineering & Intelligence Pipeline
│   ├── api_data.py           # Snapshot ingestion, enrichment & API JSON generator
│   └── tracker.py            # Core analytics, velocity heuristics & similarity engine
├── frontend/                 # Modern Next.js Intelligence Web Application
│   ├── app/                  # Next.js App Router (Pages: /, /ps, /radar, /team, etc.)
│   ├── components/           # Reusable UI components (Sidebar, AppShell, Charts, Tables)
│   ├── lib/                  # DataContext, state management, utility functions
│   └── public/api/           # Static JSON API datasets consumed by frontend
├── data/                     # Historical snapshots and output reports
├── sih_traffic_tracker.py    # Standalone CLI & Excel report generator (.xlsx)
├── PRD.md                    # Product Requirements Document
├── RULES.md                  # Non-negotiable architectural & data rules
└── CONTRIBUTION.md           # Contribution guidelines & development workflow
```

---

## ⚡ Quick Start

### Prerequisites
- **Python 3.10+** (for data pipeline and Excel report generation)
- **Node.js 20+** / **npm 10+** (for the web application)

---

### 1. Data Pipeline (Python Backend)

Generate or refresh the intelligence JSON datasets from public problem statement feeds:

```bash
# 1. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Generate enriched JSON datasets
# Standard mode (observed SIH submission counts):
python3 -m backend.api_data

# Demo mode (with simulated velocity growth & trends for demo/testing):
python3 -m backend.api_data --demo
```

---

### 2. Frontend Intelligence Dashboard (Next.js)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (if first time)
npm install

# 3. Start local development server
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

### 3. Standalone Excel Report Generator

If you just need an offline Excel workbook with conditional formatting and ranking sheets:

```bash
python3 sih_traffic_tracker.py
```
This generates `SIH2026_PS_Traffic_Report.xlsx` with formatted ranking sheets, theme breakdowns, and a Read Me / methodology tab.

---

## 📐 Methodology & Heuristics

1. **Competition-Demand Proxy**: The official public signal provided by SIH is the submitted idea counter (`ideas_submitted / 500`). The system treats this as a proxy for competition demand — **not** website traffic analytics or win probabilities.
2. **Opportunity Score (0–100)**: Calculated from capacity fill percentage, resource completeness (clear description, contact info, guidelines, dataset availability), and timeline urgency.
3. **Quadrants**:
   - 💎 **Hidden Gems**: Fill &lt; 40% + High Opportunity Score.
   - 🔥 **Hot**: Fill &gt; 40% + High Opportunity Score (experienced teams).
   - 🚀 **Emerging**: Low initial fill with accelerating 24-hour velocity.
   - 🚫 **Crowded**: Fill &gt; 50% with saturated national submissions.

---

## 👨‍💻 Author

Developed with care by **Pankaj Garg**:
- **GitHub**: [@Garg-Pankaj29](https://github.com/Garg-Pankaj29)
- **Project**: [SIH-radar](https://github.com/Garg-Pankaj29/SIH-radar)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>SIH Opportunity Radar is an independent open-source decision-support tool created for student builders and is not officially affiliated with Smart India Hackathon (SIH), AICTE, or MIC.</sub>
</div>
