# SIH Opportunity Radar — Smart India Hackathon 2026 Intelligence Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://sih-radar-pi.vercel.app)
[![API Status](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://sih-radar-backend.onrender.com/api/metadata.json)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-Pankaj_Garg-2d6a4f?style=for-the-badge&logo=github)](https://github.com/Garg-Pankaj29)

<br/>

### 🌐 **[Launch Live Dashboard: sih-radar-pi.vercel.app](https://sih-radar-pi.vercel.app)**

**"See the competition. Track the momentum. Find the opportunity."**

*An end-to-end competition intelligence platform and decision-support engine for Smart India Hackathon (SIH 2026).*

[Live Demo](#-live-deployments) • [User Guide](#-how-to-use-the-platform) • [Features](#-key-features) • [Deployment Guide](#-deploy-your-own) • [Local Setup](#-local-development) • [Author](#-author)

</div>

---

## 🚀 Live Deployments

| Component | Provider | Live URL | Status |
|---|---|---|---|
| **Frontend Web App** | **Vercel** | [**`https://sih-radar-pi.vercel.app`**](https://sih-radar-pi.vercel.app) | ![Vercel](https://img.shields.io/badge/Deployed-Success-brightgreen) |
| **Data Engine & API** | **Render** | [**`https://sih-radar-backend.onrender.com`**](https://sih-radar-backend.onrender.com/api/kpis.json) | ![Render](https://img.shields.io/badge/Live-Active-brightgreen) |

---

## 📖 Overview

Selecting the right problem statement is the most critical strategic decision in Smart India Hackathon (SIH). With **226 official problem statements** and tens of thousands of teams submitting across India, browsing raw tables makes it difficult to assess competition density.

**SIH Opportunity Radar** transforms public SIH submission counters into actionable intelligence:
- 🎯 **Detect "Hidden Gems"**: High-potential problem statements with low competition density and clear resource guidelines.
- ⚡ **Track 24-Hour Velocity**: Identify sudden surges in submissions across India before a PS reaches its 500-idea capacity.
- 🧩 **Personalized Team Fit**: Cosine-match your team's technical skill set (Python, React, ML, C++, IoT, etc.) against NLP-extracted domain requirements.
- 📊 **2D Opportunity Radar**: Scatter matrix plotting capacity fill percentage against calculated opportunity scores.
- 🚨 **Deadline & Capacity Alerts**: Monitor approaching deadlines (&lt;14d, &lt;5d) and capacity thresholds (&gt;50% filled).

---

## 🎯 How to Use the Platform

Here is how student teams, mentors, and hackathon participants can get the most out of the platform:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ 1. Check KPIs   │ ──> │ 2. Explore Radar │ ──> │ 3. Match Skills  │ ──> │ 4. Compare &    │
│ & Trends        │     │ & Hidden Gems    │     │ in Team Profile  │     │ Export Shortlist│
└─────────────────┘     └──────────────────┘     └──────────────────┘     └─────────────────┘
```

1. **Start on the [Dashboard](https://sih-radar-pi.vercel.app/)**: Check total submission volume (across Software & Hardware), average capacity fill percentage, and the competition distribution donut chart.
2. **Find Hidden Gems on the [Opportunity Radar](https://sih-radar-pi.vercel.app/radar)**: Look at the top-left quadrant for problem statements that have low submission density but high resource completeness.
3. **Filter Problem Statements on [Explorer](https://sih-radar-pi.vercel.app/ps)**: Search by keyword, theme, organization, or filter by category (Software / Hardware), competition level, and complexity.
4. **Test Your Team's Fit on [Team Profile](https://sih-radar-pi.vercel.app/team)**: Select the skills your team possesses (e.g. `Python`, `React`, `IoT`, `Machine Learning`, `GIS`) to see ranked problem statement recommendations with skill match percentages and gap analysis.
5. **Bookmark & Compare on [Compare](https://sih-radar-pi.vercel.app/compare)**: Click `+ Compare` on candidate problem statements to evaluate them side-by-side across 10+ technical and competitive metrics.
6. **Track Velocity on [Trends](https://sih-radar-pi.vercel.app/intelligence)**: Identify which problem statements gained the most submissions in the last 24 hours.
7. **Export Your Report on [Reports](https://sih-radar-pi.vercel.app/export)**: Download your team's curated watchlist or the full dataset in clean CSV format for offline discussions with mentors.

---

## 🎨 UI Design & Color Themes

The platform features a **Forest Green & Warm Copper** design system with full parity between **Dark Mode** and **Light Mode**:

- **Sidebar Navigation**: Fixed left-side navigation with clean inline SVG icons and live data freshness status.
- **Theme Switcher**: Instant toggle between Dark Mode and Light Mode in the top-right header.
- **Interactive Charts**: Responsive Recharts data visualizations (Donut Chart, 2D Scatter Matrix, Bar Charts).
- **Mobile Responsive**: Adaptive layout scaling smoothly from 4K monitors down to mobile viewports.

---

## 📊 Feature Breakdown

| Page | URL Path | Key Capabilities |
|---|---|---|
| **Executive Dashboard** | [`/`](https://sih-radar-pi.vercel.app/) | 6 KPI stat cards, Competition distribution donut, Opportunity Radar scatter, Trending Now movers, Watchlist preview, Top PS table, Theme saturation bars. |
| **Problem Statements** | [`/ps`](https://sih-radar-pi.vercel.app/ps) | Comprehensive 226 PS table with live multi-keyword search, category chips, competition filters, sortable columns, and pagination. |
| **Opportunity Radar** | [`/radar`](https://sih-radar-pi.vercel.app/radar) | 2D interactive scatter plot mapping Competition Fill % (X-axis) vs Opportunity Score (Y-axis) with custom hover tooltips. |
| **Trends & Daily Briefing** | [`/intelligence`](https://sih-radar-pi.vercel.app/intelligence) | 24h velocity spikes, top 5 hidden gems, emerging momentum candidates, and saturated problem statements. |
| **Candidate Watchlist** | [`/watchlist`](https://sih-radar-pi.vercel.app/watchlist) | Shortlist problem statements with local storage persistence to monitor candidate ideas throughout the hackathon. |
| **Side-by-Side Comparison** | [`/compare`](https://sih-radar-pi.vercel.app/compare) | Direct comparison matrix for up to 5 problem statements across fill %, complexity, opportunity score, and resource completeness. |
| **Theme Saturation** | [`/themes`](https://sih-radar-pi.vercel.app/themes) | National submission distribution across all 18 SIH hackathon themes (AI/ML, IoT, Cybersecurity, Healthcare, Agriculture, etc.). |
| **Team Profile & Fit Engine** | [`/team`](https://sih-radar-pi.vercel.app/team) | Interactive 22-skill selector that calculates personalized match percentages and identifies skill gaps for candidate PSs. |
| **Alerts & Deadline Watch** | [`/alerts`](https://sih-radar-pi.vercel.app/alerts) | Automated monitoring for deadline crunches (&lt;14d, &lt;5d), velocity acceleration (≥20 new submissions/24h), and capacity limits (&gt;50%). |
| **Reports & Export Center** | [`/export`](https://sih-radar-pi.vercel.app/export) | Export filtered datasets, shortlists, or comparison matrices into clean CSV format. |
| **PS Deep Dive** | [`/ps/[id]`](https://sih-radar-pi.vercel.app/ps/SIH26001) | Individual problem statement profile with submission gauges, complexity factors, NLP-extracted technology tags, and dataset links. |

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
- **Hosting**: Vercel (Frontend SPA/SSR), Render (Backend Python API).

---

## 🚢 Deploy Your Own

### 1. Deploy Backend on Render

1. Fork this repository to your GitHub account.
2. Log in to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
3. Connect your forked repo and set:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m backend.api_data && python -m http.server 5000 --directory data` (or your Python API runner)
4. Copy your live Render URL (e.g. `https://your-backend.onrender.com`).

### 2. Deploy Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository and set **Root Directory** to `frontend`.
3. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`
4. Click **Deploy**. Your custom dashboard will be live in ~60 seconds!

---

## 💻 Local Development

### 1. Backend Setup

```bash
# 1. Clone repo and create virtual environment
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

Developed with care by **Pankaj Garg**:
- **GitHub**: [@Garg-Pankaj29](https://github.com/Garg-Pankaj29)
- **Repository**: [Garg-Pankaj29/SIH-radar](https://github.com/Garg-Pankaj29/SIH-radar)
- **Live Website**: [sih-radar-pi.vercel.app](https://sih-radar-pi.vercel.app)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>SIH Opportunity Radar is an independent open-source decision-support tool created for student builders and is not officially affiliated with Smart India Hackathon (SIH), AICTE, or MIC.</sub>
</div>
