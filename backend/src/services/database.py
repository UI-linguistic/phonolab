import json
import os
from src.config import Config

def setup_tricky_vowel_pairs():
    """
    Set up the tricky vowel pairs in the database.
    This should be run once to establish the relationships.
    Loads pairs from the data/tricky_vowel_pairs.json file.
    """
    # Load tricky pairs from JSON file
    json_path = os.path.join(Config.BASE_DIR, 'data', 'tricky_vowel_pairs.json')
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            tricky_pairs = data.get('tricky_pairs', [])
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading tricky vowel pairs: {e}")
        return False
    
    # Clear existing pairs (optional)
    db.session.execute(tricky_vowel_pairs.delete())
    
    # Add each pair to the database
    for pair in tricky_pairs:
        vowel1 = Vowel.query.filter_by(phoneme=pair["vowels"][0]).first()
        vowel2 = Vowel.query.filter_by(phoneme=pair["vowels"][1]).first()
        
        if vowel1 and vowel2:
            # Check if this pair already exists
            stmt = db.select([tricky_vowel_pairs]).where(
                db.and_(
                    tricky_vowel_pairs.c.vowel1_id == vowel1.id,
                    tricky_vowel_pairs.c.vowel2_id == vowel2.id
                )
            )
            existing = db.session.execute(stmt).fetchone()
            
            if not existing:
                # Insert the new pair
                db.session.execute(
                    tricky_vowel_pairs.insert().values(
                        vowel1_id=vowel1.id,
                        vowel2_id=vowel2.id,
                        category=pair["category"],
                        description=pair["description"]
                    )
                )
    
    db.session.commit()
    return True
