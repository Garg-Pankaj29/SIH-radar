# Contributing to SIH Opportunity Radar

Thank you for your interest in contributing to **SIH Opportunity Radar**! Whether you are fixing bugs, improving the intelligence heuristics, or enhancing the dashboard UI, your contributions are welcome.

---

## 🧭 Code of Conduct & Contribution Philosophy

1. **Accuracy & Data Integrity First**: This tool is used by students to make important decisions about their hackathon submissions. Never fabricate numbers or introduce misleading heuristics.
2. **Lightweight & Modular**: Keep dependencies minimal. Prefer standard libraries and well-scoped components.
3. **Consistent UI Design**: Use the established **Forest Green** design system tokens defined in `globals.css` with inline SVG icons instead of emojis.

---

## 🛠 Project Structure

```
SIH_Radar/
├── backend/                  # Python ETL, Analytics & Enrichment Pipeline
│   ├── api_data.py           # Ingestion, validation & JSON API generator
│   └── tracker.py            # Velocity math, similarity engine & heuristics
├── frontend/                 # Next.js 16 (Turbopack) & React 19 Web App
│   ├── app/                  # App Router pages (/ps, /radar, /team, etc.)
│   ├── components/           # UI Components (Sidebar, AppShell, Charts, Tables)
│   ├── lib/                  # DataContext, utils & color/badge maps
│   └── public/api/           # Enriched API JSON datasets
├── data/                     # Snapshots & historical feeds
├── sih_traffic_tracker.py    # Standalone Excel report generator
├── PRD.md                    # Product Requirements Document
├── RULES.md                  # Non-negotiable architectural & data rules
└── CONTRIBUTION.md           # This document
```

---

## 🚀 Setting Up the Local Development Environment

### 1. Backend Setup (Python)

```bash
# Clone the repository
git clone https://github.com/Garg-Pankaj29/SIH-radar.git
cd SIH-radar

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend data generation
python3 -m backend.api_data --demo
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

The frontend will be live at `http://localhost:3000`.

---

## 📝 Development Guidelines

### Frontend Guidelines (Next.js & React)

1. **Unified Shell (`AppShell`)**: Every new or updated page under `frontend/app/` must use the `AppShell` wrapper to ensure consistent sidebar navigation, header search bar, and footer.
2. **Hydration Protection**: Always use dynamic client loading (`dynamic(() => Promise.resolve(MyContent), { ssr: false })`) for pages that fetch context data or render SVGs to prevent hydration conflicts with browser extensions like Dark Reader.
3. **Styling & Theming**:
   - Use CSS variables defined in `globals.css` (e.g., `var(--bg-card)`, `var(--text-primary)`, `var(--accent)`).
   - Support both **Dark Mode** and **Light Mode**.
   - Do **not** hardcode raw colors (e.g., `#ffffff` or `#000000`) in inline styles unless referencing specific chart theme arrays.
4. **No Emojis for UI Icons**: Use clean, accessible inline SVG icons (Lucide-style) matching the sidebar and KPI card patterns.
5. **State Management**: Use `useData()` from `DataContext.js` for accessing problem statements, KPIs, trends, watchlist, and compare lists.

---

### Backend Guidelines (Python)

1. **Pure Functions**: Parsing logic (`parse_ideas`), scoring (`opportunity_score`), and transformation functions should remain pure and deterministic.
2. **No Hardcoded PS Data**: All 226 records are ingested from the public JSON feed at runtime. Never hardcode individual problem statement text or counts.
3. **Graceful Degradation**: If a field is missing or unparseable, flag it clearly or use standard schema defaults. Never crash the pipeline on unexpected strings.
4. **Excel Compatibility**: If modifying `sih_traffic_tracker.py`, ensure the output workbook includes the *Read Me* methodology tab, formatted columns, and correct conditional formatting rules.

---

## 🔄 Pull Request (PR) Workflow

1. **Fork & Branch**: Create a feature branch with a descriptive name:
   ```bash
   git checkout -b feature/team-skill-gap-export
   # or
   git checkout -b fix/radar-axis-label
   ```
2. **Commit Conventions**: Use clear, imperative commit messages:
   - `Add export CSV option for team fit recommendations`
   - `Fix tooltip styling on Opportunity Radar scatter plot`
   - `Update theme saturation calculation for hardware categories`
3. **Validate Before Committing**:
   - Run `python3 -m backend.api_data` and verify that generated JSONs in `frontend/public/api/` are valid.
   - Run `npm run build` in `frontend/` to ensure zero compilation or syntax errors.
   - Test both Dark and Light themes locally in your browser.
4. **Submit PR**: Open a pull request against the `main` branch with a concise summary of changes and before/after screenshots for UI updates.

---

## 🐛 Reporting Issues & Bugs

- **Data Discrepancies**: If a specific problem statement count differs from `sih.gov.in`, verify whether the upstream JSON mirror has updated before submitting an issue.
- **Feature Requests**: Please explain the user scenario (e.g., "As a hackathon team leader, I want to filter by IoT + Python to find hardware PSs with available datasets").

---

## ⚖️ Questions or Help?

Feel free to open a GitHub Discussion or reach out to the author:
- **Pankaj Garg** — [@Garg-Pankaj29](https://github.com/Garg-Pankaj29)
