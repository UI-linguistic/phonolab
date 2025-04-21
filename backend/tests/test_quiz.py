import pytest
from src.models.quiz import QuizItem, VowelEntry
from src.models.phoneme import ColorMapPosition, ComparisonPair
from tests.fixtures import VOWEL_SHORT_A, create_custom_vowel


class TestQuizItem:
    def test_quiz_item_creation(self):
        # Test both with and without hint in a single test
        quiz_item = QuizItem(
            question="What is the IPA symbol for the vowel in 'cat'?",
            options=["æ", "ɪ", "e", "ɛ"],
            answer="æ"
        )

        assert quiz_item.question == "What is the IPA symbol for the vowel in 'cat'?"
        assert quiz_item.options == ["æ", "ɪ", "e", "ɛ"]
        assert quiz_item.answer == "æ"
        assert quiz_item.hint is None
        assert quiz_item.answer in quiz_item.options

        # With hint
        quiz_item_with_hint = QuizItem(
            question="Question",
            options=["A", "B"],
            answer="A",
            hint="This is a hint."
        )

        assert quiz_item_with_hint.hint == "This is a hint."


class TestVowelEntry:
    @pytest.fixture
    def sample_quiz_items(self):
        return [
            QuizItem(
                question="Question 1",
                options=["A", "B", "C"],
                answer="A"
            ),
            QuizItem(
                question="Question 2",
                options=["X", "Y", "Z"],
                answer="Z"
            )
        ]

    @pytest.fixture
    def sample_map_location(self):
        return ColorMapPosition(x=10, y=20, region="front")

    @pytest.fixture
    def sample_comparison_pair(self):
        return ComparisonPair(
            contrast_with="ɛ",
            word_a="cat",
            word_b="cet",
            audio_url_a="https://example.com/audio/cat.mp3",
            audio_url_b="https://example.com/audio/cet.mp3",
            note="Sample note"
        )

    def test_vowel_entry_creation(self):
        """Test basic VowelEntry creation and inheritance from Vowel."""
        vowel_entry = VowelEntry(
            id=VOWEL_SHORT_A.id,
            phoneme=VOWEL_SHORT_A.phoneme,
            name=VOWEL_SHORT_A.name,
            word_example=VOWEL_SHORT_A.word_example,
            ipa_example=VOWEL_SHORT_A.ipa_example,
            color_code=VOWEL_SHORT_A.color_code,
            audio_url=VOWEL_SHORT_A.audio_url,
            description=VOWEL_SHORT_A.description
        )

        assert vowel_entry.id == "v1"
        assert vowel_entry.phoneme == "a"

        # default properties
        assert vowel_entry.quiz_items == []
        assert vowel_entry.map_location is None
        assert vowel_entry.comparison_set is None

        custom_vowel = create_custom_vowel(
            id="custom1",
            phoneme="u",
            name="Custom U",
            word_example="boot"
        )

        custom_entry = VowelEntry(
            id=custom_vowel.id,
            phoneme=custom_vowel.phoneme,
            name=custom_vowel.name,
            word_example=custom_vowel.word_example,
            ipa_example=custom_vowel.ipa_example,
            color_code=custom_vowel.color_code,
            audio_url=custom_vowel.audio_url,
            description=custom_vowel.description
        )

        assert custom_entry.id == "custom1"
        assert custom_entry.phoneme == "u"

    def test_vowel_entry_with_extended_properties(self, sample_quiz_items,
                                                  sample_map_location,
                                                  sample_comparison_pair):
        vowel_entry = VowelEntry(
            id="test_id",
            phoneme="test_phoneme",
            name="Test Name",
            word_example="test",
            ipa_example="test",
            color_code="#000000",
            audio_url="test.mp3",
            description="Test description",
            quiz_items=sample_quiz_items,
            map_location=sample_map_location,
            comparison_set=sample_comparison_pair
        )

        assert len(vowel_entry.quiz_items) == 2
        assert vowel_entry.map_location.x == 10
        assert vowel_entry.map_location.region == "front"
        assert vowel_entry.comparison_set.contrast_with == "ɛ"
        assert vowel_entry.comparison_set.word_a == "cat"

    def test_vowel_entry_to_dict(self, sample_quiz_items, sample_map_location, sample_comparison_pair):
        """Test the to_dict method correctly serializes all properties."""
        vowel_entry = VowelEntry(
            id="test_id",
            phoneme="test_phoneme",
            name="Test Name",
            word_example="test",
            ipa_example="test",
            color_code="#000000",
            audio_url="test.mp3",
            description="Test description",
            quiz_items=sample_quiz_items,
            map_location=sample_map_location,
            comparison_set=sample_comparison_pair
        )

        result = vowel_entry.to_dict()

        assert result["id"] == "test_id"
        assert result["phoneme"] == "test_phoneme"

        # nested objects check
        assert len(result["quiz_items"]) == 2
        assert result["map_location"]["x"] == 10
        assert result["map_location"]["region"] == "front"
        assert result["comparison_set"]["contrast_with"] == "ɛ"

        # required fields in the serialized output
        assert "audio_url_a" in result["comparison_set"]
        assert "audio_url_b" in result["comparison_set"]
