"""
Intelligence Engine — SIH Opportunity Radar
---------------------------------------------
Higher-level analysis: technology extraction, complexity heuristics,
opportunity profiling, similarity detection, and team fit.

All outputs from this engine are HEURISTIC metrics unless noted.
AI-generated classifications are explicitly labeled.
"""
import re
import math
from collections import Counter

# ── Technology Keywords ──────────────────────────────────────────────────────
TECHNOLOGY_KEYWORDS = {
    "AI/ML": [
        "ai", "artificial intelligence", "machine learning", "ml", "deep learning",
        "neural network", "classification", "prediction", "predictive", "clustering",
        "regression", "training model", "inference",
    ],
    "Computer Vision": [
        "computer vision", "image processing", "image recognition", "object detection",
        "face recognition", "facial recognition", "image segmentation", "ocr",
        "optical character recognition", "video analysis", "thermal imaging",
    ],
    "NLP": [
        "nlp", "natural language", "text analysis", "sentiment", "speech recognition",
        "voice", "translation", "language processing", "chatbot", "conversational",
    ],
    "IoT": [
        "iot", "internet of things", "sensor", "arduino", "esp32", "raspberry pi",
        "embedded", "microcontroller", "smart device", "connected device",
    ],
    "Robotics": [
        "robot", "robotic", "rover", "drone", "uav", "quadruped", "autonomous vehicle",
        "actuator", "servo", "manipulator",
    ],
    "Cybersecurity": [
        "cybersecurity", "cyber security", "encryption", "security", "authentication",
        "firewall", "intrusion detection", "malware", "vulnerability",
    ],
    "Web": [
        "web application", "web platform", "web-based", "dashboard", "portal",
        "website", "web app", "web interface",
    ],
    "Mobile": [
        "mobile app", "android", "ios", "mobile application", "smartphone",
        "tablet", "mobile-based",
    ],
    "Cloud": [
        "cloud", "aws", "azure", "gcp", "saas", "cloud-based", "serverless",
        "microservices",
    ],
    "Blockchain": [
        "blockchain", "distributed ledger", "smart contract", "decentralized",
        "cryptocurrency", "nft",
    ],
    "GIS": [
        "gis", "geographic information", "geospatial", "mapping", "gps",
        "satellite imagery", "remote sensing", "lidar", "geo-tagged",
    ],
    "Data Analytics": [
        "data analytics", "data analysis", "big data", "data mining",
        "data visualization", "analytics", "statistical",
    ],
    "Embedded Systems": [
        "embedded system", "firmware", "fpga", "vlsi", "pcb", "circuit",
        "hardware design", "signal processing",
    ],
    "AR/VR": [
        "augmented reality", "virtual reality", "ar", "vr", "mixed reality",
        "xr", "immersive",
    ],
    "Automation": [
        "automation", "automated", "rpa", "robotic process", "workflow automation",
        "smart automation",
    ],
}

# ── Complexity Indicators ────────────────────────────────────────────────────
COMPLEXITY_FACTORS = {
    "ml_component": {
        "keywords": ["ai", "ml", "machine learning", "deep learning", "neural", "model training"],
        "label": "ML component",
    },
    "hardware_dependency": {
        "keywords": ["sensor", "arduino", "esp32", "raspberry pi", "hardware", "actuator", "servo", "pcb"],
        "label": "Hardware dependency",
    },
    "dataset_dependency": {
        "keywords": ["dataset", "training data", "labeled data", "corpus"],
        "label": "Dataset dependency",
    },
    "multiple_integrations": {
        "keywords": ["api integration", "integrate with", "third-party", "external service"],
        "label": "Multiple integrations",
    },
    "real_time": {
        "keywords": ["real-time", "real time", "live", "streaming", "continuous monitoring"],
        "label": "Real-time processing",
    },
    "mobile_app": {
        "keywords": ["mobile app", "android app", "ios app", "mobile application"],
        "label": "Mobile app required",
    },
    "gis_spatial": {
        "keywords": ["gis", "geospatial", "mapping", "satellite", "lidar"],
        "label": "GIS/Spatial analysis",
    },
    "specialized_domain": {
        "keywords": ["medical", "clinical", "pharmaceutical", "aerospace", "nuclear"],
        "label": "Specialized domain knowledge",
    },
}

