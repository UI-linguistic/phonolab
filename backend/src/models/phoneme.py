from dataclasses import dataclass
from typing import Optional


@dataclass
class Vowel:
    id: str
    phoneme: str
    name: str
    word_example: str
    ipa_example: str
    color_code: str
    audio_url: str
    description: str


@dataclass
class ColorMapPosition:
    x: float
    y: float
    region: str


@dataclass
class ComparisonPair:
    contrast_with: str
    word_a: str
    word_b: str
    audio_url_a: str
    audio_url_b: str
    note: Optional[str] = None
