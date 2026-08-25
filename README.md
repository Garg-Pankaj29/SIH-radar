# SIH Opportunity Radar — Smart India Hackathon 2026 Intelligence Platform

<div align="center">

[![Live Web App](https://img.shields.io/badge/Live_App-sih--radar--pi.vercel.app-2d6a4f?style=for-the-badge&logo=vercel&logoColor=white)](https://sih-radar-pi.vercel.app/)
[![API Backend](https://img.shields.io/badge/Render_API-Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://sih-radar-backend.onrender.com/api/kpis.json)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-Pankaj_Garg-2d6a4f?style=for-the-badge&logo=github)](https://github.com/Garg-Pankaj29)

<br />

# 🚀 [Launch Live App: sih-radar-pi.vercel.app](https://sih-radar-pi.vercel.app/)

**"See the competition. Track the momentum. Find the opportunity."**

*A competitive intelligence engine and decision-support platform for Smart India Hackathon (SIH 2026).*

[🌐 Try Live Website](https://sih-radar-pi.vercel.app/) • [🎯 User Guide](#-how-to-use-the-platform) • [📊 Features](#-feature-matrix) • [🏗 Architecture](#-architecture--tech-stack) • [💻 Local Setup](#-local-development) • [👨‍💻 Author](#-author)

</div>

---

## 🌟 Live Application Links

| Application | Provider | Direct Access URL | Deployment Status |
|---|---|---|---|
| **Live Intelligence Dashboard** | **Vercel** | [**`https://sih-radar-pi.vercel.app/`**](https://sih-radar-pi.vercel.app/) | [![Vercel](https://img.shields.io/badge/Vercel-Online-brightgreen)](https://sih-radar-pi.vercel.app/) |
| **Backend Analytics API** | **Render** | [**`https://sih-radar-backend.onrender.com/api/kpis.json`**](https://sih-radar-backend.onrender.com/api/kpis.json) | [![Render](https://img.shields.io/badge/Render-Active-brightgreen)](https://sih-radar-backend.onrender.com/api/kpis.json) |

---

## 📖 What is SIH Opportunity Radar?

Selecting the right problem statement is the most critical strategic decision in **Smart India Hackathon (SIH 2026)**. With **226 official problem statements** and tens of thousands of student teams submitting across India, browsing raw portal listings makes it difficult to assess competition density.

**SIH Opportunity Radar** transforms public SIH submission counters and problem metadata into actionable intelligence:

- 🎯 **Detect "Hidden Gems"**: High-potential problem statements with low competition density and clear resource guidelines.
- ⚡ **Track 24-Hour Velocity**: Identify sudden surges in submissions across India before a PS reaches its 500-idea capacity.
- 🧩 **Personalized Team Fit**: Match your team's technical skill set (Python, React, ML, C++, IoT, etc.) against NLP-extracted domain requirements.
- 📊 **2D Opportunity Radar**: Interactive scatter matrix plotting capacity fill percentage against calculated opportunity scores.
- 🚨 **Deadline & Capacity Alerts**: Monitor approaching deadlines (&lt;14d, &lt;5d) and capacity saturation (&gt;50% filled).

---

## 🎯 How to Use the Platform

Here is the recommended workflow for student teams and mentors:

```
┌────────────────────────────────┐     ┌────────────────────────────────┐
│  1. Check Executive Dashboard  │ ──> │  2. Explore Opportunity Radar  │
│  - Review total SW / HW split  │     │  - Find low-comp "Hidden Gems" │
│  - View competition donut      │     │  - Analyze 2D scatter matrix   │
└────────────────────────────────┘     └────────────────────────────────┘
               │                                      │
               ▼                                      ▼
┌────────────────────────────────┐     ┌────────────────────────────────┐
│  3. Filter Problem Statements  │ ──> │  4. Test Team Skill Alignment  │
│  - Search by keywords/theme    │     │  - Select 22+ tech skills      │
│  - Filter by category & comp   │     │  - Get instant match % & gaps  │
└────────────────────────────────┘     └────────────────────────────────┘
               │                                      │
               ▼                                      ▼
┌────────────────────────────────┐     ┌────────────────────────────────┐
│  5. Compare Candidate PSs      │ ──> │  6. Export Team Shortlist (CSV)│
│  - Side-by-side metric matrix  │     │  - Download for team & mentors │
│  - Evaluate 10+ parameters     │     │  - Prepare final submission    │
└────────────────────────────────┘     └────────────────────────────────┘
```

1. **Dashboard ([`sih-radar-pi.vercel.app/`](https://sih-radar-pi.vercel.app/))**: Check total submission volume, average capacity fill percentage, trending movers, and theme saturation bars.
2. **Opportunity Radar ([`sih-radar-pi.vercel.app/radar`](https://sih-radar-pi.vercel.app/radar))**: Look at the top-left quadrant for problem statements that have low submission density but high resource completeness.
3. **Problem Statements ([`sih-radar-pi.vercel.app/ps`](https://sih-radar-pi.vercel.app/ps))**: Search by keyword, theme, organization, or filter by category (Software / Hardware), competition level, and complexity.
4. **Team Profile ([`sih-radar-pi.vercel.app/team`](https://sih-radar-pi.vercel.app/team))**: Select your team's skills (e.g. `Python`, `React`, `IoT`, `Machine Learning`, `GIS`) to see ranked problem statements with personalized match scores and skill gap analysis.
5. **Compare ([`sih-radar-pi.vercel.app/compare`](https://sih-radar-pi.vercel.app/compare))**: Click `+ Compare` on candidate problem statements to evaluate them side-by-side across 10+ technical and competitive metrics.
6. **Trends ([`sih-radar-pi.vercel.app/intelligence`](https://sih-radar-pi.vercel.app/intelligence))**: Identify which problem statements gained the most submissions in the last 24 hours.
7. **Alerts ([`sih-radar-pi.vercel.app/alerts`](https://sih-radar-pi.vercel.app/alerts))**: Check urgent deadlines and velocity spikes.
8. **Export ([`sih-radar-pi.vercel.app/export`](https://sih-radar-pi.vercel.app/export))**: Download your team's curated watchlist or the full dataset in clean CSV format.

---

## 🎨 UI Design & Color Themes

The platform features a **Forest Green & Warm Copper** design system with full parity between **Dark Mode** and **Light Mode**:

- **Sidebar Navigation**: Fixed left-side navigation with clean inline SVG icons and live data freshness status.
- **Theme Switcher**: Instant toggle between Dark Mode and Light Mode in the top-right header.
- **Interactive Visualizations**: Responsive Recharts charts (Donut Chart, 2D Scatter Matrix, Bar Charts).
- **Mobile Responsive**: Adaptive layout scaling smoothly from large desktop screens down to mobile devices.

---

## 📊 Feature Matrix

| Feature | Live URL | Description |
|---|---|---|
| **Executive Dashboard** | [**`/`**](https://sih-radar-pi.vercel.app/) | 6 KPI stat cards, Competition distribution donut, Opportunity Radar scatter, Trending Now movers, Watchlist preview, Top PS table, Theme saturation bars. |
| **Problem Statements** | [**`/ps`**](https://sih-radar-pi.vercel.app/ps) | Comprehensive 226 PS table with live multi-keyword search, category chips, competition filters, sortable columns, and pagination. |
| **Opportunity Radar** | [**`/radar`**](https://sih-radar-pi.vercel.app/radar) | 2D interactive scatter plot mapping Competition Fill % (X-axis) vs Opportunity Score (Y-axis) with custom hover tooltips. |
| **Trends & Daily Briefing** | [**`/intelligence`**](https://sih-radar-pi.vercel.app/intelligence) | 24h velocity spikes, top 5 hidden gems, emerging momentum candidates, and saturated problem statements. |
| **Candidate Watchlist** | [**`/watchlist`**](https://sih-radar-pi.vercel.app/watchlist) | Shortlist problem statements with local storage persistence to monitor candidate ideas throughout the hackathon. |
| **Side-by-Side Comparison** | [**`/compare`**](https://sih-radar-pi.vercel.app/compare) | Direct comparison matrix for up to 5 problem statements across fill %, complexity, opportunity score, and resource completeness. |
| **Theme Saturation** | [**`/themes`**](https://sih-radar-pi.vercel.app/themes) | National submission distribution across all 18 SIH hackathon themes (AI/ML, IoT, Cybersecurity, Healthcare, Agriculture, etc.). |
| **Team Profile & Fit Engine** | [**`/team`**](https://sih-radar-pi.vercel.app/team) | Interactive 22-skill selector that calculates personalized match percentages and identifies skill gaps for candidate PSs. |
| **Alerts & Deadline Watch** | [**`/alerts`**](https://sih-radar-pi.vercel.app/alerts) | Automated monitoring for deadline crunches (&lt;14d, &lt;5d), velocity acceleration (≥20 new submissions/24h), and capacity limits (&gt;50%). |
| **Reports & Export Center** | [**`/export`**](https://sih-radar-pi.vercel.app/export) | Export filtered datasets, shortlists, or comparison matrices into clean CSV format. |
| **About & Methodology** | [**`/about`**](https://sih-radar-pi.vercel.app/about) | Project mission, heuristic formulas (Hidden Gems, Emerging, Crowded), and data provenance / methodology disclaimers. |
| **PS Deep Dive** | [**`/ps/[id]`**](https://sih-radar-pi.vercel.app/ps/SIH26001) | Individual problem statement profile with submission gauges, complexity factors, NLP-extracted technology tags, and dataset links. |

---

## 🏗 Architecture & Tech Stack

```
SIH_Radar/
├── backend/                  # Python ETL, Analytics & Intelligence Engine (Render)
│   ├── api_data.py           # Snapshot ingestion, enrichment & API JSON generator
│   └── tracker.py            # Velocity math, similarity engine & heuristics
├── frontend/                 # Next.js 16 (Turbopack) & React 19 Web App (Vercel)
│   ├── app/                  # App Router pages (/, /ps, /radar, /team, etc.)
│   ├── components/           # Reusable UI components (Sidebar, AppShell, Charts, Tables)
│   ├── lib/                  # DataContext, utils & color/badge maps
│   └── public/api/           # Static fallback API JSON datasets
├── data/                     # Snapshots & historical feeds
├── sih_traffic_tracker.py    # Standalone CLI & Excel report generator (.xlsx)
├── PRD.md                    # Product Requirements Document
├── RULES.md                  # Non-negotiable architectural & data rules
└── CONTRIBUTION.md           # Contribution guidelines & development workflow
```

- **Frontend**: Next.js 16 (Turbopack), React 19, Vanilla CSS (Design Tokens), Recharts 3.
- **Backend**: Python 3.10+, Requests, OpenPyXL.
- **Hosting & CI/CD**: Vercel (Frontend), Render (Backend Python API), GitHub Actions.

---

## 🚢 Deploy Your Own

### 1. Deploy Backend on Render

1. Fork this repository to your GitHub account.
2. Log in to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
3. Connect your forked repo and set:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m backend.api_data && python -m http.server 5000 --directory data`
4. Copy your live Render URL (e.g. `https://your-backend.onrender.com`).

### 2. Deploy Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository and set **Root Directory** to `frontend`.
3. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`
4. Click **Deploy**. Your dashboard will be live at `https://your-app.vercel.app`!

---

## 💻 Local Development

### 1. Backend Setup

```bash
# 1. Clone repository and create virtual environment
git clone https://github.com/Garg-Pankaj29/SIH-radar.git
cd SIH-radar
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Generate enriched JSON datasets
python3 -m backend.api_data --demo
```

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 📐 Methodology & Heuristics

1. **Competition-Demand Proxy**: The official public signal provided by SIH is the submitted idea counter (`ideas_submitted / 500`). The system treats this as a proxy for competition demand — **not** website traffic analytics or win probabilities.
2. **Opportunity Score (0–100)**: Calculated from capacity fill percentage, resource completeness (clear description, contact info, guidelines, dataset availability), and timeline urgency.
3. **Quadrant System**:
   - 💎 **Hidden Gems**: Fill &lt; 40% + High Opportunity Score.
   - 🔥 **Hot**: Fill &gt; 40% + High Opportunity Score (experienced teams).
   - 🚀 **Emerging**: Low initial fill with accelerating 24-hour velocity.
   - 🚫 **Crowded**: Fill &gt; 50% with saturated national submissions.

---

## 👨‍💻 Author

Developed by **Pankaj Garg**:
- **Live App**: [**sih-radar-pi.vercel.app**](https://sih-radar-pi.vercel.app/)
- **GitHub**: [@Garg-Pankaj29](https://github.com/Garg-Pankaj29)
- **Repository**: [Garg-Pankaj29/SIH-radar](https://github.com/Garg-Pankaj29/SIH-radar)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>SIH Opportunity Radar is an independent open-source decision-support tool created for student builders and is not officially affiliated with Smart India Hackathon (SIH), AICTE, or MIC.</sub>
</div>
