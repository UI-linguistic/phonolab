import json
from src.app import create_app, db
from src.models.quiz import QuizItem, QuizOption


app = create_app()

with app.app_context():
    with open("backend/scripts/data_quiz.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data["quiz"]:
        sample = item["samples"][0]

        quiz = QuizItem(
            prompt_word=sample["text"],
            prompt_ipa=sample["IPA"],
            prompt_audio_url=sample["audio"],
            feedback_correct=item["feedback"]["correct"],
            feedback_incorrect=item["feedback"]["incorrect"]
        )

        # Add correct options
        for opt in item["options_pool"]["correct_answers"]:
            quiz.options.append(QuizOption(
                word=opt["word"],
                ipa=opt["IPA"],
                audio_url=opt["audio"],
                is_correct=True,
                language=opt["language"]
            ))

        # Add wrong option
        wrong = item["options_pool"]["wrong_answers"][0]
        quiz.options.append(QuizOption(
            word=wrong["word"],
            ipa=wrong["IPA"],
            audio_url=wrong["audio"],
            is_correct=False,
            language=wrong["language"]
        ))

        db.session.add(quiz)

    db.session.commit()
    print("✅ Quiz data seeded successfully.")