# ── Demo Potential Indicators ────────────────────────────────────────────────
DEMO_FACTORS = {
    "visual_output": {
        "keywords": ["dashboard", "visualization", "visual", "chart", "graph", "heatmap", "map"],
        "label": "Visual output",
    },
    "real_time_interaction": {
        "keywords": ["real-time", "interactive", "live demo", "real time"],
        "label": "Real-time interaction",
    },
    "before_after": {
        "keywords": ["before and after", "comparison", "improvement", "enhancement"],
        "label": "Before/after comparison",
    },
    "hardware_demo": {
        "keywords": ["prototype", "physical", "hardware", "device", "robot", "drone"],
        "label": "Hardware demonstration",
    },
    "live_prediction": {
        "keywords": ["prediction", "forecast", "classify", "detect", "recognition"],
        "label": "Live prediction/detection",
    },
}


def extract_technology_tags(description, title=""):
    """Extract technology domain tags from PS description and title.

    Returns list of matched technology tags.
    This is a HEURISTIC classification based on keyword matching.
    """
    text = (title + " " + description).lower()
    tags = []

    for tag, keywords in TECHNOLOGY_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                tags.append(tag)
                break

    return tags


def assess_prototype_complexity(description, title="", category="Software"):
    """Assess hackathon prototype complexity.

    Returns: {level, score, factors_present, factors_absent}
    This is a HEURISTIC metric.
    """
    text = (title + " " + description).lower()
    present = []
    absent = []

    for factor_key, factor_info in COMPLEXITY_FACTORS.items():
        found = any(kw in text for kw in factor_info["keywords"])
        if found:
            present.append(factor_info["label"])
        else:
            absent.append(factor_info["label"])

    score = len(present)

    # Hardware PSs get a complexity bump
    if category == "Hardware":
        score += 1

    if score >= 5:
        level = "High"
    elif score >= 3:
        level = "Medium"
    else:
        level = "Low"

    return {
        "level": level,
        "score": score,
        "factors_present": present,
        "factors_absent": absent,
    }


def assess_demo_potential(description, title="", category="Software"):
    """Assess hackathon demo potential.

    Returns: {level, score, factors}
    This is a HEURISTIC metric.
    """
    text = (title + " " + description).lower()
    factors = []

    for factor_key, factor_info in DEMO_FACTORS.items():
        if any(kw in text for kw in factor_info["keywords"]):
            factors.append(factor_info["label"])

    score = len(factors)
    if category == "Hardware":
        score += 1
        factors.append("Physical prototype")

    if score >= 4:
        level = "High"
    elif score >= 2:
        level = "Medium"
    else:
        level = "Low"

    return {"level": level, "score": score, "factors": factors}


def calculate_resource_completeness(record):
    """Calculate resource availability score.

    Returns: {score, total, resources}
    This is a DERIVED metric from observed data.
    """
    resources = []
    total = 5

    has_dataset = bool(record.get("dataset_link", "").strip())
    has_youtube = bool(record.get("youtube", "").strip())
    has_description = len(record.get("description", "")) > 200
    has_contact = bool(record.get("contact", "").strip())
    has_deadline = bool(record.get("deadline_date", ""))

    if has_dataset:
        resources.append({"name": "Dataset", "available": True})
    else:
        resources.append({"name": "Dataset", "available": False})

    if has_youtube:
        resources.append({"name": "YouTube Briefing", "available": True})
    else:
        resources.append({"name": "YouTube Briefing", "available": False})

    resources.append({"name": "Detailed Description", "available": has_description})
    resources.append({"name": "Contact Info", "available": has_contact})
    resources.append({"name": "Clear Deadline", "available": has_deadline})

    score = sum(1 for r in resources if r["available"])

    return {"score": score, "total": total, "resources": resources}


# ── Opportunity Profile ──────────────────────────────────────────────────────

# Configurable weights for opportunity scoring
OPPORTUNITY_WEIGHTS = {
    "competition": 0.30,
    "momentum": 0.20,
    "deadline": 0.15,
    "resources": 0.15,
    "complexity": 0.20,
}


def classify_opportunity(fill_pct, momentum, days_left, resource_score,
                         complexity_level, velocity_24h=None):
    """Classify PS into opportunity categories.

    Categories: HOT / CROWDED / HIDDEN GEM / EMERGING / WATCH / UNCLASSIFIED
    This is a HEURISTIC classification.
    """
    is_high_comp = fill_pct >= 50
    is_med_comp = 10 <= fill_pct < 50
    is_low_comp = fill_pct < 10

    is_rising = momentum in ("Rising rapidly", "Rising")
    is_rapid = momentum == "Rising rapidly"
    is_stable = momentum in ("Stable", "Insufficient data")

    if is_high_comp and is_rapid:
        return "HOT"
    if is_high_comp and not is_rapid:
        return "CROWDED"
    if is_low_comp and is_rapid:
        return "EMERGING"
    if is_low_comp and is_stable and resource_score >= 3:
        return "HIDDEN GEM"
    if is_med_comp and is_rising:
        return "WATCH"
    if is_med_comp and is_stable:
        return "WATCH"
    if is_low_comp:
        return "HIDDEN GEM"

    return "WATCH"


