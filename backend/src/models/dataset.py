# import json
# from typing import Dict, List

# from .quiz import VowelEntry


# class VowelSet:
#     def __init__(self):
#         self.vowels: List[VowelEntry] = []

#     def add(self, entry: VowelEntry):
#         self.vowels.append(entry)

#     def to_dict(self) -> List[Dict]:
#         return [v.to_dict() for v in self.vowels]

#     def to_json(self, path: str):
#         with open(path, "w", encoding="utf-8") as f:
#             json.dump(self.to_dict(), f, indent=2, ensure_ascii=False)
