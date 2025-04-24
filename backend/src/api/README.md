## 📡 Phonolab API Overview

This API supports audio, quizzes, lessons, and user tracking.

---

### Audio Routes

| Operation         | Endpoint                                          | Method | Status |
|------------------|---------------------------------------------------|--------|--------|
| Serve Vowel Audio       | `/audio/vowels/<filename>`           | `GET`  | ✅     |
| Serve Word Example Audio| `/audio/word_examples/<filename>`    | `GET`  | ✅     |

---

### Lessons API

#### **Public Routes (Frontend)**

| Operation         | Endpoint                                 | Method | Status |
|------------------|-------------------------------------------|--------|--------|
| Get Lesson        | `/lessons/<int:lesson_id>`               | `GET`  | ✅     |
| Get by Vowel ID   | `/lessons/vowel/<vowel_id>`              | `GET`  | ✅     |

#### **Admin Routes (Internal CRUD)**

| Operation     | Endpoint                                  | Method | Status |
|--------------|--------------------------------------------|--------|--------|
| List Lessons  | `/admin/lesson/`                         | `GET`  | ✅     |
| Get Lesson    | `/admin/lesson/<int:lesson_id>`          | `GET`  | ✅     |
| Create        | `/admin/lesson/`                         | `POST` | ✅     |
| Update        | `/admin/lesson/<int:lesson_id>`          | `PUT`  | ✅     |
| Delete        | `/admin/lesson/<int:lesson_id>`          | `DELETE`| ✅    |

---

### Quizzes API

#### **Public Routes (Frontend)**

| Operation     | Endpoint                         | Method | Status |
|--------------|----------------------------------|--------|--------|
| Get Quiz     | `/quiz/<int:quiz_id>`            | `GET`  | ✅     |

#### **Admin Routes (Internal CRUD)**

| Operation     | Endpoint                         | Method | Status |
|--------------|----------------------------------|--------|--------|
| List Quizzes | `/admin/quiz/`                   | `GET`  | ✅     |
| Create       | `/admin/quiz/`                   | `POST` | ✅     |
| Update       | `/admin/quiz/<int:quiz_id>`      | `PUT`  | ✅     |
| Delete       | `/admin/quiz/<int:quiz_id>`      | `DELETE`| ✅    |

---

### Vowels & Word Examples API

| Operation            | Endpoint                                 | Method | Status |
|---------------------|-------------------------------------------|--------|--------|
| List Vowels         | `/vowel/`                                | `GET`  | ✅     |
| Create Vowel        | `/vowel/`                                | `POST` | ✅     |
| Get Word by ID      | `/vowel/word-example/<int:example_id>`   | `GET`  | ✅     |
| Get Word by Name    | `/vowel/word-example?word=<name>`        | `GET`  | ✅     |

---

### User Tracking API

| Operation            | Endpoint                        | Method | Status |
|---------------------|----------------------------------|--------|--------|
| Log Quiz Score      | `/user/quiz-score`              | `POST` | todo     |
| Get Quiz Score      | `/user/quiz-score`              | `GET`  | todo     |

---

### Example Usage

```bash
# Create a lesson (Admin)
curl -X POST http://localhost:5000/admin/lesson/ \
  -H "Content-Type: application/json" \
  -d '{"vowel_id": "v1", "instructions": ["Click play", "Listen carefully", "Repeat"]}'

# Fetch a formatted quiz for frontend display
curl http://localhost:5000/quiz/1

# Submit quiz score
curl -X POST http://localhost:5000/user/quiz-score \
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
├── scripts/
└── static/audio/
    ├── vowels/
    └── word_examples/
```


---

**Maintainer:** _@dndrade_  
_Last updated: April 2025_
