from models.phoneme import ColorMapPosition, ComparisonPair
from models.quiz import VowelEntry


# temporary
lesson_1 = VowelEntry(
    id="ae",
    phoneme="æ",
    name="Short A",
    word_example="cat",
    ipa_example="/kæt/",
    color_code="#FF9999",
    audio_url="/audio/cat_ae.mp3",
    description="The vowel sound in 'cat'.",
    quiz_items=[],
    map_location=ColorMapPosition(x=0.2, y=0.7, region="front-low"),
    comparison_set=ComparisonPair(
        contrast_with="ɛ",
        word_a="cat",
        word_b="bed",
        audio_url_a="/audio/cat.mp3",
        audio_url_b="/audio/bed.mp3",
        note="æ is more open than ɛ."
    )
)

def get_lesson(lesson_id: int):
    if lesson_id == 1:
        return lesson_1
    return None
