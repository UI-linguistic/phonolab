## Phonolab API Overview

This API supports audio, quizzes, lessons, and user tracking.

---

### Audio Routes

| Operation | Endpoint                                          | Method | Status |
|-----------|---------------------------------------------------|--------|--------|
| Serve Vowel Audio      | `/audio/vowels/<filename>`           | `GET`  | ✅     |
| Serve Word Example     | `/audio/word_examples/<filename>`    | `GET`  | ✅     |

---

### Lessons API

| Operation   | Endpoint                                | Method | Status |
|------------|------------------------------------------|--------|--------|
| **List**   | `/lessons/`                              | `GET`  | ✅     |
| **Retrieve** | `/lessons/<int:lesson_id>`             | `GET`  | ✅     |
| **By Vowel** | `/lessons/vowel/<vowel_id>`            | `GET`  | ✅     |
| **Create** | `/lessons/`                              | `POST` | ✅     |
| **Update** | `/lessons/<int:lesson_id>`               | `PUT`  | ✅     |
| **Delete** | `/lessons/<int:lesson_id>`               | `DELETE`| ✅    |

---

### Vowels & Word Examples API

| Operation            | Endpoint                                 | Method | Status |
|---------------------|-------------------------------------------|--------|--------|
| **List Vowels**     | `/vowels/`                                | `GET`  | ✅     |
| **Create Vowel**    | `/vowels/`                                | `POST` | ✅     |
| **Word by ID**      | `/vowels/word-example/<int:example_id>`   | `GET`  | ✅     |
| **Word by Name**    | `/vowels/word-example?word=<name>`        | `GET`  | ✅     |

---

### Quizzes API

| Operation     | Endpoint                      | Method | Status |
|--------------|-------------------------------|--------|--------|
| **List**     | `/quiz/`                      | `GET`  | ✅     |
| **Get**      | `/quiz/<int:quiz_id>`         | `GET`  | ✅     |
| **Create**   | `/quiz/`                      | `POST` | ✅     |
| **Update**   | `/quiz/<int:quiz_id>`         | `PUT`  | ✅     |
| **Delete**   | `/quiz/<int:quiz_id>`         | `DELETE`| ✅    |

---

### User Tracking API

| Operation            | Endpoint                        | Method | Status |
|---------------------|----------------------------------|--------|--------|
| **Log Quiz Score**  | `/user/quiz-score`              | `POST` | ✅     |
| **Get Quiz Score**  | `/user/quiz-score`              | `GET`  | ✅     |

---

### Example Usage

```bash
# Create a lesson
curl -X POST http://localhost:5000/lessons/ \
  -H "Content-Type: application/json" \
  -d '{"vowel_id": "v1", "instructions": ["Click play", "Listen carefully", "Repeat"]}'

# Submit quiz score
curl -X POST http://localhost:5001/user/quiz-score \
  -H "Content-Type: application/json" \
  -d '{
        "session_id": "abc123",
        "quiz_id": 1,
        "answers": [
          {"is_correct": true},
          {"is_correct": false}
        ]
      }'
```

---

### 📂 Project Structure

```
backend/
│
├── src/
│   ├── api/
│   │   ├── audio.py
│   │   ├── lesson.py
│   │   ├── phoneme.py
│   │   ├── quiz.py
│   │   └── user.py
│   ├── services/
│   ├── models/
│   └── utils/
├── scripts/  ← (seeding scripts) temp files
└── static/audio/
    ├── vowels/
    └── word_examples/
```

---

### TODO

- [ ] Paginate lessons and quizzes ?
- [ ] Add stats tracking for individual words

---

**Maintainer:** _@dndrade_  
_Last updated: April 2025_
