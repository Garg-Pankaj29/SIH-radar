"""
API Web Server — SIH Opportunity Radar
----------------------------------------
Lightweight Flask/WSGI API server for hosting on Render.com.
Serves intelligence endpoints and runs data refreshes.
"""
import os
import json
from pathlib import Path
# pyrefly: ignore [missing-import]
from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.api_data import build_api_data

# Load local .env file if present
ENV_FILE = Path(__file__).parent.parent / ".env"
if ENV_FILE.exists():
    with open(ENV_FILE, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

app = Flask(__name__)
CORS(app)  # Enable CORS for Vercel frontend requests


API_DIR = Path(__file__).parent.parent / "data" / "api"


def load_api_file(filename):
    filepath = API_DIR / filename
    if not filepath.exists():
        # Build if missing
        build_api_data()
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "SIH Opportunity Radar API",
        "endpoints": [
            "/api/problem_statements.json",
            "/api/kpis.json",
            "/api/themes.json",
            "/api/trends.json",
            "/api/metadata.json",
            "/api/refresh"
        ]
    })


@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}, 200


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


@app.route("/api/refresh", methods=["POST", "GET"])
def trigger_refresh():
    demo_mode = request.args.get("demo", "").lower() == "true" or os.environ.get("DEMO_MODE", "").lower() == "true"
    # Temporarily set environment or parameter
    if demo_mode:
        os.environ["DEMO_MODE"] = "true"
    else:
        os.environ["DEMO_MODE"] = "false"

    build_api_data()
    return jsonify({"status": "success", "message": "API data refreshed", "demo_mode": demo_mode})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
