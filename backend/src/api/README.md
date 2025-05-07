## API Overview

API endpoints, their parameters, and expected responses.

## Lesson

<details>
<summary>Lesson endpoints provide access to phonetic lessons and their content.</summary>

### `GET /api/lesson/`

Retrieves all available lessons.

**Returns:** 
- Success response with an array of lesson objects:
```json
{
  "status": "success",
  "message": "Lessons retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Vowels 101",
      "description": "Learn how vowels are categorized by tongue position, lip shape, and length.",
      "lesson_mode_id": 1,
      "type": "vowel_lesson"
    }
    // Additional lessons when implemented...
  ]
}
```
- Error response if retrieval fails

### `GET /api/lesson/id/<int:lesson_id>`

Retrieves a specific lesson by its ID.

**Parameters:**
- `lesson_id`: The ID of the lesson to retrieve

**Returns:**
- Success response with the formatted lesson data:
```json
{
  "status": "success",
  "message": "Lesson retrieved successfully",
  "data": {
    "id": 1,
    "title": "Lip Shape",
    "description": "Learn vowels organized by lip shape",
    "lesson_mode": {
      "id": 1,
      "name": "Lip Shape",
      "slug": "lip-shape"
    },
    "content": {
      "title": "Lip Shape",
      "caption": "Click a lip to highlight the matching vowels and hear their sounds.",
      "lip_shape_table": [
        [
          {
            "id": "v1",
            "ipa": "iː",
            "audio_url": "/audio/vowels/01-i_close_front_unrounded_vowel.mp3"
          },
          {
            "id": "v2",
            "ipa": "ɪ",
            "audio_url": "/audio/vowels/02-ɪ_near_close_near_front_unrounded_vowel.mp3"
          }
        ],
        // Additional rows in the table...
      ],
      "lip_shape_images": {
        "unrounded": "/static/images/lips/unrounded.png",
        "rounded": "/static/images/lips/rounded.png"
      }
    },
    "type": "interactive"
  }
}
```
- 404 error if the lesson is not found:
```json
{
  "status": "error",
  "message": "Lesson with identifier '999' not found"
}
```
- 500 error if formatting fails:
```json
{
  "status": "error",
  "message": "Error message describing what went wrong",
  "error_code": "error_type"
}
```
</details>

## Response Format

<details>
<summary>Standard response format for all API endpoints</summary>

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful message",
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message describing what went wrong",
  "error_code": "error_type"
}
```

### Not Found Response

```json
{
  "status": "error",
  "message": "Resource with identifier 'xyz' not found"
}
```
</details>

### 📂 Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── lesson.py
│   ├── services/
│   │   └── lesson.py
│   ├── models/
│   └── utils/
│       └── format.py
└── static/
```

---

**Maintainer:** _@dndrade_  
_Last updated: May 2025_
