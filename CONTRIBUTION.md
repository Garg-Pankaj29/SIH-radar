# Contributing to SIH Opportunity Radar

Thank you for your interest in contributing to **SIH Opportunity Radar**! We welcome your ideas, bug fixes, algorithmic improvements, and UI enhancements.

Whether you are refining our competitive heuristics, optimizing Next.js dashboard performance, or improving cross-platform compatibility, this guide will help you get started quickly.

---

## Code of Conduct & Contribution Philosophy

1. **Accuracy & Data Integrity First**: This platform is actively relied upon by student developers and hackathon teams to make strategic decisions. We never fabricate numbers, mask missing fields with silent falsified zeroes, or introduce biased heuristics.
2. **Lightweight & Modular**: Keep dependencies minimal. Prefer standard libraries, native CSS tokens, and well-scoped components over bulky third-party libraries.
3. **Cross-Platform Compatibility**: Code and scripts must run cleanly on **Linux**, **Windows**, and **macOS**. Avoid hardcoded Unix-only paths, OS-specific terminal assumptions, or casing bugs.
4. **Consistent UI Design**: Adhere strictly to the **Forest Green** design system tokens defined in `globals.css` with inline SVG icons instead of emojis for interactive controls.

---

## Project Architecture Overview

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
├── frontend/                 # Next.js 16 (Turbopack) & React 19 Web App
│   ├── app/                  # App Router pages (/, /ps, /radar, /team, /compare, etc.)
│   ├── components/           # Reusable UI components (Sidebar, AppShell, Charts, Tables)
│   ├── lib/                  # DataContext, utils & color/badge maps
│   └── public/api/           # Static fallback API JSON datasets
├── data/                     # Snapshots & historical feeds
│   ├── api/                  # Generated JSON API endpoints
│   └── snapshots/            # Timestamped problem statement snapshots
├── docs/                     # Documentation & deployment guides
├── sih_traffic_tracker.py    # Standalone CLI & Excel report generator (.xlsx)
├── requirements.txt          # Python backend dependencies
├── PRD.md                    # Product Requirements Document
├── RULES.md                  # Non-negotiable architectural & data rules
└── CONTRIBUTION.md           # Contribution guidelines (This document)
```

---

## Local Development Setup (By Operating System)

### Prerequisites

Ensure you have installed:
- **Node.js**: `v18.17.0+` (`v20.x` or `v22.x` recommended)
- **Python**: `3.10+` (`3.11` or `3.12` recommended)
- **Git**: `2.x+`

---

### 1. Linux Setup (Ubuntu / Debian / Fedora / Arch)

```bash
# 1. Clone your fork of the repository
git clone https://github.com/<your-username>/SIH-radar.git
cd SIH-radar

# 2. Set up Python virtual environment
# (On Debian/Ubuntu: sudo apt install -y python3-venv python3-pip)
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Generate local intelligence JSON datasets (Demo Mode)
python3 -m backend.api_data --demo

# 5. Set up Next.js frontend (in a new terminal tab or window)
cd frontend
npm install
npm run dev
```

The web dashboard will be available at **`http://localhost:3000`**.

---

### 2. Windows Setup (PowerShell / Command Prompt)

#### Using Windows PowerShell:

```powershell
# 1. Clone your fork
git clone https://github.com/<your-username>/SIH-radar.git
cd SIH-radar

# 2. Allow local script execution for current user (if blocked)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 4. Install backend dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# 5. Generate local intelligence JSON datasets (Demo Mode)
python -m backend.api_data --demo

# 6. Set up Next.js frontend (in a second PowerShell window)
cd frontend
npm install
npm run dev
```

#### Using Command Prompt (`cmd.exe`):

```cmd
git clone https://github.com/<your-username>/SIH-radar.git
cd SIH-radar

python -m venv venv
venv\Scripts\activate.bat

python -m pip install --upgrade pip
pip install -r requirements.txt
python -m backend.api_data --demo

cd frontend
npm install
npm run dev
```

---

### 3. macOS Setup (Apple Silicon & Intel)

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/SIH-radar.git
cd SIH-radar

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Generate local intelligence JSON datasets (Demo Mode)
python3 -m backend.api_data --demo

