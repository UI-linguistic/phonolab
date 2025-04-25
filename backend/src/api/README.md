## API Overview

API endpoints, their parameters, and expected responses.

## Audio

<details>
<summary>Audio endpoints serve static audio files for vowels and word examples.</summary>

### `GET /audio/vowels/<path:filename>`

Serves vowel audio files from the static directory.

**Example:** 
```
GET /audio/vowels/1-i_close_front_unrounded_vowel.mp3
```

**Returns:** The requested audio file

### `GET /audio/word_examples/<filename>`

Serves word example audio files from the static directory.

**Example:**
```
GET /audio/word_examples/example1.mp3
```

**Returns:** The requested audio file
</details>

## Lesson

<details>
<summary>Lesson endpoints provide access to phonetic lessons and their content.</summary>

### `GET /lesson/`

Retrieves all lessons from the database.

**Query Parameters:**
- `format` (optional): Set to "frontend" to get data formatted for the frontend

**Returns:** 
- When `format=frontend`: JSON formatted for the frontend
- Otherwise: A success response with an array of lesson objects

### `GET /lesson/<int:lesson_id>`

Retrieves a specific lesson by its ID.

**Parameters:**
- `lesson_id`: The ID of the lesson to retrieve

**Query Parameters:**
- `format` (optional): Set to "frontend" to get data formatted for the frontend

**Returns:**
- When `format=frontend`: JSON formatted for the frontend
- Otherwise: A success response with the lesson object
- 404 error if the lesson is not found

### `GET /lesson/vowel/<string:vowel_id>`

Retrieves a lesson associated with a specific vowel.

**Parameters:**
- `vowel_id`: The ID of the vowel (e.g., "v1", "v2")

**Query Parameters:**
- `details` (optional): Set to "true" to include detailed information
- `format` (optional): Set to "frontend" to get data formatted for the frontend

**Returns:**
- When `format=frontend`: JSON formatted for the frontend
- Otherwise: A success response with the lesson object
- 404 error if the lesson is not found
</details>

## Phoneme

<details>
<summary>Phoneme endpoints manage vowel phonemes and their word examples.</summary>

### Vowel Operations

<details>
<summary>Endpoints for managing vowel phonemes</summary>

### `GET /phoneme/`

Retrieves all vowel phonemes.

**Returns:** A list of all vowel phonemes in the database

### `GET /phoneme/<string:vowel_id>`

Retrieves a specific vowel by its ID.

**Parameters:**
- `vowel_id`: The ID of the vowel to retrieve (e.g., "v1", "v2")

**Returns:**
- The vowel object if found
- 404 error if the vowel is not found

### `POST /phoneme/`

Adds a new vowel phoneme to the database.

**Expected JSON:**
```json
{
  "phoneme": "ə",
  "name": "Schwa",
  "description": "Mid central vowel"
}
```

**Returns:**
- Success response with the created vowel
- Error response if creation fails

### `PUT /phoneme/<string:vowel_id>`

Updates an existing vowel phoneme.

**Parameters:**
- `vowel_id`: The ID of the vowel to update

**Expected JSON:** Fields to update (phoneme, name, description)

**Returns:**
- Success response with the updated vowel
- 404 error if the vowel is not found

### `DELETE /phoneme/<string:vowel_id>`

Deletes a vowel phoneme.

**Parameters:**
- `vowel_id`: The ID of the vowel to delete

**Returns:**
- Success response if deletion is successful
- 404 error if the vowel is not found
</details>

### Word Example Operations

<details>
<summary>Endpoints for managing word examples</summary>

### `GET /phoneme/<string:vowel_id>/word-examples`

Retrieves all word examples for a specific vowel.

**Parameters:**
- `vowel_id`: The ID of the vowel

**Returns:**
- List of word examples for the specified vowel
- 404 error if the vowel is not found

### `GET /phoneme/word-example`

Retrieves a word example by its name.

**Query Parameters:**
- `word`: The word to search for

**Returns:**
- The word example if found
- 404 error if not found

### `POST /phoneme/word-example`

Adds a new word example.

**Expected JSON:**
```json
{
  "word": "example",
  "vowel_id": "v1",
  "ipa": "ɪgˈzæmpəl",
  "audio_url": "example.mp3"
}
```

**Returns:**
- Success response with the created word example
- Error response if creation fails

### `GET /phoneme/word-example/<int:example_id>`

Retrieves a word example by its ID.

**Parameters:**
- `example_id`: The ID of the word example

**Returns:**
- The word example if found
- 404 error if not found

### `PUT /phoneme/word-example/<int:example_id>`

Updates an existing word example.

**Parameters:**
- `example_id`: The ID of the word example to update

**Expected JSON:** Fields to update (word, vowel_id, ipa, audio_url)

**Returns:**
- Success response with the updated word example
- 404 error if not found

### `DELETE /phoneme/word-example/<int:example_id>`

Deletes a word example.

**Parameters:**
- `example_id`: The ID of the word example to delete

**Returns:**
- Success response if deletion is successful
- 404 error if not found
</details>
</details>

## Quiz

<details>
<summary>Quiz endpoints manage quiz content and user interactions.</summary>

### User Quiz Endpoints

<details>
<summary>Endpoints for user quiz interactions</summary>

### `GET /quiz/<int:quiz_id>`

Retrieves a quiz by its ID.

**Parameters:**
- `quiz_id`: The ID of the quiz to retrieve

**Returns:**
- The formatted quiz object if found
- 404 error if the quiz is not found
</details>

### Admin Quiz Endpoints

<details>
<summary>Endpoints for administrative operations on quizzes</summary>

### `GET /admin/quiz/`

Lists all quizzes (admin only).

**Returns:** A list of all quizzes in the database

### `POST /admin/quiz/`

Creates a new quiz (admin only).

**Expected JSON:** Quiz data including questions and options

**Returns:**
- Success response with the created quiz
- Error response if creation fails

### `GET /admin/quiz/<int:quiz_id>`

Retrieves a quiz by its ID (admin only).

**Parameters:**
- `quiz_id`: The ID of the quiz to retrieve

**Returns:**
- The quiz object if found
- 404 error if the quiz is not found

### `DELETE /admin/quiz/<int:quiz_id>`

Deletes a quiz (admin only).

**Parameters:**
- `quiz_id`: The ID of the quiz to delete

**Returns:**
- Success response if deletion is successful
- 404 error if the quiz is not found
</details>
</details>

## User

<details>
<summary>User endpoints manage user interactions and progress tracking.</summary>

### `POST /user/quiz-score`

Logs a quiz attempt.

**Expected JSON:**
```json
{
  "session_id": "user-session-123",
  "quiz_id": 1,
  "score": 8,
  "total": 10
}
```

**Returns:** Success response with the logged score

### `GET /user/quiz-score`

Gets the most recent quiz score for a session.

**Query Parameters:**
- `session_id`: The user's session ID
- `quiz_id`: The ID of the quiz

**Returns:**
- The quiz score if found
- 404 error if no score is found
</details>

## Response Format

<details>
<summary>Standard response format for all API endpoints</summary>

### Success Response

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": {
    "code": 404,  // HTTP status code
    "details": "Additional error details if available"
  }
}
```
</details>


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
