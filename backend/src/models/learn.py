# TODO:
#   1. learn module
#       - id (endpoint)
#       - Vowel Object
#       - sample text pronounciation
#       - Instructions List (5 items)
#       

# src/models/learn.py

from dataclasses import dataclass, field
from typing import List
from .phoneme import Vowel


@dataclass
class LearnLesson:
    id: int
    vowel: Vowel                   
    sample_text: str 
    instructions: List[str] = field(default_factory=list)
