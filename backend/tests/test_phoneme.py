from .fixtures import VOWEL_SHORT_A, VOWEL_SHORT_A_DIFFERENT_ID, VOWEL_SHORT_A_DUPLICATE


class TestVowel:
    def test_vowel_creation(self):
        vowel = VOWEL_SHORT_A

        assert vowel.id == "v1"
        assert vowel.phoneme == "a"
        assert vowel.name == "Short A"
        assert vowel.word_example == "cat"
        assert vowel.ipa_example == "kæt"
        assert vowel.color_code == "#FF5733"
        assert vowel.audio_url == "https://data.com/audio/short_a.mp3"
        assert vowel.description == "The short 'a' sound as in 'cat'."

    def test_vowel_equality(self):
        vowel1 = VOWEL_SHORT_A
        vowel2 = VOWEL_SHORT_A_DUPLICATE

        assert vowel1 == vowel2

    def test_vowel_inequality(self):
        vowel1 = VOWEL_SHORT_A
        vowel2 = VOWEL_SHORT_A_DIFFERENT_ID

        assert vowel1 != vowel2

    def test_vowel_representation(self):
        vowel = VOWEL_SHORT_A

        repr_str = str(vowel)
        assert "Vowel" in repr_str
        assert "id='v1'" in repr_str
        assert "phoneme='a'" in repr_str
        assert "name='Short A'" in repr_str
