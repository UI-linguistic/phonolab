# src/api/phoneme.py

# from flask import Blueprint, request
# from src.db import db
# from src.models.phoneme import Vowel, WordExample
# from src.utils.format import error_response, success_response
# from src.services.phoneme import (
#     get_all_vowels,
#     get_vowel_by_id,
#     get_word_examples_by_vowel_id,
#     get_word_example_by_id,
#     get_word_example_by_word,
#     create_vowel,
#     create_word_example,
#     update_vowel,
#     update_word_example,
#     delete_vowel,
#     delete_word_example
# )

# phoneme_bp = Blueprint("phoneme", __name__, url_prefix="/vowel")



        # implementation paused



# @phoneme_bp.route("/", methods=["POST"])
# def add_vowel():
#     data = request.get_json()
#     required_fields = ["id", "phoneme", "name", "ipa_example", "color_code", "audio_url", "description"]
#     for field in required_fields:
#         if field not in data:
#             return error_response(f"Missing required field: {field}", 400)
    
#     vowel, error = create_vowel(data)
#     if error:
#         return error_response(error, 400)
    
#     return success_response("Vowel created", {"vowel": vowel.to_dict()}, 201)

# @phoneme_bp.route("/", methods=["GET"])
# def fetch_all_vowels():
#     try:
#         vowels = get_all_vowels()
#         return success_response("Vowels retrieved", {"vowels": [v.to_dict() for v in vowels]})
#     except Exception as e:
#         return error_response(f"Error retrieving vowels: {str(e)}")

# @phoneme_bp.route("/<string:vowel_id>", methods=["GET"])
# def fetch_vowel_by_id(vowel_id):
#     vowel = get_vowel_by_id(vowel_id)
#     if not vowel:
#         return error_response(f"Vowel with ID {vowel_id} not found", 404)
    
#     return success_response("Vowel retrieved", {"vowel": vowel.to_dict()})

# @phoneme_bp.route("/<string:vowel_id>", methods=["PUT"])
# def update_vowel_by_id(vowel_id):
#     data = request.get_json()
#     vowel, error = update_vowel(vowel_id, data)
    
#     if error:
#         return error_response(error, 404 if "not found" in error.lower() else 400)
    
#     return success_response("Vowel updated", {"vowel": vowel.to_dict()})

# @phoneme_bp.route("/<string:vowel_id>", methods=["DELETE"])
# def delete_vowel_by_id(vowel_id):
#     success, error = delete_vowel(vowel_id)
    
#     if error:
#         return error_response(error, 404 if "not found" in error.lower() else 400)
    
#     return success_response("Vowel deleted", {})

# @phoneme_bp.route("/<string:vowel_id>/word-examples", methods=["GET"])
# def fetch_word_examples_for_vowel(vowel_id):
#     examples = get_word_examples_by_vowel_id(vowel_id)
    
#     if examples is None:
#         return error_response(f"Vowel with ID {vowel_id} not found", 404)
    
#     return success_response(
#         f"Word examples for vowel {vowel_id} retrieved", 
#         {"examples": [e.to_dict() for e in examples]}
#     )

# # --- Word Example Routes ---
# @phoneme_bp.route("/word-example/<int:example_id>", methods=["GET"])
# def fetch_word_example_by_id_route(example_id):
#     example = get_word_example_by_id(example_id)
#     if not example:
#         return error_response("Word example not found", 404)
    
#     return success_response("Word example retrieved", {"example": example.to_dict()})

# @phoneme_bp.route("/word-example", methods=["GET"])
# def fetch_word_example_by_name_route():
#     word = request.args.get("word")
#     if not word:
#         return error_response("Missing 'word' query parameter", 400)
    
#     example = get_word_example_by_word(word)
#     if not example:
#         return error_response("Word example not found", 404)
    
#     return success_response("Word example retrieved", {"example": example.to_dict()})

# @phoneme_bp.route("/word-example", methods=["POST"])
# def add_word_example():
#     data = request.get_json()
#     required_fields = ["vowel_id", "word", "audio_url"]
    
#     for field in required_fields:
#         if field not in data:
#             return error_response(f"Missing required field: {field}", 400)
    
#     example, error = create_word_example(data)
#     if error:
#         return error_response(error, 400)
    
#     return success_response("Word example created", {"example": example.to_dict()}, 201)

# @phoneme_bp.route("/word-example/<int:example_id>", methods=["PUT"])
# def update_word_example_route(example_id):
#     data = request.get_json()
#     example, error = update_word_example(example_id, data)
    
#     if error:
#         return error_response(error, 404 if "not found" in error.lower() else 400)
    
#     return success_response("Word example updated", {"example": example.to_dict()})

# @phoneme_bp.route("/word-example/<int:example_id>", methods=["DELETE"])
# def delete_word_example_route(example_id):
#     success, error = delete_word_example(example_id)
    
#     if error:
#         return error_response(error, 404 if "not found" in error.lower() else 400)
    
#     return success_response("Word example deleted", {})
