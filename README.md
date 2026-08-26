# SIH Opportunity Radar — Smart India Hackathon 2026 Intelligence Platform

<div align="center">

[![Live Web App](https://img.shields.io/badge/Live_App-sih--radar--pi.vercel.app-2d6a4f?style=for-the-badge&logo=vercel&logoColor=white)](https://sih-radar-pi.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.js.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![Platform Support](https://img.shields.io/badge/OS-Linux%20%7C%20Windows%20%7C%20macOS-blue?style=for-the-badge&logo=linux&logoColor=white)](https://github.com/Garg-Pankaj29/SIH-radar)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-Pankaj_Garg-2d6a4f?style=for-the-badge&logo=github)](https://github.com/Garg-Pankaj29)

<br />

# 🚀 [Launch Live Intelligence Platform: sih-radar-pi.vercel.app](https://sih-radar-pi.vercel.app/)

**"See the competition. Track the momentum. Find the opportunity."**

*A strategic competitive intelligence engine and decision-support platform for Smart India Hackathon (SIH 2026).*

[🌐 Launch Website](https://sih-radar-pi.vercel.app/) • [🎯 User Guide](#-how-to-use-the-platform) • [📊 Feature Matrix](#-feature-matrix) • [🏗 Architecture](#-architecture--tech-stack) • [💻 Cross-Platform Setup](#-cross-platform-local-development) • [🔧 Troubleshooting](#-os-specific-troubleshooting) • [🤝 Contributing](CONTRIBUTION.md)

</div>

---

## 📑 Table of Contents

- [📖 What is SIH Opportunity Radar?](#-what-is-sih-opportunity-radar)
- [🎯 How to Use the Platform](#-how-to-use-the-platform)
- [🎨 UI Design & Color Themes](#-ui-design--color-themes)
- [📊 Feature Matrix](#-feature-matrix)
- [🏗 Architecture & Tech Stack](#-architecture--tech-stack)
- [💻 Cross-Platform Local Development](#-cross-platform-local-development)
  - [Prerequisites](#prerequisites)
  - [🐧 Linux Setup Guide](#-linux-setup-guide)
  - [🪟 Windows Setup Guide (PowerShell / Command Prompt / WSL)](#-windows-setup-guide)
  - [🍎 macOS Setup Guide](#-macos-setup-guide)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📊 Standalone Excel Report Generator](#-standalone-excel-report-generator)
- [📐 Methodology & Heuristics](#-methodology--heuristics)
- [🔧 OS-Specific Troubleshooting](#-os-specific-troubleshooting)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)
- [📄 License](#-license)

---

## 📖 What is SIH Opportunity Radar?

Selecting the right problem statement is the single most critical strategic decision in **Smart India Hackathon (SIH 2026)**. With **226 official problem statements** and tens of thousands of student teams submitting across India, browsing raw portal listings makes it difficult to assess competition density, track deadline crunches, and identify true technical matches.

**SIH Opportunity Radar** transforms public SIH submission counters and problem metadata into actionable, real-time intelligence:

- 💎 **Detect "Hidden Gems"**: High-potential problem statements with low competition density (<40% capacity) and high resource completeness.
- ⚡ **Track 24-Hour Velocity**: Identify sudden surges in submissions across India before a PS reaches its 500-idea national cap.
- 🧩 **Personalized Team Fit Engine**: Match your team's technical skills (Python, React, ML, C++, IoT, GIS, etc.) against NLP-extracted domain requirements.
- 📊 **2D Opportunity Radar**: Interactive scatter matrix plotting capacity fill percentage against calculated opportunity scores.
- ⚖️ **Side-by-Side PS Comparator**: Benchmark up to 5 problem statements concurrently across 10+ technical and competitive metrics.
- 🚨 **Deadline & Capacity Alerts**: Monitor approaching deadlines (<14d, <5d) and capacity saturation (>50% filled).
- 📁 **Data Export Suite**: Export your custom watchlist, comparative evaluation matrices, or full datasets into clean CSV format or formatted Excel workbooks.

---

## 🎯 How to Use the Platform

Here is the recommended workflow for student teams, team leaders, and hackathon mentors:

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

1. **Dashboard ([`/`](https://sih-radar-pi.vercel.app/))**: Review national submission volume, average capacity fill percentage, trending movers, and theme saturation bars.
2. **Opportunity Radar ([`/radar`](https://sih-radar-pi.vercel.app/radar))**: Inspect the top-left quadrant for problem statements that have low submission density but high resource completeness.
3. **Problem Statements ([`/ps`](https://sih-radar-pi.vercel.app/ps))**: Search by keyword, theme, organization, or filter by category (Software / Hardware), competition level, and complexity.
4. **Team Profile ([`/team`](https://sih-radar-pi.vercel.app/team))**: Select your team's skills (e.g. `Python`, `React`, `IoT`, `Machine Learning`, `GIS`) to see ranked problem statements with personalized match scores and skill gap analysis.
5. **Compare ([`/compare`](https://sih-radar-pi.vercel.app/compare))**: Click `+ Compare` on candidate problem statements to evaluate them side-by-side across 10+ technical and competitive metrics.
6. **Trends ([`/intelligence`](https://sih-radar-pi.vercel.app/intelligence))**: Identify which problem statements gained the most submissions in the last 24 hours.
7. **Alerts ([`/alerts`](https://sih-radar-pi.vercel.app/alerts))**: Check urgent deadlines and velocity spikes.
8. **Export ([`/export`](https://sih-radar-pi.vercel.app/export))**: Download your team's curated watchlist or the full dataset in clean CSV format.

---

## 🎨 UI Design & Color Themes

The platform features a **Forest Green & Warm Copper** design system with full parity between **Dark Mode** and **Light Mode**:

- **Sidebar Navigation**: Fixed left-side navigation with clean inline SVG icons, collapsed mobile drawers, and live data freshness status.
- **Theme Switcher**: Instant toggle between Dark Mode and Light Mode in the top-right header with zero flash-of-unstyled-content.
- **Interactive Visualizations**: Responsive Recharts charts (Donut Chart, 2D Scatter Matrix, Bar Charts).
- **Mobile Responsive**: Adaptive layout scaling smoothly from large ultra-wide monitors down to mobile viewports.

---

## 📊 Feature Matrix

| Feature | Route | Description |
|---|---|---|
| **Executive Dashboard** | [**`/`**](https://sih-radar-pi.vercel.app/) | 6 KPI stat cards, competition distribution donut, Opportunity Radar scatter, Trending Now movers, Watchlist preview, Top PS table, Theme saturation bars. |
| **Problem Statements** | [**`/ps`**](https://sih-radar-pi.vercel.app/ps) | Comprehensive 226 PS table with live multi-keyword search, category chips, competition filters, sortable columns, and pagination. |
| **Opportunity Radar** | [**`/radar`**](https://sih-radar-pi.vercel.app/radar) | 2D interactive scatter plot mapping Competition Fill % (X-axis) vs Opportunity Score (Y-axis) with custom hover tooltips. |
| **Trends & Daily Briefing** | [**`/intelligence`**](https://sih-radar-pi.vercel.app/intelligence) | 24h velocity spikes, top 5 hidden gems, emerging momentum candidates, and saturated problem statements. |
| **Candidate Watchlist** | [**`/watchlist`**](https://sih-radar-pi.vercel.app/watchlist) | Shortlist problem statements with browser `localStorage` persistence to monitor candidate ideas throughout the hackathon. |
| **Side-by-Side Comparison** | [**`/compare`**](https://sih-radar-pi.vercel.app/compare) | Direct comparison matrix for up to 5 problem statements across fill %, complexity, opportunity score, and resource completeness. |
| **Theme Saturation** | [**`/themes`**](https://sih-radar-pi.vercel.app/themes) | National submission distribution across all 18 SIH hackathon themes (AI/ML, IoT, Cybersecurity, Healthcare, Agriculture, etc.). |
| **Team Profile & Fit Engine** | [**`/team`**](https://sih-radar-pi.vercel.app/team) | Interactive 22-skill selector that calculates personalized match percentages and identifies skill gaps for candidate PSs. |
| **Alerts & Deadline Watch** | [**`/alerts`**](https://sih-radar-pi.vercel.app/alerts) | Automated monitoring for deadline crunches (<14d, <5d), velocity acceleration (≥20 new submissions/24h), and capacity limits (>50%). |
| **Reports & Export Center** | [**`/export`**](https://sih-radar-pi.vercel.app/export) | Export filtered datasets, shortlists, or comparison matrices into clean CSV format. |
| **About & Methodology** | [**`/about`**](https://sih-radar-pi.vercel.app/about) | Project mission, heuristic formulas (Hidden Gems, Emerging, Crowded), and data provenance / methodology disclaimers. |
| **PS Deep Dive** | [**`/ps/[id]`**](https://sih-radar-pi.vercel.app/ps/SIH26001) | Individual problem statement profile with submission gauges, complexity factors, NLP-extracted technology tags, and dataset links. |

---

## 🏗 Architecture & Tech Stack

```
SIH_Radar/
├── backend/                  # Python ETL, Analytics & Intelligence Engine
│   ├── __init__.py
│   ├── analytics_engine.py   # Statistical aggregation, metrics, & score calculation
│   ├── api_data.py           # Snapshot ingestion, enrichment & API JSON generator
│   ├── data_fetcher.py       # Resilient HTTP fetcher for upstream data sources
│   ├── demo_data.py          # Simulated snapshot generator for local development
│   ├── intelligence_engine.py# NLP tag extraction, similarity & velocity heuristics
│   ├── server.py             # Flask/WSGI API server with CORS & rate-limiting
│   └── snapshot_manager.py   # Snapshot storage and historical diff manager
├── frontend/                 # Next.js 16 (Turbopack) & React 19 Web App (Vercel)
│   ├── app/                  # App Router pages (/, /ps, /radar, /team, etc.)
│   ├── components/           # Reusable UI components (Sidebar, AppShell, Charts, Tables)
│   ├── lib/                  # DataContext, utils & color/badge maps
│   └── public/api/           # Static fallback API JSON datasets
├── data/                     # Snapshots & historical feeds
│   ├── api/                  # Generated JSON API endpoints
│   └── snapshots/            # Timestamped problem statement snapshots
├── docs/                     # Documentation & deployment guides
├── sih_traffic_tracker.py    # Standalone CLI & Excel report generator (.xlsx)
├── requirements.txt          # Python backend dependencies
├── package.json              # Root project metadata
├── PRD.md                    # Product Requirements Document
├── RULES.md                  # Non-negotiable architectural & data rules
└── CONTRIBUTION.md           # Contribution guidelines & development workflow
```

- **Frontend**: Next.js 16 (Turbopack), React 19, Vanilla CSS (Design Tokens in `globals.css`), Recharts 3, React Icons.
- **Backend**: Python 3.10+, Flask, Flask-CORS, Flask-Limiter, Gunicorn, OpenPyXL, Requests.
- **Deployment**: Vercel (Production Next.js Web App), Render (Python Flask Backend), GitHub Actions (Automated monitoring & keep-alive).

---

## 💻 Cross-Platform Local Development

SIH Opportunity Radar is engineered to run seamlessly across **Linux**, **Windows**, and **macOS**. Follow the instructions below for your operating system.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v18.17.0` or higher (`v20.x` or `v22.x` recommended) — [nodejs.org](https://nodejs.org/)
- **Python**: `3.10` or higher (`3.11` / `3.12` recommended) — [python.org](https://python.org/)
- **Git**: `2.x` or higher — [git-scm.com](https://git-scm.com/)

---

### 🐧 Linux Setup Guide

*Supported on Ubuntu, Debian, Fedora, Arch, and derivatives.*

#### 1. Clone & Set Up the Python Backend

```bash
# 1. Clone the repository
git clone https://github.com/Garg-Pankaj29/SIH-radar.git
cd SIH-radar

# 2. Create and activate a Python virtual environment
# (On Debian/Ubuntu: ensure 'python3-venv' is installed via: sudo apt install python3-venv)
python3 -m venv venv
source venv/bin/activate

# 3. Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Generate local enriched JSON datasets (Demo Mode)
python3 -m backend.api_data --demo

# 5. (Optional) Run local Flask backend server on http://localhost:5000
python3 -m backend.server
```

#### 2. Set Up the Next.js Frontend

Open a new terminal window in the project root:

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server with Turbopack
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

### 🪟 Windows Setup Guide

*Supported on Windows 10 & 11 via PowerShell, Command Prompt (cmd.exe), or WSL2.*

#### Option A: Using Windows PowerShell (Recommended)

```powershell
# 1. Open PowerShell and navigate to your workspace
cd C:\path\to\your\projects

# 2. Clone the repository
git clone https://github.com/Garg-Pankaj29/SIH-radar.git
cd SIH-radar

# 3. If PowerShell script execution is restricted, enable it for CurrentUser:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 5. Install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# 6. Generate local dataset snapshots (Demo Mode)
python -m backend.api_data --demo

# 7. (Optional) Run the local backend API server
python -m backend.server
```

In a second PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

#### Option B: Using Command Prompt (`cmd.exe`)

```cmd
git clone https://github.com/Garg-Pankaj29/SIH-radar.git
cd SIH-radar

python -m venv venv
venv\Scripts\activate.bat

python -m pip install --upgrade pip
pip install -r requirements.txt
python -m backend.api_data --demo

:: Start frontend
cd frontend
npm install
npm run dev
```

#### Option C: Windows Subsystem for Linux (WSL 2)

If you use WSL (Ubuntu on Windows), simply follow the [🐧 Linux Setup Guide](#-linux-setup-guide) directly inside your WSL terminal.

---

### 🍎 macOS Setup Guide

*Supported on Apple Silicon (M1/M2/M3/M4) and Intel Macs.*

#### 1. Clone & Set Up the Python Backend

```bash
# 1. Clone repository
git clone https://github.com/Garg-Pankaj29/SIH-radar.git
cd SIH-radar

# 2. Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Generate local intelligence datasets
python3 -m backend.api_data --demo

# 5. (Optional) Run backend API server
python3 -m backend.server
```

> **macOS Note regarding Port 5000**: On macOS Monterey, Ventura, Sonoma, and Sequoia, Apple's **AirPlay Receiver** service may occupy port `5000`. You can either run the backend on port `5001` via `PORT=5001 python3 -m backend.server`, or disable AirPlay Receiver in *System Settings → General → AirDrop & Handoff → AirPlay Receiver*.

#### 2. Set Up the Next.js Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## ⚙️ Environment Configuration

Copy the example environment configuration to customize your backend or frontend settings:

```bash
# In project root:
cp .env.example .env
```

### Backend Variables (`.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for the local Flask/Gunicorn API server |
| `DEMO_MODE` | `true` | When `true`, synthesizes 24h velocity data for local testing |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS whitelist |
| `RATE_LIMIT` | `20 per minute` | Global IP rate limit for API abuse prevention |
| `REFRESH_SECRET` | `""` | Secret bearer token required for `POST /api/refresh` |
| `GEMINI_API_KEY` | `""` | Optional Gemini API key for advanced semantic embeddings |

### Frontend Variables (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `""` *(Uses static `/api` fallback)* | Remote backend URL (e.g. `https://sih-radar-backend.onrender.com`) |

---

## 📊 Standalone Excel Report Generator

Want a comprehensive offline spreadsheet report without running the web server? Run the standalone Python script:

```bash
# Linux / macOS
python3 sih_traffic_tracker.py SIH2026_PS_Traffic_Report.xlsx

# Windows
python sih_traffic_tracker.py SIH2026_PS_Traffic_Report.xlsx
```

**Output Features**:
- 📑 **Ranked Overview Tab**: All 226 problem statements sorted by capacity fill percentage.
- 🎨 **Color-Coded Status**: High (≥50%), Medium (10–49%), Low (1–9%), and None Yet (0%).
- 📖 **Read Me Methodology Tab**: Built-in definitions, formulas, and hackathon strategy guide.

---

## 📐 Methodology & Heuristics

1. **Competition-Demand Proxy**: The official public signal provided by SIH is the submitted idea counter (`ideas_submitted / 500`). The system treats this as a proxy for competition demand — **not** website traffic analytics or win probabilities.
2. **Opportunity Score (0–100)**: Calculated from capacity fill percentage, resource completeness (clear description, contact info, guidelines, dataset availability), and timeline urgency.
3. **Quadrant System**:
   - 💎 **Hidden Gems**: Fill < 40% + High Opportunity Score.
   - 🔥 **Hot**: Fill > 40% + High Opportunity Score (competitive candidates).
   - 🚀 **Emerging**: Low initial fill with accelerating 24-hour velocity.
   - 🚫 **Crowded**: Fill > 50% with saturated national submissions.

---

## 🔧 OS-Specific Troubleshooting

<details>
<summary><strong>🪟 Windows Issues & Fixes</strong></summary>

- **Issue: `Activate.ps1 cannot be loaded because running scripts is disabled on this system`**
  - *Fix*: Run PowerShell as Administrator or user and execute:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
- **Issue: `'python3' is not recognized as an internal or external command`**
  - *Fix*: On Windows, use `python` or `py` instead of `python3`:
    ```cmd
    python -m venv venv
    ```
- **Issue: Line ending differences (`CRLF` vs `LF`)**
  - *Fix*: Configure Git to handle line endings automatically:
    ```cmd
    git config --global core.autocrlf true
    ```
</details>

<details>
<summary><strong>🍎 macOS Issues & Fixes</strong></summary>

- **Issue: `Address already in use: 5000` (AirPlay Collision)**
  - *Fix*: Run backend on an alternative port:
    ```bash
    PORT=5001 python3 -m backend.server
    ```
    Or turn off AirPlay Receiver in *System Settings → General → AirDrop & Handoff*.
- **Issue: `command not found: python3` or missing compiler headers**
  - *Fix*: Install Xcode Command Line Tools:
    ```bash
    xcode-select --install
    ```
</details>

<details>
<summary><strong>🐧 Linux Issues & Fixes</strong></summary>

- **Issue: `The virtual environment was not created successfully because ensurepip is not available`**
  - *Fix* (Debian/Ubuntu):
    ```bash
    sudo apt update && sudo apt install -y python3-venv python3-pip
    ```
- **Issue: `npm: command not found`**
  - *Fix*: Install Node.js via NVM (Node Version Manager):
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    source ~/.bashrc
    nvm install 20
    ```
</details>

---

## 🚀 Deployment

- **Python Backend**: Deployable with zero configuration to [Render.com](https://render.com) using Gunicorn (`gunicorn backend.server:app`).
- **Frontend**: Deployable to [Vercel](https://vercel.com) with root directory set to `frontend`.
- For a complete step-by-step production deployment guide, refer to [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are warmly welcomed! Please read our [**Contributing Guide (CONTRIBUTION.md)**](CONTRIBUTION.md) for full development workflows, code standards, and PR submission guidelines.

---

## 👨‍💻 Author

Developed by **Pankaj Garg**:
- **Live Platform**: [**sih-radar-pi.vercel.app**](https://sih-radar-pi.vercel.app/)
- **GitHub**: [@Garg-Pankaj29](https://github.com/Garg-Pankaj29)
- **Repository**: [Garg-Pankaj29/SIH-radar](https://github.com/Garg-Pankaj29/SIH-radar)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>SIH Opportunity Radar is an independent open-source decision-support tool created for student builders and is not officially affiliated with Smart India Hackathon (SIH), AICTE, or MIC.</sub>
</div>
