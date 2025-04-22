"""
Test fixtures for phoneme models.
"""
from models.phoneme import Vowel

# Standard vowel fixture
VOWEL_SHORT_A = Vowel(
    id="v1",
    phoneme="a",
    name="Short A",
    word_example="cat",
    ipa_example="kæt",
    color_code="#FF5733",
    audio_url="https://data.com/audio/short_a.mp3",
    description="The short 'a' sound as in 'cat'."
)

# Another vowel with the same attributes (for equality testing)
VOWEL_SHORT_A_DUPLICATE = Vowel(
    id="v1",
    phoneme="a",
    name="Short A",
    word_example="cat",
    ipa_example="kæt",
    color_code="#FF5733",
    audio_url="https://data.com/audio/short_a.mp3",
    description="The short 'a' sound as in 'cat'."
)


VOWEL_SHORT_A_DIFFERENT_ID = Vowel(
    id="v2",
    phoneme="a",
    name="Short A",
    word_example="cat",
    ipa_example="kæt",
    color_code="#FF5733",
    audio_url="https://data.com/audio/short_a.mp3",
    description="The short 'a' sound as in 'cat'."
)

# missing fields
VOWEL_MINIMAL = Vowel(
    id="v3",
    phoneme="e",
    name="Short E",
    word_example="bed",
    ipa_example="bɛd",
    color_code="#33FF57",
    audio_url="",
    description=""
)

# for testing collections
SAMPLE_VOWELS = [
    VOWEL_SHORT_A,
    Vowel(
        id="v4",
        phoneme="i",
        name="Short I",
        word_example="sit",
        ipa_example="sɪt",
        color_code="#5733FF",
        audio_url="https://data.com/audio/short_i.mp3",
        description="The short 'i' sound as in 'sit'."
    ),
    Vowel(
        id="v5",
        phoneme="o",
        name="Short O",
        word_example="hot",
        ipa_example="hɒt",
        color_code="#FF3357",
        audio_url="https://data.com/audio/short_o.mp3",
        description="The short 'o' sound as in 'hot'."
    )
]


def create_custom_vowel(id="custom", **kwargs):
    """Create a custom vowel with specified attributes."""
    default_values = {
        "phoneme": "custom",
        "name": "Custom Vowel",
        "word_example": "example",
        "ipa_example": "ɛgzæmpəl",
        "color_code": "#CCCCCC",
        "audio_url": "https://data.com/audio/custom.mp3",
        "description": "A custom vowel for testing."
    }

    default_values.update(kwargs)
    default_values["id"] = id

    return Vowel(**default_values)
