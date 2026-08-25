# Project Rules & Non-Negotiable Standards

These rules are **mandatory and non-negotiable** for the **SIH Opportunity Radar** project. They take precedence over convenience and soft style preferences. Any contribution or modification that violates these rules will be rejected.

---

## 1. 🛡️ Data Integrity & Methodology

- **Never Fabricate or Silence-Default Submission Counts**: If a field is missing or unparseable, it must be reported as unknown or flagged in logs — never silently defaulted to `0` in a way that looks like real data.
- **Every Output Must State Data Provenance**: Every generated report (web dashboard, Excel spreadsheet, or exported CSV) must state its data source, timestamp, and methodology note.
- **Clear Proxy Representation**: Submitted ideas (`ideas_submitted / 500`) are an objective **competition-demand proxy**, not website pageviews or difficulty measurements.
- **No Unsubstantiated "Win-Probability" Claims**: All analytics are decision-support heuristics. The platform must never guarantee hackathon selection or misrepresent competition metrics as official evaluation criteria.
- **Independent Tool Disclaimer**: All outputs must explicitly clarify that SIH Opportunity Radar is an independent open-source project and is not affiliated with or endorsed by Smart India Hackathon (SIH), AICTE, or the Ministry of Education (MIC).

---

## 2. 🌐 Access & Scraping Etiquette

When accessing upstream data feeds or `sih.gov.in`:
- **Rate-Limit Ingestion**: No tight polling loops. Data synchronization must run periodically (daily or snapshot-based) — never hammering endpoints.
- **Identify Client**: Use descriptive `User-Agent` headers. Do not attempt to bypass access controls or impersonate user sessions.
- **Public Data Only**: Only access and process publicly listed problem statements. Never attempt to scrape auth-gated SPOC portals, team accounts, or private evaluation dashboards.
- **Back Off on Errors**: If an endpoint returns 429, CAPTCHAs, or errors, immediately back off and log the event. Do not add aggressive retry loops that could impact portal availability.

---

## 3. 🎨 UI Design & Architecture Rules

- **Unified Design System**: All pages must adhere to the **Forest Green** palette defined in `globals.css` with seamless support for both **Dark Mode** and **Light Mode**.
- **No Generic Emojis for Navigation / Controls**: All UI icons must be accessible, styled inline SVGs. Emojis must not be used as icon replacements in navigation or buttons.
- **Mandatory AppShell Layout**: Every page must be wrapped in `AppShell` with the fixed sidebar, top search/actions bar, fluid viewport scaling, and the centered **"Made by Pankaj Garg"** footer with GitHub link.
- **Hydration Safety**: Subpages fetching data on the client or rendering SVGs must use dynamic client-side loading (`dynamic(..., { ssr: false })`) to eliminate SSR hydration mismatches caused by browser extensions.

---

## 4. 🔒 Security & Privacy Rules

- **Zero Personally Identifiable Information (PII)**: The system tracks public hackathon problem statement metadata only. No student names, team emails, contact numbers, or team member data may ever be stored, logged, or committed to the repository.
- **No Hardcoded Secrets or Credentials**: No API keys, credentials, or private tokens belong in this codebase. Any future external integrations must read credentials from environment variables (`.env.local`), which are strictly git-ignored.

---

## 5. 📦 Dependency & Code Discipline

- **Keep Dependencies Minimal**: 
  - Backend: Standard library + `openpyxl` (and `requests` if needed). Avoid heavy scraping frameworks for single JSON feeds.
  - Frontend: Vanilla CSS with design tokens over heavy utility libraries unless explicitly justified.
- **Synchronized Documentation**: Any change to scoring heuristics, formula thresholds (`opportunity_score`, `traffic_label`), or data schemas must update `PRD.md` and `README.md` in the exact same change.
- **No Silent Breaking Changes**: Output formats, sheet names, CSV columns, and API JSON structures must remain backwards-compatible so historical snapshots remain comparable.
