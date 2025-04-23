# src/api/quiz_api.py
from flask import Blueprint, request, jsonify
from models.quiz import QuizItem, QuizEngine

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")


# temporary
# engine = QuizEngine([
#     QuizItem(
#         question="Which word has the same vowel as 'cat'?",
#         options=["bat", "bet", "cut"],
#         answer="bat",
#         hint="Think of rhyming sounds."
#     )
# ])

@quiz_bp.route("/<int:index>", methods=["GET"])
def get_quiz(index):
    item = engine.get_quiz_item(index)
    if not item:
        return jsonify({"error": "Quiz item not found"}), 404

    return jsonify({
        "quiz": item.__dict__,
        "index": index
    })

@quiz_bp.route("/<int:index>", methods=["POST"])
def submit(index):
    data = request.get_json()
    selected = data.get("selected")

    result = engine.submit_answer(index, selected)
    if result is None:
        return jsonify({"error": "Invalid submission"}), 400

    return jsonify({"correct": result})

@quiz_bp.route("/result", methods=["GET"])
def result():
    return jsonify(engine.get_result_summary())
