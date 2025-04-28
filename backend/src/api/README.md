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

**Returns:** 
- An array of lesson objects with the following structure:
```json
[
  {
    "id": 1,
    "vowel_id": "v1",
    "phoneme": "iː",
    "name": "Close Front Unrounded Vowel",
    "description": "A high front unrounded vowel",
    "audio_url": "/audio/vowels/01-i_close_front_unrounded_vowel.mp3",
    "mouth_image_url": "/img/svg/01_i_long_e_mouth.svg",
    "lesson_card": {
      "pronounced": "ee",
      "common_spellings": ["ee", "ea"],
      "lips": "wide smile, unrounded",
      "tongue": "high, front",
      "example_words": ["see", "beat", "team"]
    }
  },
  // Additional lessons...
]
```
- Error response if retrieval fails

### `GET /lesson/<int:lesson_id>`

Retrieves a specific lesson by its ID.

**Parameters:**
- `lesson_id`: The ID of the lesson to retrieve

**Returns:**
- JSON object with the formatted lesson data including vowel information and lesson card
- 404 error if the lesson is not found
- 500 error if formatting fails

### `GET /lesson/vowel/<string:vowel_id>`

Retrieves a lesson associated with a specific vowel.

**Parameters:**
- `vowel_id`: The ID of the vowel (e.g., "v1", "v2")

**Returns:**
- A lesson object with the same structure as the `GET /lesson/<int:lesson_id>` endpoint
- 404 error if the lesson is not found
- 500 error if formatting fails

### `POST /lesson/`

Creates a new lesson for a vowel.

**Expected JSON:**
```json
{
  "vowel_id": "v1"
}
```

**Returns:**
- JSON object with the created lesson data if successful
- 400 error if vowel_id is missing or invalid

### `PUT /lesson/<int:lesson_id>`

Updates an existing lesson.

**Parameters:**
- `lesson_id`: The ID of the lesson to update

**Expected JSON:**
```json
{
  "vowel_id": "v2"
}
```

**Returns:**
- A lesson object with the same structure as the `GET /lesson/<int:lesson_id>` endpoint
- 404 error if the lesson is not found
- 400 error if vowel_id is missing or invalid

### `DELETE /lesson/<int:lesson_id>`

Deletes a lesson.

**Parameters:**
- `lesson_id`: The ID of the lesson to delete

**Returns:**
- Success response with the following structure:
```json
{
  "status": "success",
  "message": "Created X new lessons",
  "data": {
    "count": X
  }
}
```
- 404 error if the lesson is not found

### `POST /lesson/create-all`

Creates lessons for all vowels that don't have lessons yet.

**Returns:**
- Success response with the count of created lessons
- Error response if creation fails

### Lesson Card Structure

The lesson card contains pedagogical information about the vowel sound:

- `pronounced`: A simple pronunciation guide (e.g., "ee", "ah")
- `common_spellings`: Array of common spelling patterns for this vowel sound
- `lips`: Description of lip position when pronouncing the vowel
- `tongue`: Description of tongue position when pronouncing the vowel
- `example_words`: Array of example words containing this vowel sound

### Error Responses

All error responses follow this structure:
```json
{
  "status": "error",
  "message": "Error message describing what went wrong",
  "error": {
    "code": 404,
    "details": "Additional error details if available"
  }
}
```
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


### `GET /quiz/<int:quiz_id>`

Retrieves a quiz by its ID.

**Parameters:**
- `quiz_id`: The ID of the quiz to retrieve

**Returns:**
- The formatted quiz object if found
- 404 error if the quiz is not found


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