def calculate_opportunity_score(fill_pct, momentum, days_left, resource_score,
                                 resource_total, complexity_level):
    """Calculate a numeric opportunity score (0-100).

    Higher = better opportunity (less competition + more resources).
    This is a HEURISTIC metric with documented weights.
    """
    # Competition score: lower fill = higher score
    comp_score = max(0, 100 - fill_pct * 2)

    # Momentum score: stable = good for opportunity seekers
    momentum_map = {
        "Rising rapidly": 20,
        "Rising": 40,
        "Stable": 80,
        "Insufficient data": 60,
    }
    mom_score = momentum_map.get(momentum, 50)

    # Deadline score: more time = better
    if days_left is not None:
        if days_left >= 21:
            dead_score = 100
        elif days_left >= 14:
            dead_score = 80
        elif days_left >= 7:
            dead_score = 50
        elif days_left >= 3:
            dead_score = 20
        else:
            dead_score = 0
    else:
        dead_score = 50

    # Resource score
    res_score = (resource_score / max(resource_total, 1)) * 100

    # Complexity score: lower = better for hackathon
    complexity_map = {"Low": 90, "Medium": 60, "High": 30}
    cx_score = complexity_map.get(complexity_level, 50)

    weighted = (
        comp_score * OPPORTUNITY_WEIGHTS["competition"]
        + mom_score * OPPORTUNITY_WEIGHTS["momentum"]
        + dead_score * OPPORTUNITY_WEIGHTS["deadline"]
        + res_score * OPPORTUNITY_WEIGHTS["resources"]
        + cx_score * OPPORTUNITY_WEIGHTS["complexity"]
    )

    return round(weighted, 1)


def is_crowded_but_strong(fill_pct, resource_score, complexity_level):
    """Detect 'Crowded but Strong' PSs.

    High competition + strong resources + manageable complexity.
    """
    return (
        fill_pct >= 40
        and resource_score >= 3
        and complexity_level in ("Low", "Medium")
    )


# ── Similarity (TF-IDF) ─────────────────────────────────────────────────────

