# src/api/audio.py
from flask import Blueprint


audio_bp = Blueprint("audio", __name__)


# @audio_bp.route("/audio/vowels/<path:filename>")
# def serve_vowel_audio(filename):
#     """
#     Serves vowel audio files from the static directory.

#     Example:
#     GET /audio/vowels/1-i_close_front_unrounded_vowel.mp3
#     """
#     audio_dir = os.path.join(current_app.root_path, "..", "static", "audio", "vowels")
#     return send_from_directory(audio_dir, filename)


# @audio_bp.route("/audio/word_examples/<filename>")
# def serve_word_example(filename):
#     return send_from_directory(os.path.join(current_app.root_path, "static/audio/word_examples"), filename)
