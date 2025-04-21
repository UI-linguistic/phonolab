# src/api/track_api.py
from flask import Blueprint, request, jsonify
from datetime import datetime

track_bp = Blueprint("track", __name__, url_prefix="/track")

page_hits = []

@track_bp.route("/log", methods=["POST"])
def log_entry():
    data = request.get_json()
    entry = {
        "page": data.get("page"),
        "timestamp": datetime.utcnow().isoformat()
    }
    page_hits.append(entry)
    return jsonify({"status": "logged", "entry": entry})
