"""
API Web Server — SIH Opportunity Radar
----------------------------------------
Lightweight Flask/WSGI API server for hosting on Render.com.
Serves intelligence endpoints and runs data refreshes.

Security features:
  - Rate limiting (flask-limiter) to prevent abuse
  - CORS restricted to allowed origins only
  - /api/refresh protected by secret token
  - Security headers on all responses
  - Root endpoint does not expose route listing
"""
import os
import json
from pathlib import Path
# pyrefly: ignore [missing-import]
from flask import Flask, jsonify, request
from flask_cors import CORS
# pyrefly: ignore [missing-import]
from flask_limiter import Limiter
# pyrefly: ignore [missing-import]
from flask_limiter.util import get_remote_address

from backend.api_data import build_api_data

# ── Load local .env file if present ──────────────────────────────────────────
ENV_FILE = Path(__file__).parent.parent / ".env"
if ENV_FILE.exists():
    with open(ENV_FILE, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

# ── App Setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)

# CORS: Only allow specific origins (production + local dev)
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "https://sih-radar-pi.vercel.app,http://localhost:3000"
).split(",")
CORS(app, origins=[o.strip() for o in ALLOWED_ORIGINS])

# Rate Limiter: In-memory storage (configurable, tight default to prevent backend crashout)
DEFAULT_RATE_LIMIT = os.environ.get("RATE_LIMIT", "20 per minute")
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[DEFAULT_RATE_LIMIT],
    storage_uri="memory://",
)

# Refresh endpoint secret
REFRESH_SECRET = os.environ.get("REFRESH_SECRET", "")

API_DIR = Path(__file__).parent.parent / "data" / "api"


# ── Security Headers ────────────────────────────────────────────────────────
@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    )
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


# ── Rate Limit Error Handler ────────────────────────────────────────────────
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "rate_limit_exceeded", "message": str(e.description)}), 429


# ── Helpers ──────────────────────────────────────────────────────────────────
def load_api_file(filename):
    filepath = API_DIR / filename
    if not filepath.exists():
        # Build if missing
        build_api_data()
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


# ── Routes ───────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def root():
    """Minimal health check — does NOT expose endpoint listing."""
    return jsonify({"status": "ok"}), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/api/problem_statements.json", methods=["GET"])
def get_problem_statements():
    return jsonify(load_api_file("problem_statements.json"))


@app.route("/api/kpis.json", methods=["GET"])
def get_kpis():
    return jsonify(load_api_file("kpis.json"))


@app.route("/api/themes.json", methods=["GET"])
def get_themes():
    return jsonify(load_api_file("themes.json"))


@app.route("/api/trends.json", methods=["GET"])
def get_trends():
    return jsonify(load_api_file("trends.json"))


@app.route("/api/metadata.json", methods=["GET"])
def get_metadata():
    return jsonify(load_api_file("metadata.json"))


@app.route("/api/refresh", methods=["POST"])
@limiter.limit("2 per hour")
def trigger_refresh():
    """Protected refresh endpoint — requires X-Refresh-Token header."""
    # Verify token
    token = request.headers.get("X-Refresh-Token", "")
    if not REFRESH_SECRET or token != REFRESH_SECRET:
        return jsonify({"error": "forbidden", "message": "Invalid or missing refresh token"}), 403

    demo_mode = (
        request.args.get("demo", "").lower() == "true"
        or os.environ.get("DEMO_MODE", "").lower() == "true"
    )
    if demo_mode:
        os.environ["DEMO_MODE"] = "true"
    else:
        os.environ["DEMO_MODE"] = "false"

    build_api_data()
    return jsonify({"status": "success", "message": "API data refreshed", "demo_mode": demo_mode})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