def _tokenize(text):
    """Simple tokenizer for TF-IDF."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    words = text.split()
    # Remove very short and very common words
    stopwords = {
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "shall", "can", "need", "dare", "ought",
        "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
        "as", "into", "through", "during", "before", "after", "above", "below",
        "between", "out", "off", "over", "under", "again", "further", "then",
        "once", "and", "but", "or", "nor", "not", "so", "yet", "both",
        "each", "few", "more", "most", "other", "some", "such", "no",
        "only", "own", "same", "than", "too", "very", "just", "because",
        "this", "that", "these", "those", "it", "its", "they", "them",
        "their", "we", "our", "he", "she", "his", "her", "you", "your",
    }
    return [w for w in words if len(w) > 2 and w not in stopwords]


def compute_tfidf_similarity(records):
    """Compute pairwise TF-IDF cosine similarity between PS descriptions.

    Returns dict: {ps_number: [(other_ps, similarity_score), ...]}
    """
    # Build corpus
    docs = {}
    for r in records:
        text = r.get("title", "") + " " + r.get("description", "") + " " + r.get("theme", "")
        docs[r["ps_number"]] = _tokenize(text)

    # Document frequency
    df = Counter()
    for tokens in docs.values():
        unique = set(tokens)
        for t in unique:
            df[t] += 1

    n_docs = len(docs)

    # TF-IDF vectors
    vectors = {}
    for ps, tokens in docs.items():
        tf = Counter(tokens)
        vec = {}
        for word, count in tf.items():
            if df[word] > 1:  # skip words appearing in only one doc
                idf = math.log(n_docs / df[word])
                vec[word] = count * idf
        vectors[ps] = vec

    # Cosine similarity
    def cosine(v1, v2):
        common = set(v1.keys()) & set(v2.keys())
        if not common:
            return 0.0
        dot = sum(v1[k] * v2[k] for k in common)
        mag1 = math.sqrt(sum(v ** 2 for v in v1.values()))
        mag2 = math.sqrt(sum(v ** 2 for v in v2.values()))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot / (mag1 * mag2)

    ps_list = list(vectors.keys())
    similarities = {ps: [] for ps in ps_list}

    for i in range(len(ps_list)):
        for j in range(i + 1, len(ps_list)):
            sim = cosine(vectors[ps_list[i]], vectors[ps_list[j]])
            if sim > 0.1:  # only store meaningful similarities
                sim_rounded = round(sim * 100, 1)
                similarities[ps_list[i]].append((ps_list[j], sim_rounded))
                similarities[ps_list[j]].append((ps_list[i], sim_rounded))

    # Sort by similarity descending, keep top 5
    for ps in similarities:
        similarities[ps].sort(key=lambda x: -x[1])
        similarities[ps] = similarities[ps][:5]

    return similarities


# ── Team Fit ─────────────────────────────────────────────────────────────────

SKILL_TO_TECH = {
    "Python": ["AI/ML", "Data Analytics", "Web", "Automation"],
    "JavaScript": ["Web", "Mobile"],
    "React": ["Web", "Mobile"],
    "Node.js": ["Web", "Cloud"],
    "C++": ["Embedded Systems", "Robotics", "IoT"],
    "Java": ["Web", "Mobile", "Cloud"],
    "Machine Learning": ["AI/ML", "Computer Vision", "NLP", "Data Analytics"],
    "Deep Learning": ["AI/ML", "Computer Vision", "NLP"],
    "Computer Vision": ["Computer Vision", "AI/ML"],
    "IoT": ["IoT", "Embedded Systems"],
    "Arduino": ["IoT", "Embedded Systems", "Robotics"],
    "ESP32": ["IoT", "Embedded Systems"],
    "Cybersecurity": ["Cybersecurity"],
    "Cloud": ["Cloud", "Web"],
    "Database": ["Web", "Data Analytics", "Cloud"],
    "UI/UX": ["Web", "Mobile"],
    "GIS": ["GIS"],
    "Blockchain": ["Blockchain"],
    "AR/VR": ["AR/VR"],
    "NLP": ["NLP", "AI/ML"],
    "Robotics": ["Robotics"],
    "Data Analytics": ["Data Analytics", "AI/ML"],
}


def calculate_team_fit(team_skills, ps_tech_tags, ps_description=""):
    """Calculate team-to-PS skill fit.

    Returns: {score, strong_matches, partial_matches, skill_gaps}
    This is a HEURISTIC metric.
    """
    # Map team skills to tech domains
    team_domains = set()
    for skill in team_skills:
        team_domains.update(SKILL_TO_TECH.get(skill, []))

    ps_domains = set(ps_tech_tags)

    if not ps_domains:
        return {
            "score": 50,
            "strong_matches": list(team_skills),
            "partial_matches": [],
            "skill_gaps": [],
            "note": "PS technology requirements unclear — default fit score.",
        }

    strong = team_domains & ps_domains
    gaps = ps_domains - team_domains

    total = len(ps_domains)
    matched = len(strong)
    score = round((matched / max(total, 1)) * 100) if total > 0 else 50

    # Partial matches: team skills that are adjacent to PS requirements
    partial = []
    for gap in gaps:
        for skill, domains in SKILL_TO_TECH.items():
            if gap in domains and skill not in team_skills:
                partial.append(skill)
                break

    return {
        "score": min(score, 100),
        "strong_matches": list(strong),
        "partial_matches": partial[:5],
        "skill_gaps": list(gaps),
        "note": None,
    }


# ── Gemini API Integration ──────────────────────────────────────────────────

def analyze_ps_with_gemini(ps_title, ps_description, api_key=None):
    """Analyze a problem statement using Google Gemini API.

    Returns AI-generated summary, tech recommendations, and complexity insights.
    Falls back gracefully if API call fails or key is missing.
    """
    import os
    import json
    import urllib.request

    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}"
    prompt = f"""
Analyze the following Smart India Hackathon 2026 Problem Statement:
Title: {ps_title}
Description: {ps_description[:1000]}

Provide a JSON response with:
1. "ai_summary": 2-sentence executive summary for student hackathon teams.
2. "suggested_tech_stack": list of 3-5 recommended technologies/frameworks.
3. "key_challenges": list of 2 potential technical hurdles.
Respond ONLY with valid JSON.
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            # Clean JSON markdown if wrapped
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            return json.loads(text)
    except Exception as e:
        print(f"Gemini API Notice: {e}")
        return None

