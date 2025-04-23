# src/api/phoneme.py

from flask import Blueprint, request

from src.db import db
from src.models.phoneme import Vowel
from src.services.phoneme import get_word_example_by_id, get_word_example_by_name
from src.utils.format import error_response, success_response

phoneme_bp = Blueprint("phoneme", __name__, url_prefix="/vowels")


# --- Vowel Routes ---

@phoneme_bp.route("/", methods=["POST"])
def add_vowel():
    data = request.get_json()

    required_fields = ["id", "phoneme", "name", "ipa_example", "color_code", "audio_url", "description"]
    for field in required_fields:
        if field not in data:
            return error_response(f"Missing required field: {field}", 400)

    if Vowel.query.get(data["id"]):
        return error_response("Vowel with this ID already exists", 400)

    vowel = Vowel(**data)
    db.session.add(vowel)
    db.session.commit()

    return success_response("Vowel created", {"vowel": vowel.to_dict()}, 201)


@phoneme_bp.route("/", methods=["GET"])
def get_all_vowels():
    try:
        vowels = Vowel.query.all()
        return success_response("Vowels retrieved", {"vowels": [v.to_dict() for v in vowels]})
    except Exception as e:
        return error_response(f"Error retrieving vowels: {str(e)}")


# --- Word Example Routes ---

@phoneme_bp.route("/word-example/<int:example_id>", methods=["GET"])
def fetch_word_example_by_id(example_id):
    example = get_word_example_by_id(example_id)
    if not example:
        return error_response("Word example not found", 404)
    return success_response("Word example retrieved", {"example": example.to_dict()})


@phoneme_bp.route("/word-example", methods=["GET"])
def fetch_word_example_by_name():
    word = request.args.get("word")
    if not word:
        return error_response("Missing 'word' query parameter", 400)

    example = get_word_example_by_name(word)
    if not example:
        return error_response("Word example not found", 404)

    return success_response("Word example retrieved", {"example": example.to_dict()})
