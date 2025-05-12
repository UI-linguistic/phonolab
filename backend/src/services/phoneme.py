# src/services/phoneme.py
from src.models.phoneme import Vowel, WordExample


def get_all_vowels():
    return Vowel.query.all()


def get_vowel_by_id(vowel_id):
    return Vowel.query.get(vowel_id)


def get_word_example_by_id(example_id):
    return WordExample.query.get(example_id)


def get_word_example_by_name(word):
    return WordExample.query.filter_by(word=word).first()

# phase 2
# def get_vowel_by_phoneme(phoneme):
#     return Vowel.query.filter_by(phoneme=phoneme).first()

# def search_vowels_by_region(region):
#     return Vowel.query.join(ColorMapPosition).filter(ColorMapPosition.region == region).all()
