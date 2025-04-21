# src/api/learn_api.py
from flask import Blueprint, jsonify
from models.phoneme import Vowel
from datetime import datetime

learn_bp = Blueprint("learn", __name__, url_prefix="/learn")

# temporary
sample_lesson = Vowel(
    id="v1",
    phoneme="æ",
    name="Short A",
    word_example="cat",
    ipa_example="kæt",
    color_code="#FF99AA",
    audio_url="/static/audio/cat.mp3",
    description="The vowel sound in 'cat'."
)

@learn_bp.route("/<int:lesson_id>", methods=["GET"])
def serve_lesson(lesson_id):
    # HW10 only supports 1 lesson
    if lesson_id != 1:
        return jsonify({"error": "Lesson not found"}), 404

    return jsonify({
        "lesson": sample_lesson.__dict__,
        "timestamp": datetime.utcnow().isoformat()
    })
