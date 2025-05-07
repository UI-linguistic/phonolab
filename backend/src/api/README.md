# API Documentation for Phonolab

## API Overview

API endpoints, their parameters, and expected responses.

## Lesson

<details>
<summary>Lesson endpoints provide access to phonetic lessons and their content.</summary>

### `GET /api/lessons/vowels-101`

Retrieves all sections of the 'vowels-101' lesson.

**Returns:** 
- Success response with all sections of the vowels-101 lesson:
```json
{
  "status": "success",
  "message": "Sections for lesson 'vowels-101' retrieved successfully",
  "data": {
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
      },
      // Additional sections...
    ]
  }
}
```
- Error response if retrieval fails

### `GET /api/lessons/vowels-101/<int:section_id>`

Retrieves a specific section from the "Vowels 101" lesson by its ID.

**Parameters:**
- `section_id`: The ID of the section to retrieve (1, 2, or 3)

**Returns:**
- Success response with the section data:
```json
{
  "status": "success",
  "message": "Section 1 retrieved successfully",
  "data": {
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
}
```
- 404 error if the section is not found:
```json
{
  "status": "error",
  "message": "Section with identifier '999' not found"
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
