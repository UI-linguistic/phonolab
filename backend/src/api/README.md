## API Overview

API endpoints, their parameters, and expected responses.

## Lesson

<details>
<summary>Lesson endpoints provide access to phonetic lessons and their content.</summary>

### `GET /api/lessons/`

Retrieves all available lessons.

**Returns:** 
- Success response with an array of lesson objects:
```json
{
  "status": "success",
  "message": "Lessons retrieved successfully",
  "data": {
    "lessons": [
      {
        "id": 1,
        "name": "Vowels 101",
        "slug": "vowels-101",
        "description": "Learn how vowels are categorized by tongue position, lip shape, and length.",
        "sections": [
          {
            "id": 1,
            "name": "Section Name",
            "slug": "section-slug",
            "cells": [
              {
                "id": 1,
                "col": 1,
                "lip_type": "rounded",
                "length_type": "long",
                "vowels": [
                  {
                    "id": 1,
                    "ipa": "iː",
                    "audio_url": "/audio/vowels/01-i_close_front_unrounded_vowel.mp3",
                    "lip_image_url": "/images/lips/unrounded.png",
                    "tongue_image_url": "/images/tongue/close_front.png"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```
- Error response if retrieval fails

### `GET /api/lessons/<int:lesson_id>`

Retrieves a specific lesson by its ID.

**Parameters:**
- `lesson_id`: The ID of the lesson to retrieve

**Returns:**
- Success response with the formatted lesson data:
```json
{
  "status": "success",
  "message": "Lesson 'Vowels 101' retrieved successfully",
  "data": {
    "id": 1,
    "name": "Vowels 101",
    "slug": "vowels-101",
    "description": "Learn how vowels are categorized by tongue position, lip shape, and length.",
    "sections": [
      {
        "id": 1,
        "name": "Section Name",
        "slug": "section-slug",
        "cells": [
          {
            "id": 1,
            "col": 1,
            "lip_type": "rounded",
            "length_type": "long",
            "vowels": [
              {
                "id": 1,
                "ipa": "iː",
                "audio_url": "/audio/vowels/01-i_close_front_unrounded_vowel.mp3",
                "lip_image_url": "/images/lips/unrounded.png",
                "tongue_image_url": "/images/tongue/close_front.png"
              }
            ]
          }
        ]
      }
    ]
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

### `GET /api/lessons/<string:slug>`

Retrieves a specific lesson by its slug.

**Parameters:**
- `slug`: The slug of the lesson to retrieve

**Returns:**
- Success response with the formatted lesson data:
```json
{
  "status": "success",
  "message": "Lesson 'Vowels 101' retrieved successfully",
  "data": {
    "id": 1,
    "name": "Vowels 101",
    "slug": "vowels-101",
    "description": "Learn how vowels are categorized by tongue position, lip shape, and length.",
    "sections": [
      {
        "id": 1,
        "name": "Section Name",
        "slug": "section-slug",
        "cells": [
          {
            "id": 1,
            "col": 1,
            "lip_type": "rounded",
            "length_type": "long",
            "vowels": [
              {
                "id": 1,
                "ipa": "iː",
                "audio_url": "/audio/vowels/01-i_close_front_unrounded_vowel.mp3",
                "lip_image_url": "/images/lips/unrounded.png",
                "tongue_image_url": "/images/tongue/close_front.png"
              }
            ]
          }
        ]
      }
    ]
  }
}
```
- 404 error if the lesson is not found:
```json
{
  "status": "error",
  "message": "Lesson with identifier 'slug' not found"
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
│       └── response.py
└── static/
```

---

**Maintainer:** _@dndrade_  
_Last updated: May 7 2025_