# 5. Set up Next.js frontend
cd frontend
npm install
npm run dev
```

> [!NOTE]
> **macOS AirPlay Port 5000 Collision**: If running the backend API server on macOS Monterey+, AirPlay Receiver might use port `5000`. You can pass `PORT=5001 python3 -m backend.server` or turn off AirPlay Receiver in *System Settings → General → AirDrop & Handoff*.

---

## Development Guidelines & Standards

### Frontend Guidelines (Next.js 16 & React 19)

1. **Mandatory AppShell Layout**: Every page route under `frontend/app/` must be wrapped in `AppShell` with standard sidebar navigation, responsive drawer, top search/actions, and footer.
2. **SSR Hydration Safety**: Subpages fetching client context or rendering SVGs dynamically must use:
   ```javascript
   import dynamic from 'next/dynamic';
   const PageContent = dynamic(() => Promise.resolve(RawContent), { ssr: false });
   ```
   This prevents hydration mismatches from browser extensions (such as Dark Reader or password managers).
3. **Design System & Theming**:
   - Always use CSS variables defined in `globals.css` (e.g. `var(--bg-card)`, `var(--text-primary)`, `var(--accent)`, `var(--border-subtle)`).
   - Ensure full visual parity across **Dark Mode** and **Light Mode**.
   - Do **not** hardcode raw hex colors (`#fff`, `#000`) directly in inline styles.
4. **No Emojis as UI Action Icons**: Use clean, accessible inline SVG icons (Lucide/Heroicons style) for buttons, tabs, and navigation items.
5. **Global State Access**: Use `useData()` from `DataContext.js` to read problem statements, KPIs, trends, watchlist, and comparison sets.

---

### Backend Guidelines (Python 3.10+)

1. **Pure, Deterministic Logic**: Scoring calculations (`opportunity_score`), parsing (`parse_ideas`), and text-extraction heuristics must be pure, testable, and deterministic.
2. **Cross-Platform Paths**: Always use `pathlib.Path` instead of hardcoded `/` or `\` slash strings.
3. **Resilient Data Ingestion**: Upstream SIH feeds can contain missing keys or unusual strings. Always use `.get()` with sensible fallbacks and never crash the pipeline on unparseable data.
4. **Zero Fabrication**: If submission count is unparseable or unknown, explicitly flag it. Never mask missing data by quietly defaulting it to zero.
5. **No Hardcoded PS Text**: All problem statements are dynamically ingested from public JSON snapshots. Never hardcode individual problem statement IDs or counts.

---

## Step-by-Step Pull Request Workflow

### 1. Create a Branch

Always branch off `main` with a clear, descriptive name:

```bash
# For a new feature
git checkout -b feature/team-skill-gap-export

# For a bug fix
git checkout -b fix/scatter-radar-axis-label

# For documentation
git checkout -b docs/cross-platform-instructions
```

### 2. Make Your Changes & Test Locally

Before submitting your PR, verify:

- [ ] **Backend Data Generation**:
  ```bash
  # Linux/macOS:
  python3 -m backend.api_data --demo
  
  # Windows:
  python -m backend.api_data --demo
  ```
  Ensure JSON files are cleanly written to `data/api/` and `frontend/public/api/`.

- [ ] **Frontend Linting & Build**:
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```
  Ensure zero compilation errors, type issues, or unresolved imports.

- [ ] **Cross-Theme Verification**:
  Test your changes on `http://localhost:3000` in both **Dark Mode** and **Light Mode**.

- [ ] **Responsive Design Check**:
  Check layout behavior on both desktop and mobile screen sizes.

---

### 3. Commit Conventions

Write clear, concise, and imperative commit messages (following Conventional Commits):

```bash
git commit -m "feat(team): add skill gap filter for hardware categories"
git commit -m "fix(radar): correct tooltip position on mobile screens"
git commit -m "docs: add Windows PowerShell execution policy instructions"
```

---

### 4. Open a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Navigate to [GitHub Garg-Pankaj29/SIH-radar](https://github.com/Garg-Pankaj29/SIH-radar) and click **"Compare & pull request"**.
3. Fill out the PR template:
   - **Summary of Changes**: What did you add, change, or fix?
   - **Motivation / Problem Solved**: Why is this change necessary?
   - **Screenshots / Recordings**: For any UI or layout changes (both Dark & Light modes).
   - **Testing Performed**: Which operating systems and browsers were tested?

---

## Reporting Bugs & Submitting Issues

When creating an issue on GitHub, please include:
- **Environment**: Your OS (Linux distribution, Windows 10/11, or macOS version), Node.js version, and Python version.
- **Steps to Reproduce**: Detailed list of steps to trigger the bug.
- **Expected vs Actual Behavior**: Clear description of what happened vs what should happen.
- **Console / Terminal Logs**: Include any stack traces or error logs in markdown code blocks.

---

## Community & Questions

If you have questions, ideas, or need guidance on contributing, feel free to open a [GitHub Discussion](https://github.com/Garg-Pankaj29/SIH-radar/discussions) or connect with the author:
- **Pankaj Garg** — [@Garg-Pankaj29](https://github.com/Garg-Pankaj29)
